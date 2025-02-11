import xenia from "../public/team/photos/joerogansauna.jpg";
import cj from "../public/team/photos/joerogansauna.jpg";
import matthew from "../public/team/photos/joerogansauna.jpg";
import shankar from "../public/team/photos/joerogansauna.jpg";
import aaryan from "../public/team/photos/joerogansauna.jpg";
import tobias from "../public/team/photos/joerogansauna.jpg";
import jackson from "../public/team/photos/joerogansauna.jpg";
import suyash from "../public/team/photos/joerogansauna.jpg";

export const executive = {
	"Xenia Khusid": xenia,
	"CJ Marino": cj,
	"Matthew Treanor": matthew,
	"Shankar Gowrisankar": shankar,
	"Aaryan Gautam": aaryan,
	"Tobias Manayath": tobias,
	"Jackson Baimel": jackson,
	"Suyash Amatya": suyash,
};

export const teamColors = {
	president: { bg: "#303ECF", text: "#ffffff" },
	vicePresident: { bg: "#a12022", text: "#ffffff" },
	Technology: { bg: "#773E8E", text: "#ffffff" },
	Logistics: { bg: "#0185A2", text: "#ffffff" },
	Marketing: { bg: "#E17619", text: "#ffffff" },
	Outreach: { bg: "#DF0C32", text: "#ffffff" },
	Finance: { bg: "#1E8549", text: "#ffffff" },
	Sponsorship: { bg: "#0057A8", text: "#ffffff" },
};

export interface Director {
	name:
		| "Xenia Khusid"
		| "CJ Marino"
		| "Matthew Treanor"
		| "Shankar Gowrisankar"
		| "Aaryan Gautam"
		| "Tobias Manayath"
		| "Jackson Baimel"
		| "Suyash Amatya";
	role: string;
	image: string;
	"team-color": TeamColor;
	teamDescription: string;
}

export interface Organizer {
	name: string;
	team: "Technology" | "Logistics" | "Marketing" | "Outreach" | "Finance" | "Sponsorship";
}

export interface TeamColor {
	bg: string;
	text: string;
}

export interface Team {
	directors: Director[];
	organizers: Organizer[];
}

export const team: Team = {
	directors: [
		{
			name: "Xenia Khusid",
			role: "President",
			image: "../public/team/photos/joerogansauna.jpg",
			"team-color": teamColors.president,
			teamDescription:
				"The President leads the overall planning and execution of the hackathon, coordinating with all teams to ensure a successful event.",
		},
		{
			name: "CJ Marino",
			role: "Vice President",
			image: "/team/photos/Adwait_Naware.jpg",
			"team-color": teamColors.vicePresident,
			teamDescription:
				"The Vice President supports the President's role, providing leadership and assistance in many aspects of the hackathon.",
		},
		{
			name: "Matthew Treanor",
			role: "Director of Outreach",
			image: "/team/photos/Vickie_Chen.jpg",
			"team-color": teamColors.Outreach,
			teamDescription:
				"The Outreach team is responsible for engaging with the community and local students to promote the hackathon and encourage participation.",
		},
		{
			name: "Shankar Gowrisankar",
			role: "Director of Finance",
			image: "/team/photos/Grace_Hui.jpg",
			"team-color": teamColors.Finance,
			teamDescription:
				"The Finance team is responsible for managing the budget and purchasing necessary items for the hackathon.",
		},
		{
			name: "Aaryan Gautam",
			role: "Director of Sponsorship",
			image: "/team/photos/Heman_Kolla.jpg",
			"team-color": teamColors.Sponsorship,
			teamDescription:
				"The Sponsorship team is responsible for reaching out to companies and securing sponsorships to support the hackathon.",
		},
		{
			name: "Tobias Manayath",
			role: "Director of Logistics",
			image: "/team/photos/CJ_Marino.jpg",
			"team-color": teamColors.Logistics,
			teamDescription:
				"The Logistics team is responsible for planning and executing the physical aspects of the hackathon, such as food, swag, transportation, and more.",
		},
		{
			name: "Jackson Baimel",
			role: "Director of Technology",
			image: "/team/photos/Cooper_Werner.jpg",
			"team-color": teamColors.Technology,
			teamDescription:
				"The Technology team is responsible for developing and maintaining the hackathon website, discord server, and providing technical support during the event.",
		},
		{
			name: "Suyash Amatya",
			role: "Director of Marketing",
			image: "/team/photos/Miranda_Zheng.jpg",
			"team-color": teamColors.Marketing,
			teamDescription:
				"The Marketing team is responsible for promoting the hackathon and engaging with participants through social media, fliers, and other marketing materials.",
		}
	],
	organizers: [
		{
			name: "Iain",
			team: "Sponsorship",
		},
		{
			name: "Brian Witanowski",
			team: "Sponsorship",
		},
		{
			name: "Jackson Baimel",
			team: "Sponsorship",
		},
		{
			name: "Christian Marinkovich",
			team: "Technology",
		},
		{
			name: "Peter Ermishkin",
			team: "Sponsorship",
		},
		{
			name: "Anthony Smith",
			team: "Technology",
		},
		{
			name: "Devan Patel",
			team: "Finance",
		},
		{
			name: "Tobias Manayath",
			team: "Logistics",
		},
		{
			name: "Matthew Treanor",
			team: "Technology",
		},
		{
			name: "Olivia Lee",
			team: "Marketing",
		},
		{
			name: "Mrunal Athaley",
			team: "Sponsorship",
		},
		{
			name: "Evan Chen",
			team: "Logistics",
		},
		{ name: "Amanda Ruan", team: "Marketing" },
	],
};
