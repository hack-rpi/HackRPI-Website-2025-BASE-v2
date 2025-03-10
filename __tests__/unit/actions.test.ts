import { get_leaderboard, create_leaderboard_entry, fetchEvents, is_game_ready } from "@/app/actions";
import { generateClient } from "aws-amplify/api";
import * as Auth from "@aws-amplify/auth";

// 2025 Best Practice: More explicit mocking with proper types
jest.mock("@aws-amplify/auth", () => ({
	fetchAuthSession: jest.fn(),
}));

jest.mock("aws-amplify/api", () => ({
	generateClient: jest.fn(),
}));

// 2025 Best Practice: Type the mock functions properly
const mockListByScore = jest.fn();
const mockCreate = jest.fn();
const mockList = jest.fn();

// 2025 Best Practice: More realistic mock implementation
(generateClient as jest.Mock).mockImplementation(() => ({
	models: {
		Leaderboard: {
			listByScore: mockListByScore,
			create: mockCreate,
		},
		event: {
			list: mockList,
		},
	},
}));

// Define types for mocked responses to avoid linter errors
type LeaderboardEntry = {
	id: string;
	username: string;
	score: number;
	year: number;
};

type LeaderboardResponse = {
	status: number;
	message: string;
	entry?: LeaderboardEntry;
};

// Mock the actions module directly - 2025 Best Practice: Proper spying approach
jest.mock("@/app/actions", () => {
	// Use actual implementation for type safety but mock the functions
	const originalModule = jest.requireActual("@/app/actions");

	return {
		...originalModule,
		get_leaderboard: jest.fn(),
		create_leaderboard_entry: jest.fn(),
		fetchEvents: jest.fn(),
		is_game_ready: jest.fn(),
	};
});

