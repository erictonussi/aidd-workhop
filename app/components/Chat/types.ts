/** Role of the message sender */
export type MessageRole = "user" | "assistant" | "system";

/** Source reference for documentation citations */
export interface MessageSource {
  /** Unique identifier for the source */
  id: string;
  /** Title or name of the source document */
  title: string;
  /** URL or path to the source */
  url?: string;
  /** Excerpt or relevant text from the source */
  excerpt?: string;
  /** Page number or section reference */
  page?: number;
}

/** Individual chat message */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Message content (can be markdown) */
  content: string;
  /** Timestamp when message was created */
  timestamp: Date;
  /** Avatar URL for the sender */
  avatarUrl?: string;
  /** Source citations for AI responses */
  sources?: MessageSource[];
  /** Number of tokens used for this message */
  tokensUsed?: number;
  /** AI model used to generate the response */
  model?: string;
  /** Whether the message is currently being edited */
  isEditing?: boolean;
  /** Whether the message is currently streaming */
  isStreaming?: boolean;
}

/** Chat thread/conversation */
export interface Thread {
  /** Unique identifier for the thread */
  id: string;
  /** Thread title */
  title: string;
  /** Messages in the thread */
  messages: Message[];
  /** Timestamp when thread was created */
  createdAt: Date;
  /** Timestamp when thread was last updated */
  updatedAt: Date;
  /** Workspace this thread belongs to */
  workspaceId?: string;
}

/** Workspace for organizing conversations */
export interface Workspace {
  /** Unique identifier for the workspace */
  id: string;
  /** Workspace name */
  name: string;
  /** Workspace description */
  description?: string;
  /** Color theme for the workspace */
  color?: string;
  /** Icon for the workspace */
  icon?: string;
  /** Number of threads in the workspace */
  threadCount?: number;
}

/** File attachment */
export interface FileAttachment {
  /** Unique identifier for the file */
  id: string;
  /** Original filename */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** File content or reference */
  content?: string | File;
  /** Upload status */
  status: "pending" | "uploading" | "completed" | "error";
}

/** Slash command for quick actions */
export interface SlashCommand {
  /** Command trigger (without the /) */
  command: string;
  /** Display label */
  label: string;
  /** Command description */
  description: string;
  /** Icon name */
  icon?: string;
  /** Command action */
  action: () => void;
}

/** AI model configuration */
export interface AIModel {
  /** Model identifier */
  id: string;
  /** Display name */
  name: string;
  /** Model provider */
  provider: "openai" | "anthropic" | "local";
  /** Maximum context length */
  contextLength: number;
  /** Whether model supports function calling */
  supportsFunctions: boolean;
  /** Model capabilities */
  capabilities: string[];
}

/** User preferences */
export interface UserSettings {
  /** Selected AI model */
  defaultModel: string;
  /** Theme preference */
  theme: "light" | "dark" | "system";
  /** Default workspace */
  defaultWorkspace?: string;
  /** Enable voice input */
  enableVoiceInput: boolean;
  /** Enable notifications */
  enableNotifications: boolean;
  /** Export format preference */
  exportFormat: "markdown" | "json" | "pdf";
}
