import React from "react";
import { screen, within } from "@testing-library/react";
import AboutUs from "@/components/about-us";
import { renderWithProviders, resetAllMocks, checkAccessibility } from "../test-utils";

// Mock the RegistrationLink component
jest.mock("@/components/themed-components/registration-link", () => {
	return function MockRegistrationLink({ className }: { className?: string }) {
		return (
			<div data-testid="registration-link" className={className} role="link" aria-label="Registration Link">
				Registration Link
			</div>
		);
	};
});

describe("AboutUs Component", () => {
	beforeEach(() => {
		// Reset the mocks before each test - 2025 best practice for test isolation
		resetAllMocks();
	});

	it("renders the component with correct headings and structure", () => {
		// 2025 best practice: Use the improved renderWithProviders
		const { container } = renderWithProviders(<AboutUs />);

		// Check if the main heading is rendered using role-based query (2025 best practice)
		const mainHeading = screen.getByRole("heading", { name: /About HackRPI/i });
		expect(mainHeading).toBeInTheDocument();

		// Check if the "When & Where" heading is rendered 
		const whenWhereHeading = screen.getByRole("heading", { name: /When & Where/i });
		expect(whenWhereHeading).toBeInTheDocument();
		
		// 2025 best practice: Test section structure and relationships
		// Use container query to find the about section (using the id)
		const aboutSection = container.querySelector("#about");
		expect(aboutSection).toBeInTheDocument();
		expect(within(aboutSection as HTMLElement).getByRole("heading", { name: /About HackRPI/i })).toBeInTheDocument();
	});

	it("renders the theme information with correct styling", () => {
		renderWithProviders(<AboutUs />);

		// 2025 best practice: Test for the theme information
		const themeElements = screen.getAllByText("Urban Upgrades");
		expect(themeElements.length).toBeGreaterThan(0);

		// Check styling with more robust assertions
		const firstThemeElement = themeElements[0];
		expect(firstThemeElement).toHaveClass("text-hackrpi-orange");
		expect(firstThemeElement).toHaveClass("font-bold");
		
		// 2025 best practice: Find a paragraph that contains the theme element
		const paragraphWithTheme = firstThemeElement.closest("p");
		expect(paragraphWithTheme).not.toBeNull();
		// The paragraph should contain text before or after the theme element
		expect(paragraphWithTheme?.textContent?.length).toBeGreaterThan(firstThemeElement.textContent?.length || 0);
	});

	it("renders the date and location information correctly", () => {
		renderWithProviders(<AboutUs />);

		// 2025 best practice: Test how the information is structured for users
		const dateElement = screen.getByText("November 15-16, 2025");
		expect(dateElement).toBeInTheDocument();
		
		// Test that location info is properly grouped - get the exact text content
		const rpiElement = screen.getAllByText(/Rensselaer Polytechnic Institute/)[1]; // Get the second occurrence (location section)
		expect(rpiElement).toBeInTheDocument();
		
		// Find the parent div that contains all location info
		const locationSection = rpiElement.closest("div");
		expect(locationSection).not.toBeNull();
		
		// Check that both location elements are within the same container
		expect(within(locationSection as HTMLElement).getByText("Darrin Communications Center")).toBeInTheDocument();
	});

	it("renders the registration link with correct styling", () => {
		// 2025 best practice: Render the component and get the container
		const { container } = renderWithProviders(<AboutUs />);

		// 2025 best practice: Use role-based queries
		const registrationLink = screen.getByRole("link", { name: /Registration Link/i });
		expect(registrationLink).toBeInTheDocument();
		expect(registrationLink).toHaveClass("text-xl");
		
		// 2025 best practice: Find the REGISTER NOW text separately
		const registerNowText = screen.getByText(/REGISTER NOW!/i);
		expect(registerNowText).toBeInTheDocument();
		
		// Verify they are both in the document but don't assert they're in the same container
		expect(container).toContainElement(registrationLink);
		expect(container).toContainElement(registerNowText);
	});

	it('renders the scrolling "REGISTER NOW!" text with correct styling', () => {
		const { container } = renderWithProviders(<AboutUs />);

		// 2025 best practice: Test animation container and content
		const registerText = screen.getByText(/REGISTER NOW!/i);
		expect(registerText).toBeInTheDocument();

		// Find the dark purple div and check styling and content
		const darkPurpleDiv = container.querySelector(".bg-hackrpi-dark-purple");
		expect(darkPurpleDiv).toBeInTheDocument();
		expect(darkPurpleDiv).toHaveClass("text-black");
		expect(darkPurpleDiv?.textContent).toContain("REGISTER NOW!");
		
		// 2025 best practice: Check if it has styling for scrolling text
		expect(darkPurpleDiv).toHaveClass("overflow-hidden");
		expect(darkPurpleDiv).toHaveClass("whitespace-nowrap");
	});

	it("renders the about description with key information", () => {
		renderWithProviders(<AboutUs />);

		// 2025 best practice: Test for key content that users need
		const introText = screen.getByText(/HackRPI 2024 is Rensselaer Polytechnic Institute/i);
		expect(introText).toBeInTheDocument();

		const goalText = screen.getByText(/Our goal is to inspire and challenge innovators/i);
		expect(goalText).toBeInTheDocument();
		
		// 2025 best practice: Test that important information is highlighted
		const highlightedInfo = screen.getAllByText(/Urban Upgrades/i);
		expect(highlightedInfo.length).toBeGreaterThan(0);
	});
	
	// 2025 best practice: Add accessibility testing
	it("is accessible with proper ARIA attributes", () => {
		const { container } = renderWithProviders(<AboutUs />);
		
		// 2025 best practice: Test for basic accessibility patterns
		const links = screen.getAllByRole("link");
		expect(links.length).toBeGreaterThan(0);
		links.forEach(link => {
			expect(link).toHaveAccessibleName();
		});
		
		const headings = screen.getAllByRole("heading");
		expect(headings.length).toBeGreaterThan(1);
		
		// Check that the component has a logical structure
		expect(container.querySelector("#about")).not.toBeNull();
	});
});
