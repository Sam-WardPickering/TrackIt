import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Where /api requests get forwarded. Locally: the server on your machine.
// In Docker Compose, API_URL is set to http://server:4000.
const apiUrl = process.env.API_URL ?? 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': apiUrl },
  },
  preview: {
    port: 5173,
    host: true,
    proxy: { '/api': apiUrl },
  },
});