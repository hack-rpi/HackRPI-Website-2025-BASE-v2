import React, { useState, useEffect } from "react";
function ProgressBar() {
    const [scrollTop, setScrollTop] = useState(0);

    const scroll = () => {
        const currentScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const amountScrolled =  (currentScroll / height) * 100
        setScrollTop(amountScrolled);
    }
    useEffect(() => {
        window.addEventListener("scroll", scroll);
    
        // 
        return () => window.removeEventListener("scroll", scroll);
      }, []);
    return(
        <div id = "progress-container" style = {{height:"4px", width: `${scrollTop}%`, backgroundColor:"transparent", position: "fixed", top: "0", left: "0", right: "0", zIndex:9999}}>
            <div className = "progress-fill bg-gradient-to-r from-hackrpi-light-purple to-hackrpi-pink" style = {{height: "100%", width: `${scrollTop}%`}}></div>
        </div>
    )
}

export default ProgressBar