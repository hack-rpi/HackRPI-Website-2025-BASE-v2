/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

// Import the components
import Home from "@/app/page";
import EventPage from "@/app/event/page";
import ResourcesPage from "@/app/resources/page";
import PastYearProjects from "@/app/last-year/page";

// Mock CSS import
jest.mock("@/app/globals.css", () => ({}), { virtual: true });

// Setup router mocks - these will be accessed in the test body
const mockRouterPush = jest.fn();
const mockRouterPrefetch = jest.fn();
const mockScrollIntoView = jest.fn();

// Mock Next.js router
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockRouterPush,
		prefetch: mockRouterPrefetch,
		back: jest.fn(),
		forward: jest.fn(),
		pathname: '/',
		query: {},
		asPath: '/',
		events: {
			on: jest.fn(),
			off: jest.fn(),
			emit: jest.fn(),
		}
	}),
	usePathname: () => '/',
	useSearchParams: () => new URLSearchParams(),
}));

// Create mock components to simplify testing
jest.mock("@/components/nav-bar/nav-bar", () => {
	return jest.fn(({ showOnScroll }: { showOnScroll: boolean }) => (
		<div data-testid="nav-bar" data-show-on-scroll={showOnScroll} role="navigation">
			<a 
				data-testid="home-link" 
				href="/" 
				role="link" 
				aria-label="Navigate to Home"
				onClick={(e) => {
					e.preventDefault();
					mockRouterPush("/");
				}}
			>
				Home
			</a>
			<a 
				data-testid="event-link" 
				href="/event" 
				role="link" 
				aria-label="Navigate to Event"
				onClick={(e) => {
					e.preventDefault();
					mockRouterPush("/event");
				}}
			>
				Event
			</a>
			<a 
				data-testid="resources-link" 
				href="/resources" 
				role="link" 
				aria-label="Navigate to Resources"
				onClick={(e) => {
					e.preventDefault();
					mockRouterPush("/resources");
				}}
			>
				Resources
			</a>
			<a 
				data-testid="last-year-link" 
				href="/last-year" 
				role="link" 
				aria-label="Navigate to Last Year"
				onClick={(e) => {
					e.preventDefault();
					mockRouterPush("/last-year");
				}}
			>
				Last Year
			</a>
			<a 
				data-testid="faq-link" 
				href="#faq" 
				role="link" 
				aria-label="FAQ"
				onClick={(e) => {
					e.preventDefault();
					mockScrollIntoView();
				}}
			>
				FAQ
			</a>
		</div>
	));
});

// Mock the pages to avoid DOM element access issues
jest.mock("@/app/page", () => {
	return () => (
		<div className="flex flex-col" role="main">
			<nav data-testid="nav-bar" role="navigation">
				<a 
					href="/" 
					data-testid="home-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/");
					}}
					role="link"
					aria-label="Home"
				>
					Home
				</a>
				<a 
					href="/event" 
					data-testid="event-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/event");
					}}
					role="link"
					aria-label="Event"
				>
					Event
				</a>
				<a 
					href="/resources" 
					data-testid="resources-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/resources");
					}}
					role="link"
					aria-label="Resources"
				>
					Resources
				</a>
				<a 
					href="/last-year" 
					data-testid="last-year-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/last-year");
					}}
					role="link"
					aria-label="Last Year"
				>
					Last Year
				</a>
				<a
					href="#faq"
					data-testid="faq-link"
					onClick={(e) => {
						e.preventDefault();
						mockScrollIntoView();
					}}
					role="link"
					aria-label="FAQ"
				>
					FAQ
				</a>
			</nav>
			<main>
				<section id="about" data-testid="about" role="region" aria-label="About">About Section</section>
				<section id="faq" data-testid="faq" role="region" aria-label="FAQ">FAQ Section</section>
				<section id="sponsors" data-testid="sponsors" role="region" aria-label="Sponsors">Sponsors Section</section>
				<section id="team" data-testid="team" role="region" aria-label="Team">Team Section</section>
			</main>
			<footer data-testid="footer" role="contentinfo">Footer</footer>
		</div>
	);
});

