import HackRPILink from "./hackrpi-link";

export default function DonateNowButton({ className }: { className?: string }) {
	return (
		<HackRPILink
			href="https://securelb.imodules.com/s/1225/lg22/form.aspx?sid=1225&gid=1&pgid=6795&cid=15861&dids=257&bledit=1&sort=1"
			className={`${className} pl-2 pr-5 py-2`}
      target="_blank"
		>
			Give Now
		</HackRPILink>
	);
}
