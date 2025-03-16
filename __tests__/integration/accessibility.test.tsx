/**
 * @jest-environment jsdom
 */
/**
 * Comprehensive Accessibility Test Suite
 *
 * This file contains integration tests focused on accessibility across
 * key components of the HackRPI website. These tests use jest-axe for
 * automated accessibility testing following 2025 best practices.
 */
import React from "react";
import { renderWithProviders, checkAutomatedA11y, checkAccessibility } from "../test-utils";
import { MockNavBar, MockFooter } from "../__mocks__/mockRegistry";

// Import components to test
import AboutUs from "@/components/about-us";

// Mock necessary components to isolate testing
jest.mock("@/components/nav-bar/nav-bar", () => MockNavBar);
jest.mock("@/components/footer/footer", () => MockFooter);
jest.mock("@/components/themed-components/registration-link", () => {
	return {
		__esModule: true,
		default: ({ children, className }: { children?: React.ReactNode; className?: string }) => (
			<div data-testid="registration-link" className={className} role="link" aria-label="Registration Link">
				{children || "Registration Link"}
			</div>
		),
	};
});

// Set a longer timeout for accessibility tests
jest.setTimeout(30000);

describe("Accessibility Integration Tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test one component only to avoid parallel axe issues
	it("AboutUs Component passes automated accessibility checks", async () => {
		const { container } = renderWithProviders(<AboutUs />);

		// Run automated accessibility tests with jest-axe
		await checkAutomatedA11y(container);

		// Also run our custom accessibility checks
		checkAccessibility(container);
	});

	it("maintains accessibility when components are composed together", async () => {
		// Create a composite page structure with multiple components
		const { container } = renderWithProviders(
			<div className="page-container" role="none">
				<MockNavBar />
				<main id="main-content">
					<AboutUs />
				</main>
				<MockFooter />
			</div>,
		);

		// Test the entire composition with automated checks
		await checkAutomatedA11y(container);
	});
});
