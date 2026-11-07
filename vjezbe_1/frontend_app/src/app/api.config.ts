import { isDevMode } from '@angular/core';

// Lokalno (npm start) gađa lokalni backend, a u produkciji deployani Render servis.

export const API_URL = isDevMode()
  ? 'http://localhost:3000'
  : 'https://backend-app-wre3.onrender.com';
