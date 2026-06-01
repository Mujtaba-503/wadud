import { create } from "zustand";
import type { Notification } from "@wadud/types";
import { MOCK_NOTIFICATIONS } from "@wadud/mocks";

/**
 * @api GET    /api/v1/notifications — Paginated notification list
 * @api PUT    /api/v1/notifications/:id/read — Mark single read
 * @api PUT    /api/v1/notifications/read-all — Mark all read
 * @ws  ws://api/v1/notifications — Push notifications via WebSocket
 */

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 500));
    const notifs = MOCK_NOTIFICATIONS;
    set({ notifications: notifs, unreadCount: notifs.filter((n) => !n.isRead).length, isLoading: false });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return { notifications: updated, unreadCount: updated.filter((n) => !n.isRead).length };
    });
    // TODO: PUT /api/v1/notifications/:id/read
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    // TODO: PUT /api/v1/notifications/read-all
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const removed = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: state.unreadCount - (removed && !removed.isRead ? 1 : 0),
      };
    });
  },
}));
