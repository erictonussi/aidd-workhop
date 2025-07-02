# ChatContainer

The main chat interface component that provides a complete AI chatbot experience with conversation management and real-time messaging.

## Features

- Responsive layout with collapsible sidebar for conversation management
- Clean, modern chat interface with proper spacing and typography
- Built-in message input area with file attachment support
- Welcome state for new conversations
- Keyboard shortcuts support (Shift + Enter for new lines)
- Accessible design with proper ARIA labels

## 🚀 Usage

View Component demo [here](http://localhost:3000/playground/ChatContainerDemo)

### Basic Usage

```vue
<template>
  <ChatContainer />
</template>
```

### With Custom Configuration

```vue
<template>
  <ChatContainer :show-sidebar="false" />
</template>
```

## 📋 Props

| Prop          | Type      | Default | Description                                              |
| ------------- | --------- | ------- | -------------------------------------------------------- |
| `showSidebar` | `boolean` | `true`  | Whether to show the conversation sidebar on initial load |

## 🎯 Events

| Event            | Payload   | Description                             |
| ---------------- | --------- | --------------------------------------- |
| `sidebar-toggle` | `boolean` | Emitted when sidebar visibility changes |

## 🎨 Slots

| Slot             | Description                                  |
| ---------------- | -------------------------------------------- |
| `default`        | Main content area (currently not used)       |
| `sidebar-header` | Custom header content for the sidebar        |
| `chat-header`    | Custom header content for the main chat area |

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar and main chat area
- **Tablet**: Collapsible sidebar for more chat space
- **Mobile**: Hidden sidebar by default, accessible via toggle button

## 🧪 Testing

Run the component tests:

```bash
# Run all tests for this component
npm run test -- app/components/ChatContainer
```

## Implementation Notes

This component serves as the main container for the AI chatbot interface. It orchestrates:

- Conversation thread management in the sidebar
- Message display and input handling
- File upload capabilities
- Responsive layout behavior

The component uses shadcn/ui components for consistent styling and accessibility.
