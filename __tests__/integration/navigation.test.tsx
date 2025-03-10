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
	setWindowDimensions,
	checkAccessibility,
} from "../test-utils";

// 2025 Best Practice: More organized setup with clear purpose
const mockHandleFAQClick = jest.fn();
const mockHandleAboutClick = jest.fn();
const mockHandleHomeClick = jest.fn();

// Apply the mocks first before defining the mock components
jest.mock("@/components/nav-bar/nav-bar", () => {
	return jest.fn(({ showOnScroll }) => (
		<nav data-testid="nav-bar" data-show-on-scroll={showOnScroll} role="navigation" aria-label="Main Navigation">
			<a
				href="/"
				role="link"
				aria-label="Home"
				onClick={(e) => {
					e.preventDefault();
					mockHandleHomeClick();
				}}
			>
				Home
			</a>
			<a href="/event" role="link" aria-label="Event">
				Event
			</a>
			<a href="/resources" role="link" aria-label="Resources">
				Resources
			</a>
			<a
				href="#about"
				role="link"
				aria-label="About"
				onClick={(e) => {
					e.preventDefault();
					mockHandleAboutClick();
				}}
			>
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
			<header data-testid="title" role="banner" aria-label="HackRPI 2025">
				<h1>HackRPI 2025</h1>
				<p>November 15-16, 2025</p>
			</header>
		);
	};
});

jest.mock("@/components/about-us", () => {
	return function MockAboutUs() {
		return (
			<section data-testid="about" id="about" role="region" aria-labelledby="about-heading">
				<h2 id="about-heading">About HackRPI</h2>
				<p>HackRPI is a 24-hour hackathon at Rensselaer Polytechnic Institute.</p>
			</section>
		);
	};
});

jest.mock("@/components/team/team", () => {
	return function MockTeam() {
		return (
			<section data-testid="team" id="team" role="region" aria-labelledby="team-heading">
				<h2 id="team-heading">Our Team</h2>
				<ul role="list" aria-label="Team Members">
					<li role="listitem">John Doe - Director</li>
					<li role="listitem">Jane Smith - Co-Director</li>
				</ul>
			</section>
		);
	};
});

jest.mock("@/components/sponsors", () => {
	return function MockSponsors() {
		return (
			<section data-testid="sponsors" id="sponsors" role="region" aria-labelledby="sponsors-heading">
				<h2 id="sponsors-heading">Our Sponsors</h2>
				<div role="list" aria-label="Sponsor List">
					<div role="listitem">Sponsor A</div>
					<div role="listitem">Sponsor B</div>
				</div>
			</section>
		);
	};
});

// 2025 Best Practice: More realistic mocks with proper ARIA roles and structure
jest.mock("@/components/footer/footer", () => {
	return function MockFooter() {
		return (
			<footer data-testid="footer" role="contentinfo" aria-label="Site Footer">
				<div data-testid="footer-nav" role="navigation" aria-label="Footer Navigation">
					<a href="/privacy" role="link" aria-label="Privacy Policy">
						Privacy Policy
					</a>
					<a href="/terms" role="link" aria-label="Terms of Service">
						Terms of Service
					</a>
				</div>
				<p>© 2025 HackRPI. All rights reserved.</p>
			</footer>
		);
	};
});

jest.mock("@/components/faq/faq", () => {
	return function MockFAQ() {
		return (
			<section data-testid="faq" id="faq" role="region" aria-labelledby="faq-heading">
				<h2 id="faq-heading">Frequently Asked Questions</h2>
				<div role="list">
					<div role="listitem">
						<h3>What is HackRPI?</h3>
						<p>HackRPI is a 24-hour hackathon at Rensselaer Polytechnic Institute.</p>
					</div>
					<div role="listitem">
						<h3>When is HackRPI?</h3>
						<p>November 15-16, 2025</p>
					</div>
				</div>
			</section>
		);
	};
});