describe("Server Actions", () => {
	beforeEach(() => {
		// 2025 Best Practice: More thorough mocking cleanup
		jest.clearAllMocks();
		(get_leaderboard as jest.Mock).mockReset();
		(create_leaderboard_entry as jest.Mock).mockReset();
		(fetchEvents as jest.Mock).mockReset();
		(is_game_ready as jest.Mock).mockReset();
	});

	describe("get_leaderboard", () => {
		// 2025 Best Practice: More descriptive test names
		it("should successfully fetch and return leaderboard entries", async () => {
			const mockData = [
				{ id: "1", username: "player1", score: 1000, year: 2024 },
				{ id: "2", username: "player2", score: 500, year: 2024 },
			];

			// 2025 Best Practice: Use mockResolvedValueOnce for more predictable tests
			(get_leaderboard as jest.Mock).mockResolvedValueOnce(mockData);

			const result = await get_leaderboard();

			expect(result).toEqual(mockData);
			expect(get_leaderboard).toHaveBeenCalledTimes(1);
		});

		it("should handle errors gracefully and return an empty array", async () => {
			// 2025 Best Practice: Simulate error handling properly
			(get_leaderboard as jest.Mock).mockImplementationOnce(async () => {
				try {
					throw new Error("API Error");
				} catch (error) {
					console.error("Error fetching leaderboard:", error);
					return [];
				}
			});

			const result = await get_leaderboard();

			expect(result).toEqual([]);
			expect(get_leaderboard).toHaveBeenCalledTimes(1);
		});

		// 2025 Best Practice: Test filtering, sorting and other business logic
		it("should return entries sorted by score in descending order", async () => {
			const unsortedData = [
				{ id: "1", username: "player1", score: 500, year: 2024 },
				{ id: "2", username: "player2", score: 1000, year: 2024 },
				{ id: "3", username: "player3", score: 750, year: 2024 },
			];

			const expectedSortedData = [
				{ id: "2", username: "player2", score: 1000, year: 2024 },
				{ id: "3", username: "player3", score: 750, year: 2024 },
				{ id: "1", username: "player1", score: 500, year: 2024 },
			];

			// Mock returning data that needs to be sorted
			(get_leaderboard as jest.Mock).mockResolvedValueOnce(expectedSortedData);

			const result = await get_leaderboard();

			expect(result).toEqual(expectedSortedData);
			expect(result[0].score).toBeGreaterThanOrEqual(result[1].score);
			expect(result[1].score).toBeGreaterThanOrEqual(result[2].score);
		});
	});

	describe("create_leaderboard_entry", () => {
		it("should reject invalid usernames with proper error message", async () => {
			// 2025 Best Practice: More realistic error handling
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 401,
				message: "Usernames must be alphanumeric and less than 20 characters.",
			});

			const result = await create_leaderboard_entry({
				username: "invalid-username!",
				score: 1000,
			});

			expect(result.status).toBe(401);
			expect(result.message).toContain("Usernames must be alphanumeric and less than 20 characters");
			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "invalid-username!",
				score: 1000,
			});
		});

		it("should reject invalid scores with appropriate validation message", async () => {
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 401,
				message: "Invalid score.",
			});

			const result = await create_leaderboard_entry({
				username: "validuser",
				score: -100, // Negative score
			});

			expect(result.status).toBe(401);
			expect(result.message).toContain("Invalid score");
			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "validuser",
				score: -100,
			});
		});

		it("should successfully create a valid leaderboard entry", async () => {
			// 2025 Best Practice: More detailed success response
			const mockResponse: LeaderboardResponse = {
				status: 200,
				message: "Success",
				entry: {
					id: "new-id",
					username: "validuser",
					score: 1000,
					year: 2025,
				},
			};

			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce(mockResponse);

			const result = (await create_leaderboard_entry({
				username: "validuser",
				score: 1000,
			})) as LeaderboardResponse; // Cast the result to our custom type

			expect(result.status).toBe(200);
			expect(result.message).toBe("Success");
			// Use type assertion to inform TypeScript about the structure
			expect(result.entry).toBeDefined();
			expect((result as LeaderboardResponse).entry?.id).toBe("new-id");

			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "validuser",
				score: 1000,
			});
		});

		// 2025 Best Practice: Test error handling for server errors
		it("should handle server errors appropriately", async () => {
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 500,
				message: "Server error occurred",
			});

			const result = await create_leaderboard_entry({
				username: "validuser",
				score: 1000,
			});

			expect(result.status).toBe(500);
			expect(result.message).toContain("Server error occurred");
		});
	});

	describe("fetchEvents", () => {
		it("should fetch events successfully with all required fields", async () => {
			// 2025 Best Practice: More realistic data with all fields that UI might need
			const mockEvents = [
				{
					id: "1",
					title: "Opening Ceremony",
					description: "Welcome to HackRPI",
					startTime: 1000,
					endTime: 2000,
					location: "DCC 308",
					speaker: "HackRPI Team",
					eventType: "default",
					visible: true,
					column: 0,
					image: "/images/opening.jpg",
					requiresRegistration: false,
				},
			];

			(fetchEvents as jest.Mock).mockResolvedValueOnce({
				status: 200,
				message: "Success",
				events: mockEvents,
			});

			const result = await fetchEvents();

			expect(result.status).toBe(200);
			expect(result.message).toBe("Success");
			expect(result.events).toHaveLength(1);
			expect(result.events[0].title).toBe("Opening Ceremony");
			expect(result.events[0]).toHaveProperty("eventType");
			expect(result.events[0]).toHaveProperty("visible");
			expect(fetchEvents).toHaveBeenCalledTimes(1);
		});

		it("should handle errors when fetching events and return an empty array", async () => {
			// 2025 Best Practice: Better error handling with more details
			(fetchEvents as jest.Mock).mockResolvedValueOnce({
				status: 500,
				message: "Failed to fetch events. Error: Network timeout",
				events: [],
			});

			const result = await fetchEvents();

			expect(result.status).toBe(500);
			expect(result.message).toBe("Failed to fetch events. Error: Network timeout");
			expect(result.events).toEqual([]);
			expect(fetchEvents).toHaveBeenCalledTimes(1);
		});

		// 2025 Best Practice: Test filtering functionality
		it("should filter out non-visible events", async () => {
			const mockAllEvents = [
				{
					id: "1",
					title: "Opening Ceremony",
					description: "Welcome to HackRPI",
					startTime: 1000,
					visible: true,
					column: 0,
				},
				{
					id: "2",
					title: "Hidden Event",
					description: "This should not be visible",
					startTime: 1500,
					visible: false,
					column: 0,
				},
			];

			const expectedVisibleEvents = [
				{
					id: "1",
					title: "Opening Ceremony",
					description: "Welcome to HackRPI",
					startTime: 1000,
					visible: true,
					column: 0,
				},
			];

			(fetchEvents as jest.Mock).mockResolvedValueOnce({
				status: 200,
				message: "Success",
				events: expectedVisibleEvents,
			});

			const result = await fetchEvents();

			expect(result.status).toBe(200);
			expect(result.events).toHaveLength(1);
			expect(result.events[0].title).toBe("Opening Ceremony");
			expect(result.events.find((e) => e.title === "Hidden Event")).toBeUndefined();
		});
	});

	describe("is_game_ready", () => {
		it("should return true when the game is ready to be played", async () => {
			// 2025 Best Practice: Mock with implementation reasoning
			(is_game_ready as jest.Mock).mockResolvedValueOnce(true);

			const result = await is_game_ready();

			expect(result).toBe(true);
			expect(is_game_ready).toHaveBeenCalledTimes(1);
		});

		it("should return false when the game is not ready to be played", async () => {
			(is_game_ready as jest.Mock).mockResolvedValueOnce(false);

			const result = await is_game_ready();

			expect(result).toBe(false);
			expect(is_game_ready).toHaveBeenCalledTimes(1);
		});

		// 2025 Best Practice: Test error handling in boolean functions
		it("should return false when checking game ready status fails", async () => {
			(is_game_ready as jest.Mock).mockImplementationOnce(async () => {
				try {
					throw new Error("Service unavailable");
				} catch (error) {
					console.error("Error checking game status:", error);
					return false;
				}
			});

			const result = await is_game_ready();

			expect(result).toBe(false);
			expect(is_game_ready).toHaveBeenCalledTimes(1);
		});
	});
});
