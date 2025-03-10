import React from "react";
import { screen, within } from "@testing-library/react";
import NavBar from "@/components/nav-bar/nav-bar";
import { renderWithProviders, resetAllMocks, setWindowWidth } from "../test-utils";

/**
 * NavBar Component Tests
 *
 * Following 2025 React testing best practices:
 * - Using semantic queries with ARIA roles
 * - Testing accessibility features
 * - Using userEvent instead of fireEvent
 * - Following the AAA pattern (Arrange-Act-Assert)
 */

// Mock the sub-components used in NavBar with proper ARIA roles
jest.mock("@/components/nav-bar/desktop/nav-bar-desktop", () => {
	return function MockDesktopNavBar({ links }: { links: any[] }) {
		return (
			<div
				data-testid="desktop-nav"
				data-links={JSON.stringify(links)}
				role="navigation"
				aria-label="Desktop Navigation"
			>
				Desktop NavBar Component
			</div>
		);
	};
});

jest.mock("@/components/nav-bar/mobile/nav-bar-mobile", () => {
	return function MockMobileNavBar({ links }: { links: any[] }) {
		return (
			<div data-testid="mobile-nav" data-links={JSON.stringify(links)} role="navigation" aria-label="Mobile Navigation">
				Mobile NavBar Component
			</div>
		);
	};
});

jest.mock("@/components/mlh-banner/mlh-banner", () => {
	return function MockMlhBanner() {
		return (
			<div data-testid="mlh-banner" role="banner" aria-label="MLH Banner">
				MLH Banner Component
			</div>
		);
	};
});

describe("NavBar Component", () => {
	const originalInnerWidth = window.innerWidth;

	beforeEach(() => {
		resetAllMocks();
	});

	afterEach(() => {
		// Reset window.innerWidth to its original value
		setWindowWidth(originalInnerWidth);
	});

	it("should render the desktop navigation bar on large screens", async () => {
		// Arrange - Mock a large screen width (greater than 860px)
		setWindowWidth(1024);

		// Act - Render the component
		renderWithProviders(<NavBar showOnScroll={true} />);

		// Assert - Should render desktop nav with correct accessibility attributes
		const desktopNav = screen.getByRole("navigation", { name: /desktop navigation/i });
		expect(desktopNav).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();

		// MLH Banner should always be present
		expect(screen.getByRole("banner", { name: /mlh banner/i })).toBeInTheDocument();
	});

	it("should render the mobile navigation bar on small screens", async () => {
		// Arrange - Mock a small screen width (less than 860px)
		setWindowWidth(768);

		// Act - Render the component
		renderWithProviders(<NavBar showOnScroll={true} />);

		// Assert - Should render mobile nav with correct accessibility attributes
		const mobileNav = screen.getByRole("navigation", { name: /mobile navigation/i });
		expect(mobileNav).toBeInTheDocument();
		expect(screen.queryByRole("navigation", { name: /desktop navigation/i })).not.toBeInTheDocument();

		// MLH Banner should always be present
		expect(screen.getByRole("banner", { name: /mlh banner/i })).toBeInTheDocument();
	});

	it("should pass the correct links prop to navigation components", async () => {
		// Arrange - Mobile view
		setWindowWidth(768);

		// Act - Render the component
		renderWithProviders(<NavBar showOnScroll={true} />);

		// Assert - Verify links structure
		const mobileNav = screen.getByRole("navigation", { name: /mobile navigation/i });
		const links = JSON.parse(mobileNav.getAttribute("data-links") || "[]");

		// Verify links structure
		expect(links).toHaveLength(2); // Should have 2 main sections
		expect(links[0].name).toBe("Home"); // First section should be 'Home'
		expect(links[1].name).toBe("HackRPI XI"); // Second section should be 'HackRPI XI'

		// Check some specific links
		expect(links[0].links).toContainEqual({ href: "/", children: "Home" });
		expect(links[0].links).toContainEqual({ href: "/#about", children: "About" });
	});

	it("should handle showOnScroll prop correctly", async () => {
		// Arrange - Mock a large screen for desktop view
		setWindowWidth(1024);

		// Act - Render with showOnScroll=true
		const { rerender } = renderWithProviders(<NavBar showOnScroll={true} />);
		const navContainer = screen.getByRole("navigation", { name: /desktop navigation/i }).parentElement;

		// Assert - Fixed position class should be present
		expect(navContainer).toHaveClass("fixed");

		// Act - Rerender with showOnScroll=false
		rerender(<NavBar showOnScroll={false} />);

		// Assert - Fixed position class should still be present (always fixed)
		expect(navContainer).toHaveClass("fixed");
	});

	it("should have the appropriate responsive design for both desktop and mobile", async () => {
		// Arrange - Start with desktop view
		setWindowWidth(1024);

		// Act - Render the component
		const { rerender } = renderWithProviders(<NavBar showOnScroll={true} />);

		// Assert - Verify desktop view is present
		expect(screen.getByRole("navigation", { name: /desktop navigation/i })).toBeInTheDocument();

		// Act - Change to mobile view and rerender
		setWindowWidth(500);
		rerender(<NavBar showOnScroll={true} />);

		// Assert - Verify mobile view is now present
		expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();
	});
});
