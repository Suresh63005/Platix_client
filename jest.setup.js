// jest.setup.js
import { TextEncoder, TextDecoder } from "util";

// ✅ Polyfill TextEncoder and TextDecoder for Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ✅ Mock matchMedia for Jest tests
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};
