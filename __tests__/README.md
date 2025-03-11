# HackRPI Website Testing Strategy

This document outlines the testing approach for the HackRPI website project to ensure code quality, reliability, and performance.

## Testing Layers

Our testing strategy uses a pyramid approach with different types of tests:

1. **Unit Tests** - Test individual functions and components in isolation
2. **Component Tests** - Test React components with their direct dependencies
3. **Integration Tests** - Test interactions between components
4. **End-to-End Tests** - Test complete user flows through the application

## Coverage Goals

We aim for the following coverage targets:

- **Critical Utils (timer.ts, schedule.ts):** 90% line coverage
- **Server Actions (actions.ts):** 80% line coverage
- **React Components:** 70% line coverage
- **Overall Project:** At least a 40% baseline coverage

## Testing Best Practices

### 1. Unit Tests

- Focus on testing one thing at a time
- Use descriptive test names that explain behavior
- Group related tests using `describe` blocks
- Arrange-Act-Assert pattern for clear structure
- Mock external dependencies (API calls, etc.)

Example:

```typescript
// Example unit test for a utility function
describe("calculateDeltaTime", () => {
	it("returns zero values when end time is earlier than current time", () => {
		// Arrange
		const currentTime = new Date("2025-01-02");
		const endTime = new Date("2025-01-01");

		// Act
		const result = calculateDeltaTime(currentTime, endTime);

		// Assert
		expect(result.seconds).toBe(0);
		expect(result.minutes).toBe(0);
		expect(result.hours).toBe(0);
		expect(result.days).toBe(0);
		expect(result.months).toBe(0);
	});
});
```

### 2. Component Tests

- Test rendering with different props
- Test user interactions (clicks, inputs)
- Test accessibility features
- Use screen queries based on roles and text
- Avoid testing implementation details

Example:

```typescript
// Example component test
it("renders speaker information when available", () => {
	render(
		<EventCard
			event={{
				id: "123",
				title: "Workshop",
				speaker: "Jane Doe",
				location: "Room 101",
				// ...other props
			}}
		/>,
	);

	// Check for speaker info
	expect(screen.getByText("Room 101 • Jane Doe")).toBeInTheDocument();
});

it("omits speaker bullet point when no speaker is provided", () => {
	render(
		<EventCard
			event={{
				id: "123",
				title: "Workshop",
				speaker: "",
				location: "Room 101",
				// ...other props
			}}
		/>,
	);

	// Check location without bullet point
	expect(screen.getByText("Room 101")).toBeInTheDocument();
	expect(screen.queryByText("Room 101 •")).not.toBeInTheDocument();
});
```

### 3. Integration Tests

- Test component interactions
- Test routing and navigation
- Use fake timers for predictable timing
- Test page transitions and state management

Example:

```typescript
// Example integration test
it("navigates to event page when event link is clicked", async () => {
	const { user } = renderWithProviders(<Home />);

	// Find and click the event link
	const eventLink = screen.getByRole("link", { name: /event/i });
	await act(async () => {
		await user.click(eventLink);
		jest.runAllTimers();
	});

	// Verify navigation
	expect(mockRouterPush).toHaveBeenCalledWith("/event");
});
```

### 4. Accessibility Testing

- Test keyboard navigation
- Verify all interactive elements have accessible names
- Check heading hierarchy
- Ensure proper focus management

Example:

```typescript
// Example accessibility test
it("maintains proper focus management for keyboard users", async () => {
	const { user } = renderWithProviders(<NavBar />);

	// Tab through navigation
	const firstLink = screen.getByRole("link", { name: /home/i });
	firstLink.focus();

	await act(async () => {
		await user.tab();
		jest.runAllTimers();
	});

	// Second link should now have focus
	const secondLink = screen.getByRole("link", { name: /event/i });
	expect(document.activeElement).toBe(secondLink);
});
```

## Test File Organization

Organize tests to mirror the source code structure:

```
__tests__/
  ├── unit/           # Unit tests for utility functions
  ├── components/     # Component tests
  ├── integration/    # Integration tests
  └── e2e/            # End-to-end tests (future)
```

## Running Tests

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ci` - Run tests with coverage report

## Continuous Integration

Tests are run automatically on every pull request. PRs must pass all tests and maintain coverage thresholds before being merged.

## Mocking Strategy

- Use Jest mocks for external dependencies
- Use the `renderWithProviders` utility for consistent component rendering
- Use fake timers for predictable time-based testing
- Mock routing for navigation testing

## Next Steps

1. Increase test coverage for critical components
2. Add end-to-end tests with Cypress or Playwright
3. Add visual regression testing
4. Implement performance testing
