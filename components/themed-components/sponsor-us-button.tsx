import HackRPILink from "./hackrpi-link";

export default function SponsorUSButton({ className }: { className?: string }) {
	return (
		<HackRPILink
			href="/sponsor-us"
			className={`${className} pl-2 pr-5 py-2`}
		>
			Sponsor us!
		</HackRPILink>
	);
}
