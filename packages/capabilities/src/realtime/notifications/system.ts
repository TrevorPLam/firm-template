// AI-META-BEGIN
// 
// AI-META: Shared package module
// OWNERSHIP: packages/capabilities
// ENTRYPOINTS: Imported by application modules
// DEPENDENCIES: Standard library only
// DANGER: None identified
// CHANGE-SAFETY: Review impact on consumers before modifying public API
// TESTS: Run: pnpm test in package directory, pnpm type-check for types
// 
// AI-META-END

/**
 * Real-time Notification System
 * 
 * Manages notifications for collaborative editing events
 */

import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationSubscription,
  RealtimeErrorCode,
} from '../types';
import { RealtimeError } from '../types';

/**
 * Notification event handler type
 */
type NotificationEventHandler = (notification: Notification) => void;

/**
 * Real-time notification system
 */
export class NotificationSystem {
  private notifications: Map<string, Notification> = new Map();
  private subscriptions: Map<string, NotificationSubscription[]> = new Map();
  private handlers: NotificationEventHandler[] = [];
  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    this.startCleanupTimer();
  }

  /**
   * Send a notification
   */
  send(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: NotificationPriority;
      documentId?: string;
      senderId?: string;
      actionUrl?: string;
      expiresIn?: number;
      metadata?: Record<string, unknown>;
    }
  ): Notification {
    const notification: Notification = {
      id: this.generateId(),
      type,
      priority: options?.priority || 'medium',
      title,
      message,
      userId,
      documentId: options?.documentId,
      senderId: options?.senderId,
      read: false,
      createdAt: Date.now(),
      expiresAt: options?.expiresIn
        ? Date.now() + options.expiresIn
        : undefined,
      actionUrl: options?.actionUrl,
      metadata: options?.metadata,
    };

    // Check if user is subscribed to this notification type
    if (!this.isSubscribed(userId, type, options?.documentId)) {
      return notification; // Don't send if not subscribed
    }

    this.notifications.set(notification.id, notification);
    this.emitEvent(notification);

    return notification;
  }

  /**
   * Send a mention notification
   */
  sendMention(
    userId: string,
    senderId: string,
    documentId: string,
    message: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'mention',
      'You were mentioned',
      message,
      {
        priority: 'high',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send a comment notification
   */
  sendComment(
    userId: string,
    senderId: string,
    documentId: string,
    comment: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'comment',
      'New comment',
      comment,
      {
        priority: 'medium',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send an approval request notification
   */
  sendApprovalRequest(
    userId: string,
    senderId: string,
    documentId: string,
    message: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'approval-request',
      'Approval requested',
      message,
      {
        priority: 'high',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send approval granted notification
   */
  sendApprovalGranted(
    userId: string,
    senderId: string,
    documentId: string,
    message: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'approval-granted',
      'Approval granted',
      message,
      {
        priority: 'medium',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send approval denied notification
   */
  sendApprovalDenied(
    userId: string,
    senderId: string,
    documentId: string,
    message: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'approval-denied',
      'Approval denied',
      message,
      {
        priority: 'high',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send edit notification
   */
  sendEdit(
    userId: string,
    senderId: string,
    documentId: string,
    message: string,
    actionUrl?: string
  ): Notification {
    return this.send(
      userId,
      'edit',
      'Document edited',
      message,
      {
        priority: 'low',
        documentId,
        senderId,
        actionUrl,
      }
    );
  }

  /**
   * Send system notification
   */
  sendSystem(
    userId: string,
    title: string,
    message: string,
    priority: NotificationPriority = 'medium'
  ): Notification {
    return this.send(
      userId,
      'system',
      title,
      message,
      { priority }
    );
  }

  /**
   * Get a notification by ID
   */
  get(notificationId: string): Notification | undefined {
    return this.notifications.get(notificationId);
  }

  /**
   * Get all notifications for a user
   */
  getForUser(userId: string, unreadOnly: boolean = false): Notification[] {
    return Array.from(this.notifications.values())
      .filter(n => 
        n.userId === userId && 
        (!unreadOnly || !n.read)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get notifications for a document
   */
  getForDocument(documentId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter(n => n.documentId === documentId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * Get unread count for a user
   */
  getUnreadCount(userId: string): number {
    return this.getForUser(userId, true).length;
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);

    if (notification) {
      notification.read = true;
      this.notifications.set(notificationId, notification);
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): void {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId) {
        notification.read = true;
        this.notifications.set(id, notification);
      }
    }
  }

  /**
   * Delete a notification
   */
  delete(notificationId: string): void {
    this.notifications.delete(notificationId);
  }

  /**
   * Delete all notifications for a user
   */
  deleteForUser(userId: string): void {
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId) {
        this.notifications.delete(id);
      }
    }
  }

  /**
   * Subscribe to notification types
   */
  subscribe(
    userId: string,
    types: NotificationType[],
    documentId?: string
  ): void {
    const key = this.getSubscriptionKey(userId, documentId);
    const existing = this.subscriptions.get(key) || [];

    const subscription: NotificationSubscription = {
      userId,
      documentId,
      types,
      enabled: true,
    };

    existing.push(subscription);
    this.subscriptions.set(key, existing);
  }

  /**
   * Unsubscribe from notification types
   */
  unsubscribe(
    userId: string,
    types: NotificationType[],
    documentId?: string
  ): void {
    const key = this.getSubscriptionKey(userId, documentId);
    const existing = this.subscriptions.get(key) || [];

    const updated = existing.filter(sub => 
      !types.some(type => sub.types.includes(type))
    );

    if (updated.length > 0) {
      this.subscriptions.set(key, updated);
    } else {
      this.subscriptions.delete(key);
    }
  }

  /**
   * Check if user is subscribed to a notification type
   */
  private isSubscribed(
    userId: string,
    type: NotificationType,
    documentId?: string
  ): boolean {
    // Check document-specific subscription
    if (documentId) {
      const docKey = this.getSubscriptionKey(userId, documentId);
      const docSubs = this.subscriptions.get(docKey) || [];

      for (const sub of docSubs) {
        if (sub.enabled && sub.types.includes(type)) {
          return true;
        }
      }
    }

    // Check global subscription
    const globalKey = this.getSubscriptionKey(userId);
    const globalSubs = this.subscriptions.get(globalKey) || [];

    for (const sub of globalSubs) {
      if (sub.enabled && sub.types.includes(type)) {
        return true;
      }
    }

    // Default: subscribed to all
    return true;
  }

  /**
   * Get subscription key
   */
  private getSubscriptionKey(userId: string, documentId?: string): string {
    return documentId ? `${userId}:${documentId}` : userId;
  }

  /**
   * Subscribe to notification events
   */
  onNotification(handler: NotificationEventHandler): () => void {
    this.handlers.push(handler);

    return () => {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    };
  }

  /**
   * Emit notification event
   */
  private emitEvent(notification: Notification): void {
    for (const handler of this.handlers) {
      try {
        handler(notification);
      } catch (error) {
        console.error('Error in notification handler:', error);
      }
    }
  }

  /**
   * Clean up expired notifications
   */
  private cleanupExpired(): void {
    const now = Date.now();

    for (const [id, notification] of this.notifications.entries()) {
      if (notification.expiresAt && notification.expiresAt < now) {
        this.notifications.delete(id);
      }
    }
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, 60000); // Every minute
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get notification statistics
   */
  getStats(userId?: string): {
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
  } {
    const notifications = userId
      ? this.getForUser(userId)
      : Array.from(this.notifications.values());

    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.read).length,
      byType: {} as Record<NotificationType, number>,
      byPriority: {} as Record<NotificationPriority, number>,
    };

    for (const notification of notifications) {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
    }

    return stats;
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notifications.clear();
  }

  /**
   * Destroy the notification system
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    this.notifications.clear();
    this.subscriptions.clear();
    this.handlers = [];
  }
}
