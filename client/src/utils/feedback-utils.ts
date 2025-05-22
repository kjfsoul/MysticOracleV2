// Utility function for handling user feedback

/**
 * Saves the user's feedback on the daily card reading.
 * TODO: Implement actual saving logic (e.g., to Supabase user profile or session storage).
 *
 * @param choice - The feedback choice ('deeply_resonated', 'somewhat_relevant', 'not_really').
 * @param userId - Optional user ID if the user is logged in.
 */
export const saveFeedback = async (choice: string, userId?: string): Promise<void> => {
  console.log(`Feedback received: ${choice}`, userId ? `for user ${userId}` : '(anonymous)');

  // --- Placeholder for actual implementation --- 
  // Option 1: Save to Session Storage (for anonymous users or simple tracking)
  try {
    const feedbackHistory = JSON.parse(sessionStorage.getItem('mystic_feedback') || '[]');
    feedbackHistory.push({ date: new Date().toISOString().split('T')[0], choice });
    sessionStorage.setItem('mystic_feedback', JSON.stringify(feedbackHistory));
  } catch (e) {
    console.warn('Could not save feedback to session storage:', e);
  }

  // Option 2: Save to Supabase (if user is logged in)
  // if (userId) {
  //   try {
  //     const { data, error } = await supabase
  //       .from('user_feedback') // Ensure this table exists
  //       .insert([{ user_id: userId, feedback_type: 'daily_tarot', choice: choice, created_at: new Date() }]);
  //     if (error) throw error;
  //     console.log('Feedback saved to Supabase:', data);
  //   } catch (error) {
  //     console.error('Error saving feedback to Supabase:', error);
  //   }
  // }
  // --- End Placeholder --- 

  // Simulate async operation if needed
  await new Promise(resolve => setTimeout(resolve, 100));
};
