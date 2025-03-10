/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock CSS import
jest.mock("@/app/globals.css", () => ({}), { virtual: true });

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

// Create mock components to simplify testing
jest.mock("@/components/nav-bar/nav-bar", () => {
	// The actual implementation will be provided in each test
	return jest.fn(({ showOnScroll }: { showOnScroll: boolean }) => (
		<div data-testid="nav-bar" data-show-on-scroll={showOnScroll}>
			<a data-testid="home-link" href="/">
				Home
			</a>
			<a data-testid="event-link" href="/event">
				Event
			</a>
			<a data-testid="resources-link" href="/resources">
				Resources
			</a>
			<a data-testid="last-year-link" href="/last-year">
				Last Year
			</a>
		</div>
	));
});

jest.mock("@/components/footer/footer", () => {
	return function MockFooter() {
		return <div data-testid="footer">Footer</div>;
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

jest.mock("@/components/faq/faq", () => {
	return function MockFAQ() {
		return (
			<div data-testid="faq" id="faq">
				FAQ Component
			</div>
		);
	};
});

// Mock maps components
jest.mock("@/components/maps/maps", () => ({
	__esModule: true,
	default: () => <div data-testid="maps">Maps Component</div>,
	MapsDCCLow: () => <div data-testid="maps-dcc">DCC Map Component</div>,
}));

jest.mock("@/components/maps/google_maps", () => ({
	__esModule: true,
	default: () => <div data-testid="google-maps">Google Maps Component</div>,
}));

jest.mock("@/components/prev-projects/project-display", () => {
	return function MockProjectDisplay(props: any) {
		return <div data-testid="project-display">Project Display</div>;
	};
});

jest.mock("@/components/prev-projects/project-carousel", () => {
	return function MockProjectCarousel(props: any) {
		return <div data-testid="project-carousel">Project Carousel</div>;
	};
});

jest.mock("@/components/themed-components/hackrpi-link", () => {
	return function MockHackRPILink({
		href,
		children,
		className,
	}: {
		href: string;
		children: React.ReactNode;
		className?: string;
	}) {
		return (
			<a data-testid="hackrpi-link" href={href} className={className}>
				{children}
			</a>
		);
	};
});

// Mock the intersection observer
global.IntersectionObserver = jest.fn(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
	root: null,
	rootMargin: "",
	thresholds: [],
	takeRecords: jest.fn().mockReturnValue([]),
})) as unknown as typeof IntersectionObserver;

// Import the components after all mocks are defined
import Home from "@/app/page";
import EventPage from "@/app/event/page";
import ResourcesPage from "@/app/resources/page";
import PastYearProjects from "@/app/last-year/page";

// Router mock interface
interface RouterMock {
	push: jest.Mock;
	prefetch: jest.Mock;
	back: jest.Mock;
	forward: jest.Mock;
}

describe("Page Navigation Integration Tests", () => {
	// Mock router push function
	const pushMock = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		// Setup router mock
		(useRouter as jest.Mock).mockReturnValue({
			push: pushMock,
			prefetch: jest.fn(),
			back: jest.fn(),
			forward: jest.fn(),
		} as RouterMock);

		// Mock scrollIntoView for anchor navigation
		Element.prototype.scrollIntoView = jest.fn();

		// Setup mock getElementById for navigating to sections
		document.getElementById = jest.fn((id) => {
			return {
				id,
				scrollIntoView: jest.fn(),
			} as unknown as HTMLElement;
		});
	});

	it("should navigate from Home to Event page", () => {
		render(<Home />);

		// Check the NavBar is rendered
		const navbar = screen.getByTestId("nav-bar");
		expect(navbar).toBeInTheDocument();

		// Find and click the Event link
		const eventLink = screen.getByTestId("event-link");
		fireEvent.click(eventLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/event");
	});

	it("should navigate from Home to Resources page", () => {
		render(<Home />);

		// Find and click the Resources link
		const resourcesLink = screen.getByTestId("resources-link");
		fireEvent.click(resourcesLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/resources");
	});

	it("should navigate from Home to Last Year page", () => {
		render(<Home />);

		// Find and click the Last Year link
		const lastYearLink = screen.getByTestId("last-year-link");
		fireEvent.click(lastYearLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/last-year");
	});

	it("should navigate from Event page back to Home", () => {
		render(<EventPage />);

		// Find and click the Home link
		const homeLink = screen.getByTestId("home-link");
		fireEvent.click(homeLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/");
	});

	it("should navigate from Resources page to Event page", () => {
		render(<ResourcesPage />);

		// Find and click the Event link
		const eventLink = screen.getByTestId("event-link");
		fireEvent.click(eventLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/event");
	});

	it("should navigate from Last Year page to Resources page", () => {
		render(<PastYearProjects />);

		// Find and click the Resources link
		const resourcesLink = screen.getByTestId("resources-link");
		fireEvent.click(resourcesLink);

		// Verify the router was called with the correct path
		expect(pushMock).toHaveBeenCalledWith("/resources");
	});

	it("should navigate to section anchors within Home page", () => {
		render(<Home />);

		// Mock the scrollIntoView function directly
		const scrollIntoViewMock = jest.fn();

		// Override the previous mock for the faq element specifically
		document.getElementById = jest.fn().mockImplementation((id) => {
			if (id === "faq") {
				return {
					id,
					scrollIntoView: scrollIntoViewMock,
				} as unknown as HTMLElement;
			}
			return null;
		});

		// Create a mock anchor link for the FAQ section
		const faqAnchorLink = document.createElement("a");
		faqAnchorLink.href = "#faq";
		faqAnchorLink.textContent = "Go to FAQ";
		document.body.appendChild(faqAnchorLink);

		// Click the FAQ anchor link
		fireEvent.click(faqAnchorLink);

		// Verify that getElementById was called with 'faq'
		expect(document.getElementById).toHaveBeenCalledWith("faq");

		// The click should trigger the scrollIntoView
		expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
	});

	it("should correctly handle anchor navigation in the URL", () => {
		// Mock the scrollIntoView function directly
		const scrollIntoViewMock = jest.fn();

		// Override the document.getElementById mock for the 'about' element
		document.getElementById = jest.fn().mockImplementation((id) => {
			if (id === "about") {
				return {
					id,
					scrollIntoView: scrollIntoViewMock,
				} as unknown as HTMLElement;
			}
			return null;
		});

		// Simulate a URL with an anchor
		const originalLocation = window.location;
		Object.defineProperty(window, "location", {
			writable: true,
			value: {
				...originalLocation,
				href: "http://localhost/#about",
				hash: "#about",
			},
		});

		render(<Home />);

		// Verify that getElementById was called for the anchor
		expect(document.getElementById).toHaveBeenCalledWith("about");

		// Now trigger the hash change event manually
		const hashChangeEvent = new Event("hashchange");
		window.dispatchEvent(hashChangeEvent);

		// Verify that scrollIntoView was called
		expect(scrollIntoViewMock).toHaveBeenCalled();

		// Restore original location
		Object.defineProperty(window, "location", {
			writable: true,
			value: originalLocation,
		});
	});
});
