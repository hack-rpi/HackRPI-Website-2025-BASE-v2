import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "@/components/nav-bar/nav-bar";

// Mock the sub-components used in NavBar
jest.mock("@/components/nav-bar/desktop/nav-bar-desktop", () => {
	return function MockDesktopNavBar({ links }: { links: any[] }) {
		return (
			<div data-testid="desktop-nav" data-links={JSON.stringify(links)}>
				Desktop NavBar Component
			</div>
		);
	};
});

jest.mock("@/components/nav-bar/mobile/nav-bar-mobile", () => {
	return function MockMobileNavBar({ links }: { links: any[] }) {
		return (
			<div data-testid="mobile-nav" data-links={JSON.stringify(links)}>
				Mobile NavBar Component
			</div>
		);
	};
});

jest.mock("@/components/mlh-banner/mlh-banner", () => {
	return function MockMlhBanner() {
		return <div data-testid="mlh-banner">MLH Banner Component</div>;
	};
});

describe("NavBar Component", () => {
	const originalInnerWidth = window.innerWidth;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Reset window.innerWidth to its original value
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: originalInnerWidth,
		});
	});

	it("renders the desktop navigation bar for large screens", () => {
		// Mock a large screen width (greater than 860px)
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		render(<NavBar showOnScroll={true} />);

		// Should render the desktop nav, not the mobile nav
		expect(screen.getByTestId("desktop-nav")).toBeInTheDocument();
		expect(screen.queryByTestId("mobile-nav")).not.toBeInTheDocument();

		// MLH Banner should always be present
		expect(screen.getByTestId("mlh-banner")).toBeInTheDocument();
	});

	it("renders the mobile navigation bar for small screens", () => {
		// Mock a small screen width (less than 860px)
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		render(<NavBar showOnScroll={true} />);

		// Should render the mobile nav, not the desktop nav
		expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
		expect(screen.queryByTestId("desktop-nav")).not.toBeInTheDocument();

		// MLH Banner should always be present
		expect(screen.getByTestId("mlh-banner")).toBeInTheDocument();
	});

	it("passes the correct links prop to navigation components", () => {
		// Mobile view
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		render(<NavBar showOnScroll={true} />);

		const mobileNav = screen.getByTestId("mobile-nav");
		const links = JSON.parse(mobileNav.getAttribute("data-links") || "[]");

		// Verify links structure
		expect(links).toHaveLength(2); // Should have 2 main sections
		expect(links[0].name).toBe("Home"); // First section should be 'Home'
		expect(links[1].name).toBe("HackRPI XI"); // Second section should be 'HackRPI XI'

		// Check some specific links
		expect(links[0].links).toContainEqual({ href: "/", children: "Home" });
		expect(links[0].links).toContainEqual({ href: "/#about", children: "About" });
	});

	it("handles showOnScroll prop correctly", () => {
		// Mock a large screen for desktop view
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		// Render with showOnScroll=true
		const { rerender } = render(<NavBar showOnScroll={true} />);
		const navContainer = screen.getByTestId("desktop-nav").parentElement;

		// Fixed position class should be present
		expect(navContainer).toHaveClass("fixed");

		// Rerender with showOnScroll=false
		rerender(<NavBar showOnScroll={false} />);

		// Fixed position class should still be present (always fixed)
		expect(navContainer).toHaveClass("fixed");
	});
});
