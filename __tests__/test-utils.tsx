/**
 * Shared test utilities for the HackRPI-Website-2025 project
 * Following React Testing Library best practices for 2025
 *
 * @jest-environment jsdom
 */
import React, { ReactElement } from "react";
import { render, RenderOptions, RenderResult, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams, useParams, usePathname, useRouter } from "next/navigation";

// Mock Next.js router
export const mockRouterPush = jest.fn();
export const mockRouterPrefetch = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterRefresh = jest.fn();
export const mockRouterBack = jest.fn();
export const mockRouterForward = jest.fn();
export const mockScrollIntoView = jest.fn();

// Advanced Theme context provider for testing
export const ThemeProvider = ({ children, theme = "light" }: { children: React.ReactNode; theme?: string }) => {
	return (
		<div data-theme={theme} data-testid="theme-provider">
			{children}
		</div>
	);
};

// Mock Next.js navigation hooks with improved typings
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: mockRouterPush,
		prefetch: mockRouterPrefetch,
		replace: mockRouterReplace,
		refresh: mockRouterRefresh,
		back: mockRouterBack,
		forward: mockRouterForward,
		pathname: "/",
	})),
	usePathname: jest.fn(() => "/"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
	useParams: jest.fn(() => ({})),
}));

// Extended render options interface
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	withRouter?: boolean;
	withTheme?: boolean;
	themeValue?: string;
	params?: Record<string, string>;
	searchParams?: URLSearchParams;
	// Add fakeTimers option to control Jest's fake timers during rendering
	useFakeTimers?: boolean;
}

/**
 * Custom render function with comprehensive provider setup
 */
export function renderWithProviders(
	ui: ReactElement,
	options: ExtendedRenderOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
	// Setup fake timers before user events if requested
	if (options.useFakeTimers && typeof jest.useFakeTimers === "function") {
		jest.useFakeTimers();
	}

	// Setup user event with optimal settings for test reliability
	const user = userEvent.setup({
		delay: null, // No delay in tests for faster execution
		pointerEventsCheck: 0,
		advanceTimers: jest.advanceTimersByTime,
		// Configure skipHover to true to avoid hover-related issues in tests
		skipHover: true,
		// Skip auto-waiting which can cause test flakiness
		skipAutoClose: true,
	});

	// Set up route-specific mocks if provided
	if (options.route) {
		(usePathname as jest.Mock).mockReturnValue(options.route);
	}

	if (options.params) {
		(useParams as jest.Mock).mockReturnValue(options.params);
	}

	if (options.searchParams) {
		(useSearchParams as jest.Mock).mockReturnValue(options.searchParams);
	}

	// Comprehensive wrapper with theme and other potential providers
	const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
		let wrapped = <>{children}</>;

		// Apply theme provider if requested
		if (options.withTheme) {
			wrapped = <ThemeProvider theme={options.themeValue}>{wrapped}</ThemeProvider>;
		}

		return wrapped;
	};

	return {
		user,
		...render(ui, { wrapper: AllTheProviders, ...options }),
	};
}

/**
 * Reset all mocks between tests with better cleanup
 */
export function resetAllMocks() {
	jest.clearAllMocks();
	jest.clearAllTimers();

	// Reset router mocks
	mockRouterPush.mockClear();
	mockRouterPrefetch.mockClear();
	mockRouterReplace.mockClear();
	mockRouterRefresh.mockClear();
	mockRouterBack.mockClear();
	mockRouterForward.mockClear();
	mockScrollIntoView.mockClear();

	// Reset Next.js navigation hooks
	(usePathname as jest.Mock).mockReturnValue("/");
	(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
	(useParams as jest.Mock).mockReturnValue({});
	(useRouter as jest.Mock).mockImplementation(() => ({
		push: mockRouterPush,
		prefetch: mockRouterPrefetch,
		replace: mockRouterReplace,
		refresh: mockRouterRefresh,
		back: mockRouterBack,
		forward: mockRouterForward,
		pathname: "/",
	}));
}

/**
 * Configure document.getElementById mocks with better element simulation
 */
export function mockHomePageElements() {
	document.getElementById = jest.fn((id) => {
		if (!id) return null;

		const element = document.createElement("div");
		element.id = id;

		// More realistic element property simulation
		Object.defineProperties(element, {
			offsetTop: { configurable: true, value: 100 },
			offsetHeight: { configurable: true, value: 200 },
			offsetWidth: { configurable: true, value: 800 },
			clientHeight: { configurable: true, value: 200 },
			clientWidth: { configurable: true, value: 800 },
			scrollIntoView: {
				configurable: true,
				value: mockScrollIntoView,
			},
			// Add getBoundingClientRect for more accurate element positioning
			getBoundingClientRect: {
				configurable: true,
				value: () => ({
					top: 100,
					left: 0,
					right: 800,
					bottom: 300,
					width: 800,
					height: 200,
					x: 0,
					y: 100,
				}),
			},
		});

		return element;
	});

	// Mock window.scrollY for scroll tests with a default value
	Object.defineProperty(window, "scrollY", {
		writable: true,
		value: 500,
	});
}

/**
 * Simulate window resize with improved event dispatching
 */
export function setWindowDimensions(width: number, height: number = 800) {
	// Store original dimensions
	const originalWidth = window.innerWidth;
	const originalHeight = window.innerHeight;

	// Set new dimensions
	Object.defineProperty(window, "innerWidth", {
		writable: true,
		value: width,
	});
	Object.defineProperty(window, "innerHeight", {
		writable: true,
		value: height,
	});

	// Create resize event with proper event initialization
	const resizeEvent = new Event("resize");
	window.dispatchEvent(resizeEvent);

	// Return function to restore original dimensions
	return () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: originalWidth,
		});
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			value: originalHeight,
		});
		window.dispatchEvent(new Event("resize"));
	};
}

