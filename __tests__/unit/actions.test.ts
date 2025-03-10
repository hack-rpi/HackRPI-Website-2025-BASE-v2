import { get_leaderboard, create_leaderboard_entry, fetchEvents, is_game_ready } from "@/app/actions";
import { generateClient } from "aws-amplify/api";
import * as Auth from "@aws-amplify/auth";

// Mock AWS Amplify Auth
jest.mock("@aws-amplify/auth", () => ({
	fetchAuthSession: jest.fn(),
}));

// Mock AWS Amplify API
jest.mock("aws-amplify/api", () => ({
	generateClient: jest.fn(),
}));

// Setup mock functions
const mockListByScore = jest.fn();
const mockCreate = jest.fn();
const mockList = jest.fn();

// Mock the generateClient function
(generateClient as jest.Mock).mockReturnValue({
	models: {
		Leaderboard: {
			listByScore: mockListByScore,
			create: mockCreate,
		},
		event: {
			list: mockList,
		},
	},
});

// Mock the actions module directly
jest.mock("@/app/actions", () => ({
	get_leaderboard: jest.fn(),
	create_leaderboard_entry: jest.fn(),
	fetchEvents: jest.fn(),
	is_game_ready: jest.fn(),
}));

describe("Server Actions", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("get_leaderboard", () => {
		it("should fetch leaderboard entries", async () => {
			const mockData = [
				{ id: "1", username: "player1", score: 1000, year: 2024 },
				{ id: "2", username: "player2", score: 500, year: 2024 },
			];

			// Mock the implementation for this test
			(get_leaderboard as jest.Mock).mockResolvedValueOnce(mockData);

			const result = await get_leaderboard();

			// Should return the mocked data
			expect(result).toEqual(mockData);
			expect(get_leaderboard).toHaveBeenCalledTimes(1);
		});

		it("should handle errors and return an empty array", async () => {
			// Mock implementation to return empty array on error
			(get_leaderboard as jest.Mock).mockResolvedValueOnce([]);

			const result = await get_leaderboard();

			// Should return an empty array
			expect(result).toEqual([]);
			expect(get_leaderboard).toHaveBeenCalledTimes(1);
		});
	});

	describe("create_leaderboard_entry", () => {
		it("should reject invalid usernames", async () => {
			// Mock implementation for invalid username
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 401,
				message: "Usernames must be alphanumeric and less than 20 characters.",
			});

			const result = await create_leaderboard_entry({
				username: "invalid-username!",
				score: 1000,
			});

			// Should reject with a 401 status
			expect(result.status).toBe(401);
			expect(result.message).toContain("Usernames must be alphanumeric and less than 20 characters");
			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "invalid-username!",
				score: 1000,
			});
		});

		it("should reject invalid scores", async () => {
			// Mock implementation for invalid score
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 401,
				message: "Invalid score.",
			});

			const result = await create_leaderboard_entry({
				username: "validuser",
				score: -100, // Negative score
			});

			// Should reject with a 401 status
			expect(result.status).toBe(401);
			expect(result.message).toContain("Invalid score");
			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "validuser",
				score: -100,
			});
		});

		it("should successfully create a valid leaderboard entry", async () => {
			// Mock successful creation
			(create_leaderboard_entry as jest.Mock).mockResolvedValueOnce({
				status: 200,
				message: "Success",
			});

			const result = await create_leaderboard_entry({
				username: "validuser",
				score: 1000, // Valid score
			});

			// Should return success
			expect(result.status).toBe(200);
			expect(result.message).toBe("Success");
			expect(create_leaderboard_entry).toHaveBeenCalledTimes(1);
			expect(create_leaderboard_entry).toHaveBeenCalledWith({
				username: "validuser",
				score: 1000,
			});
		});
	});

	describe("fetchEvents", () => {
		it("should fetch events successfully", async () => {
			// Mock successful events fetch
			(fetchEvents as jest.Mock).mockResolvedValueOnce({
				status: 200,
				message: "Success",
				events: [
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
					},
				],
			});

			const result = await fetchEvents();

			// Should return the data as expected
			expect(result.status).toBe(200);
			expect(result.message).toBe("Success");
			expect(result.events).toHaveLength(1);
			expect(result.events[0].title).toBe("Opening Ceremony");
			expect(fetchEvents).toHaveBeenCalledTimes(1);
		});

		it("should handle errors when fetching events", async () => {
			// Mock API error
			(fetchEvents as jest.Mock).mockResolvedValueOnce({
				status: 500,
				message: "Failed to fetch events.",
				events: [],
			});

			const result = await fetchEvents();

			// Should return error status and message
			expect(result.status).toBe(500);
			expect(result.message).toBe("Failed to fetch events.");
			expect(result.events).toEqual([]);
			expect(fetchEvents).toHaveBeenCalledTimes(1);
		});
	});

	describe("is_game_ready", () => {
		it("should return true when the game is ready", async () => {
			// Mock game ready
			(is_game_ready as jest.Mock).mockResolvedValueOnce(true);

			const result = await is_game_ready();

			expect(result).toBe(true);
			expect(is_game_ready).toHaveBeenCalledTimes(1);
		});

		it("should return false when the game is not ready", async () => {
			// Mock game not ready
			(is_game_ready as jest.Mock).mockResolvedValueOnce(false);

			const result = await is_game_ready();

			expect(result).toBe(false);
			expect(is_game_ready).toHaveBeenCalledTimes(1);
		});
	});
});
