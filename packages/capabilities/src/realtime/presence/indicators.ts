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
 * Presence Indicators and UI Helpers
 * 
 * Provides utilities for rendering presence indicators in collaborative UIs
 */

import type { UserPresence, CursorPosition, SelectionRange } from '../types';

/**
 * Cursor indicator data for rendering
 */
export interface CursorIndicator {
  userId: string;
  name: string;
  color: string;
  position: CursorPosition;
  visible: boolean;
}

/**
 * Selection indicator data for rendering
 */
export interface SelectionIndicator {
  userId: string;
  name: string;
  color: string;
  range: SelectionRange;
  visible: boolean;
}

/**
 * Avatar indicator for showing active users
 */
export interface AvatarIndicator {
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  color: string;
  status: 'active' | 'idle' | 'away';
  initials: string;
}

/**
 * Generate cursor indicators from presences
 */
export function generateCursorIndicators(
  presences: UserPresence[],
  currentUserId?: string
): CursorIndicator[] {
  return presences
    .filter(p => p.cursor && p.userId !== currentUserId)
    .map(p => ({
      userId: p.userId,
      name: p.name,
      color: p.color,
      position: p.cursor!,
      visible: p.status !== 'away',
    }));
}

/**
 * Generate selection indicators from presences
 */
export function generateSelectionIndicators(
  presences: UserPresence[],
  currentUserId?: string
): SelectionIndicator[] {
  return presences
    .filter(p => p.selection && p.userId !== currentUserId)
    .map(p => ({
      userId: p.userId,
      name: p.name,
      color: p.color,
      range: p.selection!,
      visible: p.status !== 'away',
    }));
}

/**
 * Generate avatar indicators from presences
 */
export function generateAvatarIndicators(
  presences: UserPresence[]
): AvatarIndicator[] {
  return presences.map(p => ({
    userId: p.userId,
    name: p.name,
    email: p.email,
    avatar: p.avatar,
    color: p.color,
    status: p.status,
    initials: getInitials(p.name),
  }));
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}

/**
 * Convert cursor position to CSS styles
 */
export function cursorToStyles(
  cursor: CursorPosition,
  lineHeight: number = 20
): { top: string; left: string; height: string } {
  return {
    top: `${cursor.line * lineHeight}px`,
    left: `${cursor.column * 8}px`, // Approximate character width
    height: `${lineHeight}px`,
  };
}

/**
 * Convert selection range to CSS styles
 */
export function selectionToStyles(
  selection: SelectionRange,
  lineHeight: number = 20
): Array<{
  top: string;
  left: string;
  width: string;
  height: string;
}> {
  const { anchor, focus } = selection;
  const styles: Array<{
    top: string;
    left: string;
    width: string;
    height: string;
  }> = [];

  // Single line selection
  if (anchor.line === focus.line) {
    const left = Math.min(anchor.column, focus.column);
    const right = Math.max(anchor.column, focus.column);

    styles.push({
      top: `${anchor.line * lineHeight}px`,
      left: `${left * 8}px`,
      width: `${(right - left) * 8}px`,
      height: `${lineHeight}px`,
    });

    return styles;
  }

  // Multi-line selection
  const startLine = Math.min(anchor.line, focus.line);
  const endLine = Math.max(anchor.line, focus.line);
  const startCol = anchor.line < focus.line ? anchor.column : focus.column;
  const endCol = anchor.line < focus.line ? focus.column : anchor.column;

  // First line
  styles.push({
    top: `${startLine * lineHeight}px`,
    left: `${startCol * 8}px`,
    width: `${(100 - startCol) * 8}px`, // To end of line
    height: `${lineHeight}px`,
  });

  // Middle lines (full width)
  for (let line = startLine + 1; line < endLine; line++) {
    styles.push({
      top: `${line * lineHeight}px`,
      left: '0px',
      width: '100%',
      height: `${lineHeight}px`,
    });
  }

  // Last line
  styles.push({
    top: `${endLine * lineHeight}px`,
    left: '0px',
    width: `${endCol * 8}px`,
    height: `${lineHeight}px`,
  });

  return styles;
}

/**
 * Generate CSS classes for presence indicators
 */
export function getPresenceClasses(status: 'active' | 'idle' | 'away'): string {
  const classes = ['presence-indicator'];

  switch (status) {
    case 'active':
      classes.push('presence-active');
      break;
    case 'idle':
      classes.push('presence-idle');
      break;
    case 'away':
      classes.push('presence-away');
      break;
  }

  return classes.join(' ');
}

/**
 * Create cursor HTML element
 */
export function createCursorElement(indicator: CursorIndicator): string {
  const styles = `
    border-left: 2px solid ${indicator.color};
    position: absolute;
    pointer-events: none;
    z-index: 1000;
  `;

  return `
    <div class="cursor-indicator" data-user-id="${indicator.userId}" style="${styles}">
      <div class="cursor-label" style="
        background-color: ${indicator.color};
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        margin-left: 4px;
      ">
        ${indicator.name}
      </div>
    </div>
  `;
}

/**
 * Create selection overlay HTML element
 */
export function createSelectionElement(indicator: SelectionIndicator): string {
  const rgba = hexToRgba(indicator.color, 0.2);

  return `
    <div class="selection-indicator" data-user-id="${indicator.userId}" style="
      background-color: ${rgba};
      position: absolute;
      pointer-events: none;
      z-index: 999;
    "></div>
  `;
}

/**
 * Create avatar HTML element
 */
export function createAvatarElement(indicator: AvatarIndicator): string {
  const content = indicator.avatar
    ? `<img src="${indicator.avatar}" alt="${indicator.name}" />`
    : `<span>${indicator.initials}</span>`;

  const statusClass = getPresenceClasses(indicator.status);

  return `
    <div class="avatar-indicator ${statusClass}" data-user-id="${indicator.userId}" style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: ${indicator.color};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      position: relative;
    ">
      ${content}
      <div class="status-badge" style="
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid white;
      "></div>
    </div>
  `;
}

/**
 * Convert hex color to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get status color
 */
export function getStatusColor(status: 'active' | 'idle' | 'away'): string {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Green
    case 'idle':
      return '#FFC107'; // Yellow
    case 'away':
      return '#9E9E9E'; // Grey
  }
}

/**
 * Format last active time
 */
export function formatLastActive(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/**
 * Generate tooltip text for presence
 */
export function getPresenceTooltip(presence: UserPresence): string {
  const status = presence.status.charAt(0).toUpperCase() + presence.status.slice(1);
  const lastActive = formatLastActive(presence.lastActive);

  return `${presence.name} - ${status} (${lastActive})`;
}

/**
 * Sort presences by activity
 */
export function sortByActivity(presences: UserPresence[]): UserPresence[] {
  return [...presences].sort((a, b) => {
    // Active users first
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (b.status === 'active' && a.status !== 'active') return 1;

    // Then by last active
    return b.lastActive - a.lastActive;
  });
}

/**
 * Group presences by status
 */
export function groupByStatus(presences: UserPresence[]): {
  active: UserPresence[];
  idle: UserPresence[];
  away: UserPresence[];
} {
  return {
    active: presences.filter(p => p.status === 'active'),
    idle: presences.filter(p => p.status === 'idle'),
    away: presences.filter(p => p.status === 'away'),
  };
}
