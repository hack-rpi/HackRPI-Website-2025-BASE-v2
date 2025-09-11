import NextImage from "next/image";
import logo from "@/public/F25HackrpiLogo.png";

export default function InteractiveNavigationMap() {
	return (
    <NextImage src={logo} alt="HackRPI Logo" className="h-3/4 object-contain" />
	);
}
