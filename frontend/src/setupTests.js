import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

// Provide a default API URL for tests
globalThis.API_URL = "http://localhost:5000/api";
