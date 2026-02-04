/**
 * Real-time Presence Tracker
 * 
 * Tracks user presence, cursor positions, and selections in real-time
 * collaborative editing sessions.
 */

import type {
  UserPresence,
  PresenceUpdate,
  CursorPosition,
  SelectionRange,
  PresenceConfig,
} from '../types';

/**
 * Event handler type for presence updates
 */
type PresenceEventHandler = (update: PresenceUpdate) => void;

/**
 * Presence tracker for managing user presence information
 */
export class PresenceTracker {
  private presences: Map<string, UserPresence> = new Map();
  private handlers: PresenceEventHandler[] = [];
  private config: Required<PresenceConfig>;
  private updateTimer?: NodeJS.Timeout;
  private idleTimer?: NodeJS.Timeout;

  constructor(config: PresenceConfig = {}) {
    this.config = {
      updateInterval: config.updateInterval || 1000,
      idleTimeout: config.idleTimeout || 60000, // 1 minute
      awayTimeout: config.awayTimeout || 300000, // 5 minutes
    };

    this.startPeriodicUpdate();
  }

  /**
   * Add a user presence
   */
  join(presence: Omit<UserPresence, 'lastActive' | 'status'>): void {
    const userPresence: UserPresence = {
      ...presence,
      lastActive: Date.now(),
      status: 'active',
    };

    this.presences.set(presence.userId, userPresence);

    this.emit({
      type: 'join',
      presence: userPresence,
      timestamp: Date.now(),
    });
  }

  /**
   * Remove a user presence
   */
  leave(userId: string): void {
    const presence = this.presences.get(userId);

    if (presence) {
      this.presences.delete(userId);

      this.emit({
        type: 'leave',
        presence,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update cursor position for a user
   */
  updateCursor(userId: string, cursor: CursorPosition): void {
    const presence = this.presences.get(userId);

    if (presence) {
      presence.cursor = cursor;
      presence.lastActive = Date.now();
      presence.status = 'active';

      this.presences.set(userId, presence);

      this.emit({
        type: 'update',
        presence,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update selection for a user
   */
  updateSelection(userId: string, selection: SelectionRange): void {
    const presence = this.presences.get(userId);

    if (presence) {
      presence.selection = selection;
      presence.lastActive = Date.now();
      presence.status = 'active';

      this.presences.set(userId, presence);

      this.emit({
        type: 'update',
        presence,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Update entire presence information
   */
  update(userId: string, updates: Partial<UserPresence>): void {
    const presence = this.presences.get(userId);

    if (presence) {
      Object.assign(presence, updates);
      presence.lastActive = Date.now();

      this.presences.set(userId, presence);

      this.emit({
        type: 'update',
        presence,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Get presence for a specific user
   */
  getPresence(userId: string): UserPresence | undefined {
    return this.presences.get(userId);
  }

  /**
   * Get all active presences
   */
  getAll(): UserPresence[] {
    return Array.from(this.presences.values());
  }

  /**
   * Get all active users (excluding idle/away)
   */
  getActive(): UserPresence[] {
    return this.getAll().filter(p => p.status === 'active');
  }

  /**
   * Get count of active users
   */
  getActiveCount(): number {
    return this.getActive().length;
  }

  /**
   * Subscribe to presence updates
   */
  subscribe(handler: PresenceEventHandler): () => void {
    this.handlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  /**
   * Emit a presence update to all subscribers
   */
  private emit(update: PresenceUpdate): void {
    for (const handler of this.handlers) {
      try {
        handler(update);
      } catch (error) {
        console.error('Error in presence handler:', error);
      }
    }
  }

  /**
   * Update user status based on activity
   */
  private updateStatuses(): void {
    const now = Date.now();

    for (const [userId, presence] of this.presences.entries()) {
      const inactiveDuration = now - presence.lastActive;

      let newStatus = presence.status;

      if (inactiveDuration >= this.config.awayTimeout) {
        newStatus = 'away';
      } else if (inactiveDuration >= this.config.idleTimeout) {
        newStatus = 'idle';
      }

      if (newStatus !== presence.status) {
        presence.status = newStatus;
        this.presences.set(userId, presence);

        this.emit({
          type: 'update',
          presence,
          timestamp: now,
        });
      }
    }
  }

  /**
   * Start periodic status updates
   */
  private startPeriodicUpdate(): void {
    this.updateTimer = setInterval(() => {
      this.updateStatuses();
    }, this.config.updateInterval);
  }

  /**
   * Stop the tracker and clean up
   */
  destroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = undefined;
    }
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
      this.idleTimer = undefined;
    }
    this.presences.clear();
    this.handlers = [];
  }

  /**
   * Transform cursor position after an operation
   * Used to maintain cursor accuracy during collaborative editing
   */
  transformCursor(
    cursor: CursorPosition,
    operationType: 'insert' | 'delete',
    position: number,
    length: number
  ): CursorPosition {
    if (!cursor.offset) {
      // Calculate offset if not provided
      // This is a simplified calculation
      cursor.offset = 0;
    }

    let newOffset = cursor.offset;

    if (operationType === 'insert') {
      if (position <= cursor.offset) {
        newOffset += length;
      }
    } else if (operationType === 'delete') {
      const deleteEnd = position + length;

      if (cursor.offset >= deleteEnd) {
        newOffset -= length;
      } else if (cursor.offset > position) {
        newOffset = position;
      }
    }

    return {
      ...cursor,
      offset: newOffset,
    };
  }

  /**
   * Transform selection after an operation
   */
  transformSelection(
    selection: SelectionRange,
    operationType: 'insert' | 'delete',
    position: number,
    length: number
  ): SelectionRange {
    return {
      anchor: this.transformCursor(selection.anchor, operationType, position, length),
      focus: this.transformCursor(selection.focus, operationType, position, length),
    };
  }

  /**
   * Update all cursors after an operation
   */
  transformAllCursors(
    operationType: 'insert' | 'delete',
    position: number,
    length: number
  ): void {
    for (const [userId, presence] of this.presences.entries()) {
      if (presence.cursor) {
        presence.cursor = this.transformCursor(
          presence.cursor,
          operationType,
          position,
          length
        );
      }

      if (presence.selection) {
        presence.selection = this.transformSelection(
          presence.selection,
          operationType,
          position,
          length
        );
      }

      this.presences.set(userId, presence);
    }
  }

  /**
   * Get statistics about presence
   */
  getStats(): {
    total: number;
    active: number;
    idle: number;
    away: number;
  } {
    const presences = this.getAll();

    return {
      total: presences.length,
      active: presences.filter(p => p.status === 'active').length,
      idle: presences.filter(p => p.status === 'idle').length,
      away: presences.filter(p => p.status === 'away').length,
    };
  }
}

/**
 * Generate a random color for user presence
 */
export function generateUserColor(userId: string): string {
  const colors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Orange
    '#98D8C8', // Green
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Light Blue
    '#F8B739', // Gold
    '#52B788', // Forest Green
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Create a user presence object
 */
export function createPresence(
  userId: string,
  name: string,
  options?: {
    email?: string;
    avatar?: string;
    color?: string;
    metadata?: Record<string, unknown>;
  }
): Omit<UserPresence, 'lastActive' | 'status'> {
  return {
    userId,
    name,
    email: options?.email,
    avatar: options?.avatar,
    color: options?.color || generateUserColor(userId),
    metadata: options?.metadata,
  };
}
