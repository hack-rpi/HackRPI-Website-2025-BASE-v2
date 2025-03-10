import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Schedule, { TimelineLabel } from "@/components/schedule/schedule";
import type { Event } from "@/data/schedule";

describe("Schedule Component", () => {
	// Sample data for testing
	const mockTime: Date = new Date("2025-11-09T12:00:00");

	const mockTimes: TimelineLabel[] = [
		{ str: "9:00 AM", unix: 1731160800000 },
		{ str: "10:00 AM", unix: 1731164400000 },
		{ str: "11:00 AM", unix: 1731168000000 },
		{ str: "12:00 PM", unix: 1731171600000 },
	];

	const mockEvents: Event[] = [
		{
			id: "1",
			title: "Opening Ceremony",
			description: "Welcome to HackRPI",
			startTime: 1731164400000, // 10:00 AM
			endTime: 1731168000000, // 11:00 AM
			location: "DCC 308",
			speaker: "HackRPI Team",
			eventType: "default",
			visible: true,
			column: 0,
		},
		{
			id: "2",
			title: "Workshop: Intro to React",
			description: "Learn the basics of React",
			startTime: 1731168000000, // 11:00 AM
			endTime: 1731171600000, // 12:00 PM
			location: "DCC 318",
			speaker: "Jane Doe",
			eventType: "workshop",
			visible: true,
			column: 0,
		},
		{
			id: "3",
			title: "Lunch",
			description: "Pizza and drinks",
			startTime: 1731171600000, // 12:00 PM
			endTime: 1731175200000, // 1:00 PM
			location: "DCC Lobby",
			speaker: "",
			eventType: "food",
			visible: true,
			column: 0,
		},
	];

	const mockOnEventClick = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		// Mock getElementById and offsetTop for timeline positioning
		document.getElementById = jest.fn().mockImplementation((id) => {
			return {
				offsetTop: 100 + Number(id) / 10000000, // Use a fraction of the unix timestamp for a unique value
			} as unknown as HTMLElement;
		});
	});

	it("renders the timeline with correct time labels", () => {
		render(<Schedule times={mockTimes} events={mockEvents} currentTime={mockTime} onEventClick={mockOnEventClick} />);

		// Check if all time labels are rendered
		mockTimes.forEach((time) => {
			expect(screen.getByText(time.str)).toBeInTheDocument();
		});
	});

	it("renders the events with correct titles and locations", () => {
		render(<Schedule times={mockTimes} events={mockEvents} currentTime={mockTime} onEventClick={mockOnEventClick} />);

		// Check if all event titles are rendered
		expect(screen.getByText("Opening Ceremony")).toBeInTheDocument();
		expect(screen.getByText("Workshop: Intro to React")).toBeInTheDocument();
		expect(screen.getByText("Lunch")).toBeInTheDocument();

		// Check if locations are rendered
		expect(screen.getByText("DCC 308 • HackRPI Team")).toBeInTheDocument();
		expect(screen.getByText("DCC 318 • Jane Doe")).toBeInTheDocument();
		expect(screen.getByText("DCC Lobby")).toBeInTheDocument();
	});

	it("renders events with appropriate styling based on their type", () => {
		// Mock the events with future start times to avoid time-based styling
		const futureEvents: Event[] = [
			{
				...mockEvents[0],
				startTime: mockTime.getTime() + 3600000, // 1 hour in the future
				endTime: mockTime.getTime() + 7200000, // 2 hours in the future
				eventType: "default",
			},
			{
				...mockEvents[1],
				startTime: mockTime.getTime() + 3600000, // 1 hour in the future
				endTime: mockTime.getTime() + 7200000, // 2 hours in the future
				eventType: "workshop",
			},
			{
				...mockEvents[2],
				startTime: mockTime.getTime() + 3600000, // 1 hour in the future
				endTime: mockTime.getTime() + 7200000, // 2 hours in the future
				eventType: "food",
			},
		];

		render(<Schedule times={mockTimes} events={futureEvents} currentTime={mockTime} onEventClick={mockOnEventClick} />);

		// We'll check the Tailwind class names in the rendered HTML
		// Get elements by their titles
		const openingCeremonyTitle = screen.getByText("Opening Ceremony");
		const workshopTitle = screen.getByText("Workshop: Intro to React");
		const lunchTitle = screen.getByText("Lunch");

		// Check that the parent divs (event containers) have the expected class
		const openingCeremonyContainer = openingCeremonyTitle.closest("div");
		const workshopContainer = workshopTitle.closest("div");
		const lunchContainer = lunchTitle.closest("div");

		// Default event should have primary blue
		expect(openingCeremonyContainer?.className).toContain("bg-hackrpi-primary-blue");

		// Workshop event should have primary light green
		expect(workshopContainer?.className).toContain("bg-hackrpi-primary-light-green");

		// Food event should have secondary light green
		expect(lunchContainer?.className).toContain("bg-hackrpi-secondary-light-green");
	});

	it("applies different styling to events based on current time", () => {
		// Create a time after all events
		const futureTime = new Date("2025-11-09T14:00:00");

		render(
			<Schedule
				times={mockTimes}
				events={mockEvents}
				currentTime={futureTime} // All events are in the past
				onEventClick={mockOnEventClick}
			/>,
		);

		// All events should now have a past event style
		const pastEvent = screen.getByText("Opening Ceremony").closest("div");
		expect(pastEvent).toHaveClass("bg-hackrpi-secondary-light-blue");
		expect(pastEvent).toHaveClass("text-gray-300");
	});

	it("calls onEventClick when an event is clicked", () => {
		render(<Schedule times={mockTimes} events={mockEvents} currentTime={mockTime} onEventClick={mockOnEventClick} />);

		// Find an event and click it
		const openingCeremony = screen.getByText("Opening Ceremony").closest("div");
		fireEvent.click(openingCeremony!);

		// Check if the click handler was called with the right event
		expect(mockOnEventClick).toHaveBeenCalledTimes(1);
		expect(mockOnEventClick).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "1",
				title: "Opening Ceremony",
			}),
		);
	});

	it("handles events with empty speaker field correctly", () => {
		render(<Schedule times={mockTimes} events={mockEvents} currentTime={mockTime} onEventClick={mockOnEventClick} />);

		// The lunch event has no speaker
		const lunchLocation = screen.getByText("DCC Lobby");

		// It should not include the bullet and speaker name
		expect(lunchLocation.textContent).not.toContain("•");
	});
});
