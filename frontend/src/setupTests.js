import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Mock Vite's import.meta.env for Jest
globalThis.import = globalThis.import || {};
globalThis.import.meta = {
  env: {
    VITE_API_URL: "http://localhost:5000/api"
  }
};