/**
 * Mock a form submission event with comprehensive event properties
 */
export function mockFormEvent(formData?: Record<string, any>) {
	const mockEvent = {
		preventDefault: jest.fn(),
		stopPropagation: jest.fn(),
		target: {
			checkValidity: jest.fn().mockReturnValue(true),
			reportValidity: jest.fn(),
			reset: jest.fn(),
			elements: {},
			...formData,
		},
		// Add currentTarget for form event consistency
		currentTarget: {
			checkValidity: jest.fn().mockReturnValue(true),
			reportValidity: jest.fn(),
			reset: jest.fn(),
			elements: {},
			...formData,
		},
	};

	// Add formData support for modern forms
	if (formData) {
		mockEvent.target.elements = Object.fromEntries(
			Object.entries(formData).map(([key, value]) => [key, { value, name: key, id: key }]),
		);
		mockEvent.currentTarget.elements = mockEvent.target.elements;
	}

	return mockEvent;
}

/**
 * Helper for creating consistent accessible element mocks
 */
export const createMockElement = {
	navigation: (props: any = {}) => (
		<nav data-testid="nav-bar" role="navigation" aria-label="Main Navigation" {...props}>
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
	button: (label: string, onClick: () => void, props: any = {}) => (
		<button
			onClick={onClick}
			data-testid={`${label.toLowerCase().replace(/\s+/g, "-")}-button`}
			aria-label={label}
			{...props}
		>
			{props.children || label}
		</button>
	),
	input: (label: string, props: any = {}) => (
		<div>
			<label htmlFor={`${label.toLowerCase().replace(/\s+/g, "-")}`}>{label}</label>
			<input
				id={`${label.toLowerCase().replace(/\s+/g, "-")}`}
				data-testid={`${label.toLowerCase().replace(/\s+/g, "-")}-input`}
				aria-label={label}
				{...props}
			/>
		</div>
	),
};

/**
 * Comprehensive accessibility testing helper
 */
export function checkAccessibility(element: HTMLElement) {
	// Check for common accessibility issues

	// All interactive elements should have accessible names
	const buttons = within(element).queryAllByRole("button");
	buttons.forEach((button) => {
		expect(button).toHaveAccessibleName();
	});

	const links = within(element).queryAllByRole("link");
	links.forEach((link) => {
		expect(link).toHaveAccessibleName();
	});

	const inputs = within(element).queryAllByRole("textbox");
	inputs.forEach((input) => {
		expect(input).toHaveAccessibleName();
	});

	// All images should have alt text
	const images = within(element).queryAllByRole("img");
	images.forEach((img) => {
		expect(img).toHaveAttribute("alt");
	});

	// All form elements should have associated labels
	const formElements = [
		...within(element).queryAllByRole("textbox"),
		...within(element).queryAllByRole("checkbox"),
		...within(element).queryAllByRole("radio"),
		...within(element).queryAllByRole("combobox"),
	];

	formElements.forEach((formElement) => {
		expect(formElement).toHaveAccessibleName();
	});

	// All headings should be in a logical order
	const headings = within(element).queryAllByRole("heading");
	if (headings.length > 1) {
		let previousLevel = 0;
		headings.forEach((heading) => {
			const level = parseInt(heading.tagName.charAt(1));
			// Heading levels should only increase by one
			if (previousLevel > 0) {
				expect(level - previousLevel).toBeLessThanOrEqual(1);
			}
			previousLevel = level;
		});
	}
}

export default {};
