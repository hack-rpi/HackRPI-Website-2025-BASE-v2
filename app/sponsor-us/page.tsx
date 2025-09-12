"use client";

import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import NavBar from "@/components/nav-bar/nav-bar";
import HackRPILink from "@/components/themed-components/hackrpi-link";

function SponsorUsPage() {

  const [showNav, setShowNav] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  /*const [isDarkMode, setIsDarkMode] = useState(
    typeof window !== "undefined" &&
      (localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)),
  );*/

  const navHeight = 96;

  // Add event listener to the window to update the scrollY state
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    const scrollThreshold = window.innerHeight - navHeight;
    setWindowWidth(window.innerWidth);
    const handleScroll = () => {
      setShowNav(window.scrollY > scrollThreshold);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);  

  let navbarLocalBad = <></>
  if(windowWidth >= 860) {
    navbarLocalBad = <NavBar showOnScroll={false} />;
  }
  
    
	return (
		<div className="w-full min-h-screen h-fit flex flex-col items-center">
			{navbarLocalBad}
			<div className="w-11/12 flex-grow flex-shrink basis-auto flex flex-col items-start justify-center pt-24 desktop:pt-16  mb-4">
				<div className="flex w-full flex-wrap mb-2 items-center justify-center">
					<div className="flex flex-col items-center justify-start w-5/6 md:w-1/2 min-w-[350px] mb-2">
						<h1 className="text-4xl font-pix font-bold text-center mb-2">Last Year:</h1>
						<iframe
							className="w-5/6 md:w-4/6 aspect-[8.5/11] mx-auto"
							src="https://drive.google.com/file/d/1n0A94WUZPzI5g1w46pR1VZ4bSXKOiFsy/preview"
							allow="autoplay"
							sandbox="allow-scripts allow-same-origin allow-popups"
						></iframe>
					</div>
					<div className="flex flex-col items-center justify-center w-5/6 md:w-1/2 min-w-[350px] mb-2">
						<h1 className="text-4xl font-bold font-pix text-center mb-2">This Year We Need Your Help: </h1>
						<iframe
							className="w-5/6 md:w-4/6 aspect-[8.5/11]"
							src="https://drive.google.com/file/d/1zKz7PLdIPuz4yya3JvIVm7q_yng9pcoy/preview"
							allow="autoplay"
							sandbox="allow-scripts allow-same-origin allow-popups"
						></iframe>
					</div>
				</div>
				<div className="w-full flex flex-wrap items-center justify-center">
					<div className="flex flex-col items-center justify-start w-1/2 min-w-[350px]">
						<h1 className="text-4xl font-pix font-bold text-center">Alumni Interested in </h1>
						<h1 className="text-4xl font-pix font-bold text-center">Supporting HackRPI: </h1>
						<HackRPILink
							className="w-5/6 md:w-1/2 text-nowrap text-center text-2xl my-4"
							href="https://tinyurl.com/hackrpi-donation"
							target="_blank"
						>
							Donate Here!
						</HackRPILink>
					</div>
					<div className="flex flex-col items-center justify-start w-1/2 min-w-[350px]">
						<h1 className="text-4xl font-pix font-bold text-center">Companies Interested in Sponsoring HackRPI: </h1>
						<HackRPILink className="w-5/6 md:w-1/2 text-nowrap text-center text-2xl my-4" href="mailto:hackrpi@rpi.edu">
							Email Us! 📧
						</HackRPILink>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SponsorUsPage;
