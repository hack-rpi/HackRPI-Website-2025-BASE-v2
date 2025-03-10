/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "@/app/page";

// Mock the document.getElementById to avoid DOM manipulation errors
Element.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the components used in the Home page
jest.mock("@/components/footer/footer", () => {
	return function MockFooter() {
		return <div data-testid="footer">Footer Component</div>;
	};
});

jest.mock("@/components/faq/faq", () => {
	return function MockFAQ() {
		return (
			<div data-testid="faq" id="faq">
				FAQ Component
			</div>
		);
	};
});

jest.mock("@/components/nav-bar/nav-bar", () => {
	return function MockNavBar({ showOnScroll }: { showOnScroll: boolean }) {
		return (
			<div data-testid="nav-bar" data-show-on-scroll={showOnScroll}>
				NavBar Component
			</div>
		);
	};
});

jest.mock("@/components/title-components/title", () => {
	return function MockTitle() {
		return <div data-testid="title">Title Component</div>;
	};
});

jest.mock("@/components/about-us", () => {
	return function MockAboutUs() {
		return (
			<div data-testid="about" id="about">
				About Component
			</div>
		);
	};
});

jest.mock("@/components/team/team", () => {
	return function MockTeam() {
		return (
			<div data-testid="team" id="team">
				Team Component
			</div>
		);
	};
});

jest.mock("@/components/sponsors", () => {
	return function MockSponsors() {
		return (
			<div data-testid="sponsors" id="sponsors">
				Sponsors Component
			</div>
		);
	};
});

// Mock the intersection observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
	root: null,
	rootMargin: "",
	thresholds: [],
	takeRecords: jest.fn().mockReturnValue([]),
})) as unknown as typeof IntersectionObserver;

describe("Home Page Integration", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Setup mock elements for offsetTop and offsetHeight
		const mockGetBoundingClientRect = jest.fn().mockImplementation(() => ({
			top: 100,
			left: 0,
			right: 0,
			bottom: 200,
			width: 100,
			height: 100,
		}));

		Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

		// Mock getElementById
		document.getElementById = jest.fn().mockImplementation((id) => {
			return {
				id,
				offsetTop: id === "about" ? 100 : id === "team" ? 500 : id === "faq" ? 300 : id === "sponsors" ? 700 : 200,
				offsetHeight: 200,
				getBoundingClientRect: mockGetBoundingClientRect,
			} as unknown as HTMLElement;
		});
	});

	it("renders all main sections of the page", () => {
		render(<Home />);

		// Check if all main components are rendered
		const navBar = screen.getByTestId("nav-bar");
		expect(navBar).toBeInTheDocument();

		const title = screen.getByTestId("title");
		expect(title).toBeInTheDocument();

		const about = screen.getByTestId("about");
		expect(about).toBeInTheDocument();

		const faq = screen.getByTestId("faq");
		expect(faq).toBeInTheDocument();

		const sponsors = screen.getByTestId("sponsors");
		expect(sponsors).toBeInTheDocument();

		const team = screen.getByTestId("team");
		expect(team).toBeInTheDocument();

		const footer = screen.getByTestId("footer");
		expect(footer).toBeInTheDocument();
	});

	it("NavBar is configured with showOnScroll=true", () => {
		render(<Home />);

		const navBar = screen.getByTestId("nav-bar");
		expect(navBar).toHaveAttribute("data-show-on-scroll", "true");
	});

	it("handles window scroll events", async () => {
		render(<Home />);

		// Simulate scrolling past the threshold
		Object.defineProperty(window, "scrollY", {
			writable: true,
			value: 700, // A value greater than the threshold
		});

		// Trigger the scroll event
		fireEvent.scroll(window);

		// Wait for any state updates
		await waitFor(() => {
			// We're just verifying the test doesn't crash
			expect(screen.getByTestId("nav-bar")).toBeInTheDocument();
		});
	});

	it("handles window resize events", async () => {
		render(<Home />);

		// Change window dimensions
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		// Trigger the resize event
		fireEvent.resize(window);

		// Wait for any state updates
		await waitFor(() => {
			// We're just verifying the test doesn't crash
			expect(screen.getByTestId("nav-bar")).toBeInTheDocument();
		});
	});
});
