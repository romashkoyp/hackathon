/**
 * API Configuration
 * Centralized configuration for API endpoints and HTTP client
 */

// Get the base URL from environment variables
// Vite exposes env variables that start with VITE_ to the client
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Health check
  HEALTH: '/api/health',

  // Gemini AI endpoints
  GEMINI_TEST: '/api/gemini/test',

  // Questionnaire endpoints
  QUESTIONNAIRE_ASSESS: '/api/questionnaire/assess',

  // Server status
  STATUS: '/',
};

/**
 * HTTP Client wrapper for making API requests
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint path
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint path
   * @param {object} data - Request body data
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Additional fetch options
   * @returns {Promise<any>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Generic request method
   * @param {string} endpoint - API endpoint path
   * @param {object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Parse JSON response
      const data = await response.json();

      // Check if response is ok
      if (!response.ok) {
        throw new ApiError(
          data.error || data.message || 'Request failed',
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(
          `Failed to connect to server at ${this.baseURL}. Make sure the backend is running.`,
          0,
          { originalError: error.message }
        );
      }

      // Handle other errors
      throw new ApiError(
        error.message || 'An unexpected error occurred',
        0,
        { originalError: error }
      );
    }
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export default for convenience
export default apiClient;