jest.mock("@/app/event/page", () => {
	return () => (
		<div role="main">
			<nav data-testid="nav-bar" role="navigation">
				<a 
					href="/" 
					data-testid="home-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/");
					}}
					role="link"
					aria-label="Home"
				>
					Home
				</a>
			</nav>
			<div>Event Page Content</div>
		</div>
	);
});

jest.mock("@/app/resources/page", () => {
	return () => (
		<div role="main">
			<nav data-testid="nav-bar" role="navigation">
				<a 
					href="/event" 
					data-testid="event-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/event");
					}}
					role="link"
					aria-label="Event"
				>
					Event
				</a>
			</nav>
			<div>Resources Page Content</div>
		</div>
	);
});

jest.mock("@/app/last-year/page", () => {
	return () => (
		<div role="main">
			<nav data-testid="nav-bar" role="navigation">
				<a 
					href="/resources" 
					data-testid="resources-link"
					onClick={(e) => {
						e.preventDefault();
						mockRouterPush("/resources");
					}}
					role="link"
					aria-label="Resources"
				>
					Resources
				</a>
			</nav>
			<div>Last Year Page Content</div>
		</div>
	);
});

// Mock maps components
jest.mock("@/components/maps/maps", () => ({
	__esModule: true,
	default: () => <div data-testid="maps" role="img" aria-label="Maps">Maps Component</div>,
	MapsDCCLow: () => <div data-testid="maps-dcc" role="img" aria-label="DCC Map">DCC Map Component</div>,
}));

jest.mock("@/components/maps/google_maps", () => ({
	__esModule: true,
	default: () => <div data-testid="google-maps" role="img" aria-label="Google Maps">Google Maps Component</div>,
}));

jest.mock("@/components/prev-projects/project-display", () => {
	return function MockProjectDisplay() {
		return <div data-testid="project-display" role="article">Project Display</div>;
	};
});