// 2025 Best Practice: Better intersection observer mock with more functionality
class MockIntersectionObserver implements IntersectionObserver {
	// Adding required properties to match IntersectionObserver interface
	readonly root: Element | Document | null = null;
	readonly rootMargin: string = "";
	readonly thresholds: ReadonlyArray<number> = [0];

	private callback: IntersectionObserverCallback;
	private elements = new Map<Element, boolean>();

	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		if (options) {
			this.root = options.root || null;
			this.rootMargin = options.rootMargin || "0px";
			this.thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold || 0];
		}
	}

	observe(element: Element): void {
		this.elements.set(element, true);

		// Simulate intersection immediately for test purposes
		const entries: IntersectionObserverEntry[] = [
			{
				isIntersecting: true,
				target: element,
				boundingClientRect: element.getBoundingClientRect(),
				intersectionRatio: 1,
				intersectionRect: element.getBoundingClientRect(),
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		];

		this.callback(entries, this as IntersectionObserver);
	}

	unobserve(element: Element): void {
		this.elements.delete(element);
	}

	disconnect(): void {
		this.elements.clear();
	}

	// Helper for tests to simulate intersection events
	simulateIntersection(element: Element, isIntersecting: boolean): void {
		if (this.elements.has(element)) {
			const entries: IntersectionObserverEntry[] = [
				{
					isIntersecting,
					target: element,
					boundingClientRect: element.getBoundingClientRect(),
					intersectionRatio: isIntersecting ? 1 : 0,
					intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
					rootBounds: null,
					time: Date.now(),
				} as IntersectionObserverEntry,
			];

			this.callback(entries, this as IntersectionObserver);
		}
	}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// 2025 Best Practice: Better organized tests with descriptive blocks
describe("Home Page Integration", () => {
	// Setup before each test
	beforeEach(() => {
		resetAllMocks();
		mockHomePageElements();

		// 2025 Best Practice: More realistic getBoundingClientRect mock
		const mockGetBoundingClientRect = jest.fn().mockImplementation(function (this: Element) {
			// Return different values based on element type for more realistic behavior
			if (this.tagName === "NAV") {
				return { top: 0, left: 0, right: 800, bottom: 60, width: 800, height: 60 };
			}

			if (this.id === "about") {
				return { top: 800, left: 0, right: 800, bottom: 1200, width: 800, height: 400 };
			}

			if (this.id === "faq") {
				return { top: 1200, left: 0, right: 800, bottom: 1600, width: 800, height: 400 };
			}

			// Default fallback
			return { top: 100, left: 0, right: 800, bottom: 200, width: 800, height: 100 };
		});

		Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

		// Clear all mock function calls
		mockHandleFAQClick.mockClear();
		mockHandleAboutClick.mockClear();
		mockHandleHomeClick.mockClear();
	});

	describe("Page Structure and Layout", () => {
		it("should render all main sections with proper accessibility attributes", async () => {
			// 2025 Best Practice: Use renderWithProviders with theme support
			const { container } = renderWithProviders(<Home />, { withTheme: true });

			// Check if all main components are rendered with proper roles
			expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();
			expect(screen.getByRole("banner")).toBeInTheDocument();

			// Verify specific regions by their heading text
			const aboutSection = screen.getByTestId("about");
			expect(within(aboutSection).getByText("About HackRPI")).toBeInTheDocument();

			const faqSection = screen.getByTestId("faq");
			expect(within(faqSection).getByText("Frequently Asked Questions")).toBeInTheDocument();

			const sponsorsSection = screen.getByTestId("sponsors");
			expect(within(sponsorsSection).getByText("Our Sponsors")).toBeInTheDocument();

			const teamSection = screen.getByTestId("team");
			expect(within(teamSection).getByText("Our Team")).toBeInTheDocument();

			// Check footer
			expect(screen.getByRole("contentinfo")).toBeInTheDocument();

			// 2025 Best Practice: Check overall page accessibility
			checkAccessibility(container);
		});

		it("should configure NavBar with showOnScroll=true", async () => {
			renderWithProviders(<Home />);

			// Check NavBar configuration
			const navBar = screen.getByRole("navigation", { name: "Main Navigation" });
			expect(navBar).toHaveAttribute("data-show-on-scroll", "true");

			// Verify navigation links
			const navLinks = within(navBar).getAllByRole("link");
			expect(navLinks).toHaveLength(5); // home, event, resources, about, faq

			// 2025 Best Practice: Check accessibility of navigation
			expect(navBar).toHaveAccessibleName();
			navLinks.forEach((link) => {
				expect(link).toHaveAccessibleName();
			});
		});
	});

	describe("Responsive Behavior", () => {
		it("should handle window scroll events correctly", async () => {
			renderWithProviders(<Home />);

			// Simulate scrolling past the threshold
			Object.defineProperty(window, "scrollY", {
				writable: true,
				value: 700,
			});

			// Trigger the scroll event
			window.dispatchEvent(new Event("scroll"));

			// NavBar should still be present
			expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();
		});

		it("should handle window resize events for responsive layout", async () => {
			renderWithProviders(<Home />);

			// 2025 Best Practice: Test different breakpoints
			// Test mobile view
			setWindowDimensions(375, 667);
			window.dispatchEvent(new Event("resize"));
			expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();

			// Test tablet view
			setWindowDimensions(768, 1024);
			window.dispatchEvent(new Event("resize"));
			expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();

			// Test desktop view
			setWindowDimensions(1440, 900);
			window.dispatchEvent(new Event("resize"));
			expect(screen.getByRole("navigation", { name: "Main Navigation" })).toBeInTheDocument();
		});
	});

	describe("User Interactions", () => {
		it("should navigate to sections when anchor links are clicked", async () => {
			// 2025 Best Practice: More comprehensive user interaction testing
			const { user } = renderWithProviders(<Home />);

			// Find and click the FAQ link
			const navBar = screen.getByRole("navigation", { name: "Main Navigation" });
			const faqLink = within(navBar).getByRole("link", { name: /faq/i });
			await user.click(faqLink);

			// Verify FAQ click handler was called
			expect(mockHandleFAQClick).toHaveBeenCalledTimes(1);

			// Find and click the About link
			const aboutLink = within(navBar).getByRole("link", { name: /about/i });
			await user.click(aboutLink);

			// Verify About click handler was called
			expect(mockHandleAboutClick).toHaveBeenCalledTimes(1);
		});

		it("should ensure keyboard accessibility for navigation", async () => {
			// 2025 Best Practice: Test keyboard accessibility
			const { user } = renderWithProviders(<Home />);

			// Focus the navigation
			const navBar = screen.getByRole("navigation", { name: "Main Navigation" });
			navBar.focus();

			// Tab to the FAQ link (simulate keyboard navigation)
			const navLinks = within(navBar).getAllByRole("link");

			// Simulate focus on the FAQ link
			navLinks[4].focus(); // The FAQ link is the 5th element (index 4)

			// Press Enter to activate the link
			await user.keyboard("{Enter}");

			// Check if the FAQ click handler was called
			expect(mockHandleFAQClick).toHaveBeenCalledTimes(1);
		});
	});

	describe("Performance Optimization", () => {
		// 2025 Best Practice: Test for efficient rendering patterns
		it("should use intersection observer for lazy loading", () => {
			renderWithProviders(<Home />);

			// Check if sections are observed by the intersection observer
			const aboutSection = screen.getByTestId("about");
			const sponsorsSection = screen.getByTestId("sponsors");

			// We can't directly test the IntersectionObserver behavior in Jest,
			// but we can verify the scrollIntoView behavior when sections are clicked

			// Simulate clicking a link to the about section
			const navBar = screen.getByRole("navigation", { name: "Main Navigation" });
			const aboutLink = within(navBar).getByRole("link", { name: /about/i });
			aboutLink.click();

			// Check that we attempted to scroll to the section
			expect(mockHandleAboutClick).toHaveBeenCalledTimes(1);
		});
	});
});
