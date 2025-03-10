/**
 * Shared test utilities for the HackRPI-Website-2025 project
 * Following React Testing Library best practices for 2025
 *
 * @jest-environment jsdom
 */
import React, { ReactElement } from "react";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Router mock for all tests
export const mockRouterPush = jest.fn();
export const mockRouterPrefetch = jest.fn();
export const mockScrollIntoView = jest.fn();

// Mock Next.js router - this is imported in the jest.setup.js file
// but we export the mocks here for tests to access directly
export const routerMock = {
	push: mockRouterPush,
	prefetch: mockRouterPrefetch,
	back: jest.fn(),
	forward: jest.fn(),
	pathname: "/",
	query: {},
	asPath: "/",
	events: {
		on: jest.fn(),
		off: jest.fn(),
		emit: jest.fn(),
	},
};

// Extended render options interface with custom wrapper options
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	withRouter?: boolean;
	withTheme?: boolean;
}

/**
 * Custom render function that provides common test providers
 * This is based on the 2025 best practice of having a single render function
 * that sets up all providers needed for tests
 */
export function renderWithProviders(
	ui: ReactElement,
	options: ExtendedRenderOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
	// Setup user event with realistic delay
	const user = userEvent.setup({
		delay: 10,
		pointerEventsCheck: 0,
	});

	// Create wrapper with all required providers
	const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
		return <>{children}</>;
	};

	return {
		user,
		...render(ui, { wrapper: AllTheProviders, ...options }),
	};
}

/**
 * Reset all mocks between tests
 * Call this in beforeEach for consistent test isolation
 */
export function resetAllMocks() {
	jest.clearAllMocks();
	mockRouterPush.mockClear();
	mockRouterPrefetch.mockClear();
	mockScrollIntoView.mockClear();
}

/**
 * Configure document.getElementById mocks for Home page elements
 * This is a common pattern needed in many tests
 */
export function mockHomePageElements() {
	document.getElementById = jest.fn((id) => {
		if (!id) return null;

		const element = document.createElement("div");
		element.id = id;

		Object.defineProperties(element, {
			offsetTop: { configurable: true, value: 100 },
			offsetHeight: { configurable: true, value: 200 },
			scrollIntoView: { configurable: true, value: mockScrollIntoView },
		});

		return element;
	});

	// Mock window.scrollY for scroll tests
	Object.defineProperty(window, "scrollY", {
		writable: true,
		value: 500,
	});
}

/**
 * Simulate window resize to test responsive behavior
 * @param width The window width to simulate
 */
export function setWindowWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		writable: true,
		value: width,
	});
	window.dispatchEvent(new Event("resize"));
}

/**
 * Mock a form submission event
 */
export function mockFormEvent() {
	return {
		preventDefault: jest.fn(),
		stopPropagation: jest.fn(),
	};
}

/**
 * Helper for creating accessible element mocks with proper ARIA roles
 */
export const createMockElement = {
	navigation: (props: any = {}) => (
		<nav data-testid="nav-bar" role="navigation" {...props}>
			{props.children}
		</nav>
	),
	section: (id: string, label: string, props: any = {}) => (
		<section id={id} data-testid={id} role="region" aria-label={label} {...props}>
			{props.children || `${label} Content`}
		</section>
	),
	link: (href: string, label: string, onClick: () => void, props: any = {}) => (
		<a
			href={href}
			data-testid={`${href.replace("/", "")}-link`.replace("#", "")}
			onClick={(e) => {
				e.preventDefault();
				onClick();
			}}
			role="link"
			aria-label={label}
			{...props}
		>
			{props.children || label}
		</a>
	),
};

// Export default empty object to prevent Jest from treating this as a test file
export default {};
