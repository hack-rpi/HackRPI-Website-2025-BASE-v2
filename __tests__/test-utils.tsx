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
import { commonAccessibilityChecks as commonChecks, createMockFormEvent } from "./__mocks__/mockRegistry";

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
 * @deprecated Use createMockFormEvent from mockRegistry instead
 */
export function mockFormEvent(formData?: Record<string, any>) {
	return createMockFormEvent(formData);
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
 * @deprecated Use commonAccessibilityChecks from mockRegistry instead
 */
export function checkAccessibility(element: HTMLElement) {
	// Forward to the centralized implementation
	commonChecks(element);
}

/**
 * Test utilities for extracting content from components' data structures.
 * This helps tests be more resilient to changes in the content displayed.
 */

// Define a constant set of FAQ data that mirrors the structure in the component
// This allows tests to be more maintainable by referencing this data instead of hardcoded strings
export interface FAQItem {
	title: string;
	content: string | React.ReactNode;
}

export const TEST_FAQ_DATA: FAQItem[] = [
	{
		title: "What is HackRPI?",
		content: "Teams of 1-4 have 24 hours to build a project relating to our theme",
	},
	{
		title: "When is HackRPI?",
		content: "HackRPI takes place on November 15th and 16th, 2025. Arrival and check-in takes place",
	},
	{
		title: "Where is HackRPI?",
		content: "HackRPI takes place at Rensselaer Polytechnic Institute, in the Darrin Communication Center",
	},
];

/**
 * Returns the content of a FAQ by its title
 * @param title The title of the FAQ item
 * @returns The content of the FAQ item as string or null if not found
 */
export const getFaqContentByTitle = (title: string): string | React.ReactNode | null => {
	const faq = TEST_FAQ_DATA.find((item) => item.title === title);
	return faq ? faq.content : null;
};

/**
 * Returns a regex pattern that matches the start of the FAQ content
 * This is more resilient to content changes than exact matching
 * @param title The title of the FAQ item
 * @returns A RegExp that matches the start of the content
 */
export const getFaqContentPattern = (title: string): RegExp | null => {
	const content = getFaqContentByTitle(title);
	if (!content || typeof content !== "string") return null;

	// Get first 10 words of content to create a regex pattern
	const words = content.split(" ").slice(0, 10).join(" ");
	return new RegExp(words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
};

/**
 * Gets the year from the current theme
 * @returns The current year being used in the about component
 */
export const getCurrentHackrpiYear = (): string => {
	return "2025"; // Could be pulled from config or env variable in a real app
};

/**
 * Gets the expected month for the HackRPI event
 * @returns The month name when HackRPI is held
 */
export const getHackrpiMonth = (): string => {
	return "November"; // Could be pulled from config or env variable
};

/**
 * Creates a flexible regex pattern for matching date strings that might change
 * @param month Optional month override (defaults to HackRPI month)
 * @param year Optional year override (defaults to HackRPI year)
 * @returns A RegExp that matches date patterns like "November 15-16, 2025"
 */
export const getDatePattern = (month?: string, year?: string): RegExp => {
	const eventMonth = month || getHackrpiMonth();
	const eventYear = year || getCurrentHackrpiYear();
	return new RegExp(`${eventMonth} \\d+-\\d+, ${eventYear}`);
};

/**
 * Generates consistent data-testid attributes following project conventions
 * This helps standardize the way we select elements in tests
 */
export const generateTestId = {
	/**
	 * Generate a section test ID
	 * @param name The section name (e.g., 'about', 'faq')
	 * @returns A test ID string like 'about-section'
	 */
	section: (name: string): string => `${name.toLowerCase()}-section`,

	/**
	 * Generate a component test ID
	 * @param component The component name (e.g., 'button', 'card')
	 * @param variant Optional variant (e.g., 'primary', 'outline')
	 * @returns A test ID string like 'primary-button'
	 */
	component: (component: string, variant?: string): string => (variant ? `${variant}-${component}` : component),

	/**
	 * Generate a list item test ID
	 * @param list The list name (e.g., 'faq', 'event')
	 * @param index The item index
	 * @returns A test ID string like 'faq-item-0'
	 */
	listItem: (list: string, index: number): string => `${list}-item-${index}`,

	/**
	 * Generate a content test ID
	 * @param type The content type (e.g., 'title', 'description')
	 * @param parent The parent component name
	 * @param index Optional index for lists
	 * @returns A test ID string like 'event-title' or 'faq-content-0'
	 */
	content: (type: string, parent: string, index?: number): string =>
		index !== undefined ? `${parent}-${type}-${index}` : `${parent}-${type}`,
};

export default {};
