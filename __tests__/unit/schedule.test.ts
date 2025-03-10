import { arrangeEvents } from "@/utils/schedule";
import type { Event } from "@/data/schedule";

describe("arrangeEvents", () => {
	// Utility function to create test events
	const createTestEvent = (id: string, start: number, end: number, column = 0): Event => ({
		id,
		title: `Event ${id}`,
		description: `Description ${id}`,
		startTime: start,
		endTime: end,
		location: `Location ${id}`,
		speaker: `Speaker ${id}`,
		eventType: "default",
		visible: true,
		column,
	});

	// Test case 1: Empty array
	it("should return an empty array when input is empty", () => {
		const result = arrangeEvents([]);
		expect(result).toEqual([]);
	});

	// Test case 2: Events with no overlaps
	it("should place events in a single column when there are no time conflicts", () => {
		const events: Event[] = [
			createTestEvent("1", 1000, 2000),
			createTestEvent("2", 2000, 3000),
			createTestEvent("3", 3000, 4000),
		];

		const result = arrangeEvents(events);
		expect(result.length).toBe(1); // Should have 1 column
		expect(result[0].length).toBe(3); // Column should contain all 3 events
	});

	// Test case 3: Events with overlaps
	it("should place overlapping events in separate columns", () => {
		const events: Event[] = [
			createTestEvent("1", 1000, 3000),
			createTestEvent("2", 2000, 4000),
			createTestEvent("3", 5000, 6000),
		];

		const result = arrangeEvents(events);
		expect(result.length).toBe(2); // Should have 2 columns

		// Check which events are in which column
		const eventsInFirstColumn = result[0].map((e) => e.id);
		const eventsInSecondColumn = result[1].map((e) => e.id);

		// Event 3 should be in the first column since it doesn't conflict
		expect(eventsInFirstColumn).toContain("3");

		// Events 1 and 2 should be in separate columns
		if (eventsInFirstColumn.includes("1")) {
			expect(eventsInSecondColumn).toContain("2");
		} else {
			expect(eventsInFirstColumn).toContain("2");
			expect(eventsInSecondColumn).toContain("1");
		}
	});

	// Test case 4: Events with predefined columns
	it("should respect column assignments for events", () => {
		const events: Event[] = [
			createTestEvent("1", 1000, 2000, 2),
			createTestEvent("2", 1500, 2500, 1),
			createTestEvent("3", 3000, 4000),
		];

		const result = arrangeEvents(events);

		// Check that events are in their assigned columns
		const column1Events = result[0].map((e) => e.id);
		const column2Events = result[1].map((e) => e.id);

		expect(column1Events).toContain("2"); // Event 2 should be in column 1
		expect(column2Events).toContain("1"); // Event 1 should be in column 2

		// Event 3 should be in one of the columns (algorithm dependent)
		const event3InColumn = result.some((column) => column.some((event) => event.id === "3"));
		expect(event3InColumn).toBe(true);
	});

	// Test case 5: Mixed events with some assigned columns and some not
	it("should handle events with and without column assignments", () => {
		const events: Event[] = [
			createTestEvent("1", 1000, 2000, 2),
			createTestEvent("2", 1500, 2500),
			createTestEvent("3", 1800, 3000),
		];

		const result = arrangeEvents(events);
		expect(result.length).toBeGreaterThanOrEqual(2); // Should have at least 2 columns

		// Event 1 should be in column 2 (index 1)
		const column2Events = result[1]?.map((e) => e.id) || [];
		expect(column2Events).toContain("1");

		// Events 2 and 3 should be placed in some column (not necessarily the same)
		const allEventIds = result.flatMap((column) => column.map((event) => event.id));
		expect(allEventIds).toContain("2");
		expect(allEventIds).toContain("3");
	});
});
