/**
 * Composable for managing conversation updates and coordinating between components
 */

// Global state for tracking conversation updates
const conversationUpdateTrigger = ref(0);

export const useConversationUpdates = () => {
  /**
   * Triggers a refresh of conversation lists across the app
   */
  const triggerConversationRefresh = () => {
    conversationUpdateTrigger.value++;
  };

  /**
   * Returns a reactive value that components can watch to know when to refresh
   */
  const refreshTrigger = readonly(conversationUpdateTrigger);

  return {
    triggerConversationRefresh,
    refreshTrigger,
  };
};
