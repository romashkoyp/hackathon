/**
 * Gemini AI Service
 * Service layer for interacting with Google Gemini AI through the backend API
 */

import apiClient, { API_ENDPOINTS } from '../config/api';

/**
 * Send a prompt to Gemini AI and get a response
 * @param {string} prompt - The prompt to send to Gemini AI
 * @returns {Promise<object>} Response object with success status and AI response
 */
export const sendPromptToGemini = async (prompt) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.GEMINI_TEST, { prompt });
    return response;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Check server health status
 * @returns {Promise<object>} Health status object
 */
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return response;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw error;
  }
};

/**
 * Check server status and API key availability
 * @returns {Promise<object>} Server status object
 */
export const checkServerStatus = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.STATUS);
    return response;
  } catch (error) {
    console.error('Error checking server status:', error);
    throw error;
  }
};

/**
 * Submit business questionnaire for assessment
 * @param {object} questionnaireData - The questionnaire form data
 * @returns {Promise<object>} Assessment response object
 */
export const submitQuestionnaireAssessment = async (questionnaireData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.QUESTIONNAIRE_ASSESS, questionnaireData);
    return response;
  } catch (error) {
    console.error('Error submitting questionnaire assessment:', error);
    throw error;
  }
};

// Export all services as default object
export default {
  sendPromptToGemini,
  checkServerHealth,
  checkServerStatus,
  submitQuestionnaireAssessment,
};

