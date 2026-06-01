import { create } from "zustand";
import type { Message, Conversation } from "@wadud/types";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, getMessagesByConversation } from "@wadud/mocks";

/**
 * @api GET  /api/v1/conversations — List user conversations
 * @api GET  /api/v1/conversations/:id/messages — Get messages (paginated)
 * @api POST /api/v1/conversations/:id/messages — Send message
 * @ws  ws://api/v1/chat — WebSocket for real-time messages
 * Replace mock data with WebSocket connection to Go chat-service
 */

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  isTyping: Record<string, boolean>; // conversationId → isTyping
  isConnected: boolean;
  isLoading: boolean;
  // Actions
  setActiveConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string, type?: Message["type"]) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  messages: MOCK_MESSAGES,
  isTyping: {},
  isConnected: true, // Mock as connected
  isLoading: false,

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    get().markAsRead(id);
  },

  sendMessage: async (conversationId, content, type = "text") => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "p1a2b3c4-0001-4000-a000-000000000001",
      senderRole: "patient",
      type,
      content,
      status: "sending",
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Optimistic update
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] ?? []), newMsg],
      },
    }));
    // TODO: POST /api/v1/conversations/:id/messages via WebSocket
    await new Promise((r) => setTimeout(r, 500));
    // Update status to sent
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId].map((m) =>
          m.id === newMsg.id ? { ...m, status: "sent" as const } : m
        ),
      },
    }));
    // Update conversation last message
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { ...newMsg, status: "sent" }, updatedAt: new Date().toISOString() }
          : c
      ),
    }));
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  setTyping: (conversationId, isTyping) => {
    set((state) => ({ isTyping: { ...state.isTyping, [conversationId]: isTyping } }));
  },

  fetchConversations: async () => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ conversations: MOCK_CONVERSATIONS, isLoading: false });
  },

  fetchMessages: async (conversationId) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 400));
    const msgs = getMessagesByConversation(conversationId);
    set((state) => ({
      messages: { ...state.messages, [conversationId]: msgs },
      isLoading: false,
    }));
  },
}));
