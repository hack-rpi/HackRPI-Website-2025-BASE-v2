/**
 * Unit tests for announcements API route handler
 * Tests the GET and POST endpoints for announcements
 */

// Mock environment variables before imports
process.env.MONGO_URI = "mongodb://test:27017/test";

// Mock all dependencies before importing the route
jest.mock("dotenv", () => ({
	config: jest.fn(),
}));

// Create mongoose mocks as exports to ensure they're available
const mockFind = jest.fn();
const mockSort = jest.fn();
const mockSave = jest.fn();

// Mock mongoose first without referencing other mocks
jest.mock("mongoose", () => {
	// Create the model inside the mock factory
	const modelMock = jest.fn();
	
	return {
		connection: {
			readyState: 1,
		},
		connect: jest.fn().mockResolvedValue(undefined),
		models: {},
		model: modelMock,
		Schema: jest.fn().mockImplementation(() => ({})),
	};
});

// Import after mocks are set up
import mongoose from "mongoose";

// Mock NextResponse after mongoose
jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((data, options) => ({
			json: async () => data,
			status: options?.status || 200,
			ok: (options?.status || 200) >= 200 && (options?.status || 200) < 300,
		})),
	},
}));

// Now import the route handlers
import { GET, POST } from "@/app/api/announcements/route";

// Create the announcement model after imports
const mockAnnouncementModel: any = jest.fn().mockImplementation((data) => ({
	...data,
	save: mockSave,
}));
mockAnnouncementModel.find = mockFind;

// Update mongoose to return our model
(mongoose.model as jest.Mock).mockReturnValue(mockAnnouncementModel);
(mongoose.models as any).Announcement = mockAnnouncementModel;

describe("Announcements API Route", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		
		// Reset mock implementations
		mockFind.mockClear();
		mockSort.mockClear();
		mockSave.mockClear();
		
		// Setup default mock chain for find().sort()
		mockFind.mockReturnValue({ sort: mockSort });
		mockSort.mockResolvedValue([]);
		
		// Ensure connected state
		(mongoose.connection.readyState as any) = 1;
	});

	describe("GET endpoint", () => {
		it("should fetch announcements successfully", async () => {
			const mockAnnouncements = [
				{
					_id: "1",
					title: "Test Announcement 1",
					message: "This is a test",
					name: "Admin",
					time: new Date("2025-01-01"),
				},
				{
					_id: "2",
					title: "Test Announcement 2",
					message: "Another test",
					name: "User",
					time: new Date("2025-01-02"),
				},
			];

			mockSort.mockResolvedValue(mockAnnouncements);

			const response = await GET();
			const data = await response.json();

			expect(mockFind).toHaveBeenCalled();
			expect(mockSort).toHaveBeenCalledWith({ time: -1 });
			expect(data).toEqual(mockAnnouncements);
		});

		it("should handle empty announcements", async () => {
			mockSort.mockResolvedValue([]);

			const response = await GET();
			const data = await response.json();

			expect(data).toEqual([]);
			expect(response.status).toBe(200);
		});

		it("should handle database errors", async () => {
			mockFind.mockImplementation(() => {
				throw new Error("Database error");
			});

			const response = await GET();
			const data = await response.json();

			expect(data).toEqual({ error: "Failed to fetch announcements" });
			expect(response.status).toBe(500);
		});
	});

	describe("POST endpoint", () => {
		// Simple Request mock for testing
		const createRequest = (body: any) => ({
			json: async () => body,
		} as Request);

		it("should create announcement successfully", async () => {
			const newAnnouncement = {
				title: "New Announcement",
				message: "This is a new announcement",
				name: "Admin",
				links: "http://example.com",
			};

			const savedAnnouncement = {
				...newAnnouncement,
				_id: "123",
				time: new Date(),
			};

			mockSave.mockResolvedValue(savedAnnouncement);

			const response = await POST(createRequest(newAnnouncement));
			const data = await response.json();

			expect(mockAnnouncementModel).toHaveBeenCalledWith(
				expect.objectContaining({
					title: newAnnouncement.title,
					message: newAnnouncement.message,
					name: newAnnouncement.name,
					links: newAnnouncement.links,
				})
			);
			expect(mockSave).toHaveBeenCalled();
			expect(response.status).toBe(201);
		});

		it("should handle missing required fields", async () => {
			const testCases = [
				{ message: "msg", name: "name" }, // missing title
				{ title: "title", name: "name" }, // missing message
				{ title: "title", message: "msg" }, // missing name
			];

			for (const invalidData of testCases) {
				const response = await POST(createRequest(invalidData));
				const data = await response.json();

				expect(data).toEqual({ error: "Missing required fields." });
				expect(response.status).toBe(400);
				expect(mockSave).not.toHaveBeenCalled();
			}
		});

		it("should handle save errors", async () => {
			const newAnnouncement = {
				title: "New Announcement",
				message: "This is a new announcement",
				name: "Admin",
			};

			mockSave.mockRejectedValue(new Error("Save failed"));

			const response = await POST(createRequest(newAnnouncement));
			const data = await response.json();

			expect(data).toEqual({ error: "Failed to save announcement." });
			expect(response.status).toBe(500);
		});

		it("should handle JSON parsing errors", async () => {
			const invalidRequest = {
				json: async () => {
					throw new Error("Invalid JSON");
				},
			} as unknown as Request;

			const response = await POST(invalidRequest);
			const data = await response.json();

			expect(data).toEqual({ error: "Failed to save announcement." });
			expect(response.status).toBe(500);
		});
	});

	describe("Database connection", () => {
		it("should connect when not connected", async () => {
			(mongoose.connection.readyState as any) = 0;
			mockSort.mockResolvedValue([]);

			await GET();

			expect(mongoose.connect).toHaveBeenCalledWith(
				"mongodb://test:27017/test",
				{ dbName: "stored_announcements" }
			);
		});

		it("should not reconnect when already connected", async () => {
			(mongoose.connection.readyState as any) = 1;
			mockSort.mockResolvedValue([]);

			await GET();

			expect(mongoose.connect).not.toHaveBeenCalled();
		});

		it("should handle connection errors", async () => {
			(mongoose.connection.readyState as any) = 0;
			(mongoose.connect as jest.Mock).mockRejectedValue(new Error("Connection failed"));

			const response = await GET();
			const data = await response.json();

			expect(data).toEqual({ error: "Failed to fetch announcements" });
			expect(response.status).toBe(500);
		});
	});
}); 