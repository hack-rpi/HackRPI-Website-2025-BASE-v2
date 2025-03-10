# Testing Documentation for HackRPI Website

This directory contains the test suite for the HackRPI website project. We use Jest and React Testing Library for testing.

## Test Structure

The tests are organized into three main categories:

1. **Unit Tests** (`__tests__/unit/`): Test individual utility functions and small, isolated pieces of code.
2. **Component Tests** (`__tests__/components/`): Test React components in isolation with mocked dependencies.
3. **Integration Tests** (`__tests__/integration/`): Test how multiple components interact with each other.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

To generate a coverage report:

```bash
npm run test:ci
```

## Writing Tests

### Unit Tests

Unit tests should focus on testing a single function or small piece of logic. They should be isolated from other parts of the application.

Example:
```typescript
import { calculateDeltaTime } from '@/utils/timer';

describe('calculateDeltaTime', () => {
  test('should return all zeros when end time is earlier than current time', () => {
    const currentTime = new Date('2025-01-02T12:00:00Z');
    const endTime = new Date('2025-01-01T12:00:00Z');
    
    const result = calculateDeltaTime(currentTime, endTime);
    expect(result.seconds).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.days).toBe(0);
    expect(result.months).toBe(0);
  });
});
```

### Component Tests

Component tests should verify that a component renders correctly and behaves as expected in response to user interaction. Dependencies should be mocked.

Example:
```typescript
import { render, screen } from '@testing-library/react';
import AboutUs from '@/components/about-us';

test('renders the component with correct headings', () => {
  render(<AboutUs />);
  expect(screen.getByText('About HackRPI')).toBeInTheDocument();
});
```

### Integration Tests

Integration tests should verify that multiple components work together correctly. They may use fewer mocks than component tests.

Example:
```typescript
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

test('renders all main sections of the page', () => {
  render(<Home />);
  expect(screen.getByTestId('nav-bar')).toBeInTheDocument();
  expect(screen.getByTestId('title')).toBeInTheDocument();
});
```

## Mocking

We use various mocking strategies:

1. **Component Mocks**: For components that are not the focus of the test
2. **API Mocks**: For AWS Amplify and other external services
3. **DOM Mocks**: For browser APIs like `window` and `document`

Look at the `jest.setup.js` file for global mocks. 