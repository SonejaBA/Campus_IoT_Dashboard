import { useState } from 'react'
import treeLogo from "../assets/treeLogo.png";
import wordLogo from "../assets/wordLogo.png";

function Sidebar(){

    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        //flex and flex-col required for vertical gaps
        <div className="
        hidden 
        md:flex
        flex-col
        h-full
        w-90
        bg-[#262626] 
        text-white 
        p-6
        gap-4
        ">
            <img
                src={wordLogo}
                alt='Sacramento State Sustainability'
                className="h-32 w-auto object-contain object-[-20%_center]">
                      
            </img>

            <p className="text-emerald-400 text-xl">
                Coming soon.
            </p>
        </div>
    )
}

export default Sidebar;