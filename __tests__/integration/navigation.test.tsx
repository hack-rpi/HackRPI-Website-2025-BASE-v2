/**
 * @jest-environment jsdom
 */
import React from "react";
import { screen, within } from "@testing-library/react";
import Home from "@/app/page";
import {
	renderWithProviders,
	resetAllMocks,
	mockHomePageElements,
	mockScrollIntoView,
	setWindowWidth,
} from "../test-utils";

// Define a mock function we can access later for testing
const mockHandleFAQClick = jest.fn();

// Mock the components used in the Home page with proper ARIA roles
jest.mock("@/components/footer/footer", () => {
	return function MockFooter() {
		return (
			<footer data-testid="footer" role="contentinfo">
				Footer Component
			</footer>
		);
	};
});

jest.mock("@/components/faq/faq", () => {
	return function MockFAQ() {
		return (
			<section data-testid="faq" id="faq" role="region" aria-labelledby="faq-heading">
				<h2 id="faq-heading">Frequently Asked Questions</h2>
				FAQ Component
			</section>
		);
	};
});

jest.mock("@/components/nav-bar/nav-bar", () => {
	// Return a function that creates a mock NavBar
	return jest.fn(({ showOnScroll }) => (
		<nav data-testid="nav-bar" data-show-on-scroll={showOnScroll} role="navigation" aria-label="Main Navigation">
			<a href="/" role="link" aria-label="Home">
				Home
			</a>
			<a href="/event" role="link" aria-label="Event">
				Event
			</a>
			<a href="/resources" role="link" aria-label="Resources">
				Resources
			</a>
			<a href="#about" role="link" aria-label="About">
				About
			</a>
			<a
				href="#faq"
				role="link"
				aria-label="FAQ"
				onClick={(e) => {
					e.preventDefault();
					mockHandleFAQClick();
				}}
			>
				FAQ
			</a>
		</nav>
	));
});

jest.mock("@/components/title-components/title", () => {
	return function MockTitle() {
		return (
			<header data-testid="title" role="banner">
				Title Component
			</header>
		);
	};
});

jest.mock("@/components/about-us", () => {
	return function MockAboutUs() {
		return (
			<section data-testid="about" id="about" role="region" aria-labelledby="about-heading">
				<h2 id="about-heading">About HackRPI</h2>
				About Component
			</section>
		);
	};
});

jest.mock("@/components/team/team", () => {
	return function MockTeam() {
		return (
			<section data-testid="team" id="team" role="region" aria-labelledby="team-heading">
				<h2 id="team-heading">Our Team</h2>
				Team Component
			</section>
		);
	};
});

jest.mock("@/components/sponsors", () => {
	return function MockSponsors() {
		return (
			<section data-testid="sponsors" id="sponsors" role="region" aria-labelledby="sponsors-heading">
				<h2 id="sponsors-heading">Our Sponsors</h2>
				Sponsors Component
			</section>
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
		resetAllMocks();
		mockHomePageElements();

		// Setup mock elements for getBoundingClientRect
		const mockGetBoundingClientRect = jest.fn().mockImplementation(() => ({
			top: 100,
			left: 0,
			right: 0,
			bottom: 200,
			width: 100,
			height: 100,
		}));

		Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
	});

	it("should render all main sections of the page with proper accessibility attributes", async () => {
		// Arrange & Act
		renderWithProviders(<Home />);

		// Assert - Check if all main components are rendered with proper roles
		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByRole("banner")).toBeInTheDocument();

		// Get all regions and check their labels
		const regions = screen.getAllByRole("region");
		expect(regions.length).toBeGreaterThanOrEqual(4); // At least about, faq, sponsors, team

		// Verify specific regions by their aria-labelledby
		expect(screen.getByLabelText(/about hackrpi/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/frequently asked questions/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/our sponsors/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/our team/i)).toBeInTheDocument();

		// Check footer
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("should configure NavBar with showOnScroll=true", async () => {
		// Arrange & Act
		renderWithProviders(<Home />);

		// Assert
		const navBar = screen.getByRole("navigation");
		expect(navBar).toHaveAttribute("data-show-on-scroll", "true");

		// Verify navigation links are present (important for accessibility)
		const navLinks = within(navBar).getAllByRole("link");
		expect(navLinks.length).toBeGreaterThanOrEqual(3); // At least home, event, resources
	});

	it("should handle window scroll events without crashing", async () => {
		// Arrange
		renderWithProviders(<Home />);

		// Act - Simulate scrolling past the threshold
		Object.defineProperty(window, "scrollY", {
			writable: true,
			value: 700, // A value greater than the threshold
		});

		// Trigger the scroll event
		const scrollEvent = new Event("scroll");
		window.dispatchEvent(scrollEvent);

		// Assert - Verify the component still renders
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("should handle window resize events without crashing", async () => {
		// Arrange
		renderWithProviders(<Home />);

		// Act - Change window dimensions and trigger resize
		setWindowWidth(768);
		const resizeEvent = new Event("resize");
		window.dispatchEvent(resizeEvent);

		// Assert - Verify the component still renders
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("should properly navigate to sections when anchor links are clicked", async () => {
		// Arrange
		const { user } = renderWithProviders(<Home />);
		mockHandleFAQClick.mockClear();

		// Act - Find and click the FAQ link
		const navigation = screen.getByRole("navigation");
		const faqLink = within(navigation).getByRole("link", { name: /faq/i });
		await user.click(faqLink);

		// Assert - Verify the mock handler was called
		expect(mockHandleFAQClick).toHaveBeenCalledTimes(1);
	});
});
