// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Polyfill for TextEncoder which is required by some dependencies
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for window.scrollTo
window.scrollTo = jest.fn();

// Mock for Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  },
}));

// Mock AWS Amplify
jest.mock("aws-amplify", () => ({
  Amplify: {
    configure: jest.fn(),
  },
  Auth: {
    fetchAuthSession: jest.fn().mockResolvedValue({
      tokens: {
        accessToken: {
          payload: {},
        },
      },
    }),
  },
}));

// Mock generateClient
jest.mock("aws-amplify/api", () => ({
  generateClient: jest.fn().mockReturnValue({
    models: {
      Leaderboard: {
        listByScore: jest.fn().mockResolvedValue({ data: [], errors: null }),
        create: jest.fn().mockResolvedValue({ errors: null }),
      },
      event: {
        list: jest.fn().mockResolvedValue({ data: [], errors: null }),
      },
    },
  }),
}));

// Suppress console errors during tests to reduce noise
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Not implemented: navigation') ||
     args[0].includes('Error: Uncaught') ||
     args[0].includes('Warning:') ||
     args[0].includes('React does not recognize the'))
  ) {
    return;
  }
  originalConsoleError(...args);
}; 