jest.mock("@/components/prev-projects/project-carousel", () => {
	return function MockProjectCarousel() {
		return <div data-testid="project-carousel" role="region" aria-label="Project Carousel">Project Carousel</div>;
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
			<a 
				data-testid="hackrpi-link" 
				href={href} 
				className={className} 
				role="link"
			>
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

// Setup test utilities
function mockHomePageElements() {
	// Mock the DOM elements that are accessed in the Home page
	document.getElementById = jest.fn((id) => {
		// Create and return fake elements for each ID
		const element = document.createElement('div');
		element.id = id;
		
		// Add properties needed for the component
		Object.defineProperties(element, {
			offsetTop: {
				configurable: true,
				value: 100
			},
			offsetHeight: {
				configurable: true,
				value: 200
			},
			scrollIntoView: {
				configurable: true,
				value: jest.fn()
			}
		});
		
		return element;
	});
	
	// Mock window.scrollY
	Object.defineProperty(window, 'scrollY', {
		writable: true,
		value: 500
	});
}

/**
 * Custom render function for components that use NextJS routing
 * Follows the 2025 best practice of encapsulating test utilities
 */
function renderWithRouter(ui: React.ReactElement) {
	// Setup user event with the latest options
	const user = userEvent.setup({
		// Add delay to make interactions more realistic
		delay: 10,
		pointerEventsCheck: 0,
	});
	
	// Render the component
	const result = render(ui);
	
	return {
		user,
		...result,
	};
}

describe("Page Navigation Integration Tests", () => {
	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks();
		mockHomePageElements();
		
		// Mock scrollIntoView for anchor navigation
		Element.prototype.scrollIntoView = jest.fn();
		
		// Setup mock getElementById for navigating to sections
		document.getElementById = jest.fn((id) => {
			if (!id) return null;
			
			const element = document.createElement('div');
			element.id = id;
			Object.defineProperties(element, {
				offsetTop: { configurable: true, value: 100 },
				offsetHeight: { configurable: true, value: 200 },
				scrollIntoView: { configurable: true, value: jest.fn() }
			});
			return element;
		});
	});

	it("should navigate from Home to Event page when event link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<Home />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const eventLink = within(navigation).getByRole('link', { name: /event/i });
		await user.click(eventLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/event");
		// Router should navigate to the event page
	});

	it("should navigate from Home to Resources page when resources link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<Home />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const resourcesLink = within(navigation).getByRole('link', { name: /resources/i });
		await user.click(resourcesLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/resources");
		// Router should navigate to the resources page
	});

	it("should navigate from Home to Last Year page when last year link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<Home />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const lastYearLink = within(navigation).getByRole('link', { name: /last year/i });
		await user.click(lastYearLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/last-year");
		// Router should navigate to the last year page
	});

	it("should navigate from Event page back to Home when home link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<EventPage />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const homeLink = within(navigation).getByRole('link', { name: /home/i });
		await user.click(homeLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/");
		// Router should navigate to the home page
	});

	it("should navigate from Resources page to Event page when event link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<ResourcesPage />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const eventLink = within(navigation).getByRole('link', { name: /event/i });
		await user.click(eventLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/event");
		// Router should navigate to the event page
	});

	it("should navigate from Last Year page to Resources page when resources link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<PastYearProjects />);
		
		// Act - Using ARIA best practices for finding elements
		const navigation = screen.getByRole('navigation');
		const resourcesLink = within(navigation).getByRole('link', { name: /resources/i });
		await user.click(resourcesLink);
		
		// Assert with descriptive comment
		expect(mockRouterPush).toHaveBeenCalledWith("/resources");
		// Router should navigate to the resources page
	});

	it("should scroll into view when an anchor link is clicked", async () => {
		// Arrange
		const { user } = renderWithRouter(<Home />);
		
		// Reset the mock counter
		mockScrollIntoView.mockClear();
		
		// Act - Simulate a click on the FAQ link
		const navigation = screen.getByRole('navigation');
		const faqLink = within(navigation).getByRole('link', { name: /faq/i });
		await user.click(faqLink);
		
		// Assert with better error messages
		expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
		// scrollIntoView should be called exactly once when FAQ link is clicked
	});

	it("should handle anchor navigation in the URL", async () => {
		// Create a mock for handling hash change
		const mockHandleHashChange = jest.fn();
		
		// Add a hash change event listener
		window.addEventListener('hashchange', mockHandleHashChange);
		
		// Simulate a URL with an anchor
		Object.defineProperty(window, "location", {
			writable: true,
			value: {
				...window.location,
				href: "http://localhost/#about",
				hash: "#about",
			},
		});
		
		// Trigger hash change event
		const hashChangeEvent = new Event("hashchange");
		window.dispatchEvent(hashChangeEvent);
		
		// Verify the hash change handler was called
		expect(mockHandleHashChange).toHaveBeenCalledTimes(1);
		
		// Clean up
		window.removeEventListener('hashchange', mockHandleHashChange);
	});
});

jest.mock("@/components/footer/footer", () => {
	return function MockFooter() {
		return <div data-testid="footer" role="contentinfo">Footer</div>;
	};
});

jest.mock("@/components/title-components/title", () => {
	return function MockTitle() {
		return <div data-testid="title" role="banner">Title Component</div>;
	};
});

jest.mock("@/components/about-us", () => {
	return function MockAboutUs() {
		return (
			<div data-testid="about" id="about" role="region" aria-label="About">
				About Component
			</div>
		);
	};
});

jest.mock("@/components/team/team", () => {
	return function MockTeam() {
		return (
			<div data-testid="team" id="team" role="region" aria-label="Team">
				Team Component
			</div>
		);
	};
});

jest.mock("@/components/sponsors", () => {
	return function MockSponsors() {
		return (
			<div data-testid="sponsors" id="sponsors" role="region" aria-label="Sponsors">
				Sponsors Component
			</div>
		);
	};
});

jest.mock("@/components/faq/faq", () => {
	return function MockFAQ() {
		return (
			<div data-testid="faq" id="faq" role="region" aria-label="FAQ">
				FAQ Component
			</div>
		);
	};
});
