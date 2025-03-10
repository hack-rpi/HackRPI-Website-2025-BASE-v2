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

// Mock Next.js router - this is imported in the jest.setup.js file
export const mockRouterPush = jest.fn();
export const mockRouterPrefetch = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterRefresh = jest.fn();
export const mockRouterBack = jest.fn();
export const mockRouterForward = jest.fn();
export const mockScrollIntoView = jest.fn();

// 2025 best practice: Provide a theme context if your app uses themes
export const ThemeProvider = ({ children, theme = "light" }: { children: React.ReactNode; theme?: string }) => {
	return <div data-theme={theme} data-testid="theme-provider">{children}</div>;
};

// Mock Next.js navigation hooks - 2025 updated approach
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

// Extended render options interface with custom wrapper options
interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	withRouter?: boolean;
	withTheme?: boolean;
	themeValue?: string;
	params?: Record<string, string>;
	searchParams?: URLSearchParams;
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
	// Setup user event with realistic delay and pointer options
	// 2025 best practice: Configure userEvent with more realistic settings
	const user = userEvent.setup({
		delay: 10,
		pointerEventsCheck: 0,
		advanceTimers: jest.advanceTimersByTime,
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

	// Create wrapper with all required providers - 2025 improvement for better context support
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
 * Reset all mocks between tests
 * Call this in beforeEach for consistent test isolation
 */
export function resetAllMocks() {
	jest.clearAllMocks();
	mockRouterPush.mockClear();
	mockRouterPrefetch.mockClear();
	mockRouterReplace.mockClear();
	mockRouterRefresh.mockClear();
	mockRouterBack.mockClear();
	mockRouterForward.mockClear();
	mockScrollIntoView.mockClear();

	// Reset Next.js navigation hooks to default values
	(usePathname as jest.Mock).mockReturnValue("/");
	(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
	(useParams as jest.Mock).mockReturnValue({});
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
 * @param height Optional height to simulate
 */
export function setWindowDimensions(width: number, height?: number) {
	Object.defineProperty(window, "innerWidth", {
		writable: true,
		value: width,
	});
	if (height) {
		Object.defineProperty(window, "innerHeight", {
			writable: true,
			value: height,
		});
	}
	window.dispatchEvent(new Event("resize"));
}

/**
 * Mock a form submission event
 * 2025 Best Practice: Include more form event properties
 */
export function mockFormEvent() {
	return {
		preventDefault: jest.fn(),
		stopPropagation: jest.fn(),
		target: {
			checkValidity: jest.fn().mockReturnValue(true),
			reportValidity: jest.fn(),
			reset: jest.fn(),
		},
	};
}

/**
 * Helper for creating accessible element mocks with proper ARIA roles
 * 2025 Best Practice: Enhanced accessibility testing support
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
 * 2025 Best Practice: Helper for testing accessibility
 * Performs basic accessibility checks on the given element
 */
export function checkAccessibility(element: HTMLElement) {
	// Check for common accessibility issues
	const buttons = within(element).queryAllByRole("button");
	buttons.forEach((button) => {
		expect(button).toHaveAttribute("aria-label");
	});

	const links = within(element).queryAllByRole("link");
	links.forEach((link) => {
		expect(link).toHaveAttribute("aria-label");
	});

	const images = within(element).queryAllByRole("img");
	images.forEach((img) => {
		expect(img).toHaveAttribute("alt");
	});
}

// Export default empty object to prevent Jest from treating this as a test file
export default {};
