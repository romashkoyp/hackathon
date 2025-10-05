/**
 * Custom React Hook for Gemini AI interactions
 * Provides a simple interface for components to interact with Gemini AI
 */

import { useState, useCallback } from 'react';
import { sendPromptToGemini } from '../services/geminiService';
import { ApiError } from '../config/api';

/**
 * Hook for interacting with Gemini AI
 * @returns {object} Hook state and methods
 */
export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  /**
   * Send a prompt to Gemini AI
   * @param {string} prompt - The prompt to send
   * @returns {Promise<object>} The response from Gemini AI
   */
  const sendPrompt = useCallback(async (prompt) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await sendPromptToGemini(prompt);
      
      if (data.success) {
        setResponse(data.response);
        return data;
      } else {
        const errorMessage = data.error || 'Failed to get response from Gemini AI';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      console.error('Error calling Gemini AI:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear the current response and error
   */
  const clear = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResponse(null);
  }, []);

  return {
    loading,
    error,
    response,
    sendPrompt,
    clear,
    reset,
  };
};

export default useGemini;

