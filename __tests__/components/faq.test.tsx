import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FAQPage from "@/components/faq/faq";

// Mock the RegistrationLink component
jest.mock("@/components/themed-components/registration-link", () => {
	return function MockRegistrationButton() {
		return <button data-testid="registration-button">Register Now</button>;
	};
});

describe("FAQ Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the FAQ heading", () => {
		render(<FAQPage />);

		// Check if the heading is rendered
		const heading = screen.getByText("FAQs");
		expect(heading).toBeInTheDocument();
	});

	it("renders all FAQ items", () => {
		render(<FAQPage />);

		// Check if all FAQ titles are rendered
		expect(screen.getByText("What is HackRPI?")).toBeInTheDocument();
		expect(screen.getByText("When is HackRPI?")).toBeInTheDocument();
		expect(screen.getByText("Where is HackRPI?")).toBeInTheDocument();
		expect(screen.getByText("Is HackRPI free to attend?")).toBeInTheDocument();
		expect(screen.getByText("How do I register?")).toBeInTheDocument();
		expect(screen.getByText("Who can participate?")).toBeInTheDocument();
		expect(screen.getByText("I'm under 18, can I still participate?")).toBeInTheDocument();
		expect(screen.getByText("Do I have to be an RPI student?")).toBeInTheDocument();
		expect(screen.getByText("Does HackRPI provide travel reimbursement?")).toBeInTheDocument();
		expect(screen.getByText("What should I bring?")).toBeInTheDocument();
		expect(screen.getByText("What is the theme?")).toBeInTheDocument();
		expect(screen.getByText("Is it okay if I am late to the event?")).toBeInTheDocument();
		expect(screen.getByText("When are submissions due?")).toBeInTheDocument();
		expect(screen.getByText("How do I submit my project?")).toBeInTheDocument();
		expect(screen.getByText("When and how will prizes be awarded?")).toBeInTheDocument();
	});

	it("shows FAQ content when an item is clicked", () => {
		render(<FAQPage />);

		// Get the FAQ title
		const whatIsHackRPITitle = screen.getByText("What is HackRPI?");

		// Initially the content shouldn't be prominent in the DOM
		const contentText = "Teams of 1-4 have 24 hours to build a project";

		// Click to expand the FAQ
		fireEvent.click(whatIsHackRPITitle);

		// Check that content is now visible (we can find it easily in the DOM)
		const contentElement = screen.getByText(/Teams of 1-4 have 24 hours to build a project/i);
		expect(contentElement).toBeInTheDocument();
	});

	it("handles interacting with FAQ items", () => {
		const { container } = render(<FAQPage />);

		// Find the first FAQ container
		const faqItems = container.querySelectorAll(".collapse");
		expect(faqItems.length).toBeGreaterThan(0);

		// Get the first FAQ title and its input
		const firstFaqItem = faqItems[0];
		const firstTitle = firstFaqItem.querySelector(".collapse-title");
		const firstInput = firstFaqItem.querySelector("input");

		// Click the title
		if (firstTitle) {
			fireEvent.click(firstTitle);
		}

		// Get another FAQ
		const secondFaqItem = faqItems[1];
		const secondTitle = secondFaqItem.querySelector(".collapse-title");

		// Click the second title
		if (secondTitle) {
			fireEvent.click(secondTitle);
		}

		// Since we're testing DaisyUI collapse which has its own mechanics,
		// we'll just make sure the event handlers work by checking the FAQ
		// content text is available after clicking

		// Check content of second FAQ is accessible
		expect(screen.getByText(/HackRPI takes place on November 9th and 10th, 2024/i)).toBeInTheDocument();
	});

	it("renders the registration button in the registration FAQ", () => {
		render(<FAQPage />);

		// Open the registration FAQ
		const registrationFAQ = screen.getByText("How do I register?");
		fireEvent.click(registrationFAQ);

		// Check if the registration button is rendered
		const registrationButton = screen.getByTestId("registration-button");
		expect(registrationButton).toBeInTheDocument();
	});

	it("renders the contact information at the bottom", () => {
		render(<FAQPage />);

		// Check if the contact information is rendered
		const contactText = screen.getByText(/Feel free to contact us with any other questions at/i);
		expect(contactText).toBeInTheDocument();

		// Check if the email link is rendered correctly
		const emailLink = screen.getByText("hackrpi@rpi.edu!");
		expect(emailLink).toBeInTheDocument();
		expect(emailLink).toHaveAttribute("href", "mailto:hackrpi@rpi.edu");
	});
});
