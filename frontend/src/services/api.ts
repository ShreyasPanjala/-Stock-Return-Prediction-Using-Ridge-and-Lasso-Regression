import axios from 'axios';
import type { PredictionRequest, PredictionResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, request);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('An unexpected error occurred while communicating with the server.');
    }
  },
  
  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  }
};
