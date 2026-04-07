export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: number;
  conversation_id: number;
  role: ChatRole;
  content: string;
  created_at: string | Date;
}

export interface Conversation {
  id: number;
  title: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface ConversationWithMessages extends Conversation {
  messages: ChatMessage[];
}

export interface ApiEnvelope<T> {
  error: boolean;
  statusMessage: string;
  statusCode: number;
  message: string;
  data: T;
}
