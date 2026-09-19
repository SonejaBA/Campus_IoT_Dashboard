import { useState } from 'react'
import treeLogo from "../assets/treeLogo.png";
import wordLogo from "../assets/wordLogo.png";
import { PanelLeftClose } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapPin, BarChart3, Settings, Wrench  } from 'lucide-react';


function Sidebar(){

    const [isOpen, setIsOpen] = useState(true)
    const handleLogoClick = () =>{
        if (isOpen) return;
        setIsOpen(!isOpen);
    }

    return (
        //flex and flex-col required for vertical gaps
        <div className={`
        hidden 
        md:flex
        flex-col
        h-full
        bg-[#1E1E1E] 
        text-white 
        p-6
        gap-4
        ${isOpen ? "w-80" : "w-28"}
        transition-all
        duration-200
        `}> 
            {/*Logo and sidebar colapase button */}
            <div className={`flex flex-row  mb-6 ${isOpen ? "justify-between" : "justify-center px-0"}`}>
                <img
                    onClick={handleLogoClick}
                    src={isOpen ? wordLogo : treeLogo}
                    alt='Sacramento State Sustainability'
                    title="Open sidebar"
                    className={`
                        w-auto
                        object-contain
                        cursor-pointer
                        ${isOpen ? "h-20 cursor-default pointer-events-none" : "h-10 justify-center "}`}/>

                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    title="Close sidebar"
                    className={`${isOpen ? "block" : "hidden"} cursor-pointer
                    text-[#F2F2F3] aria-label="Collapse Sidebar"`}>
                        <PanelLeftClose className="w-5 h-5 " />
                </button>
            </div>
            
            <nav className='flex-1 flex-col gap-2 px-1'>
                <Link
                    to="/"
                    className={`flex items-center py-2 rounded-lg hover:bg-emerald-900/50 transition-colors text-white ${isOpen ? "justify-start gap-4" : "justify-center px-0"}`}>

                        <MapPin className="shrink-0"/>
                        <span className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap`}>
                            Dashboard
                        </span>
                </Link>

                <Link
                    to="/analytics"
                    className={`flex items-center py-2 rounded-lg hover:bg-emerald-900/50 transition-colors text-white ${isOpen ? "justify-start gap-4" : "justify-center px-0"}`}>

                        <BarChart3 className="shrink-0"/>
                        <span className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap`}>
                            Analytics
                        </span>
                </Link>
                
                <Link
                    to="/maintenance"
                    className={`flex items-center py-2 rounded-lg hover:bg-emerald-900/50 transition-colors text-white ${isOpen ? "justify-start gap-4" : "justify-center px-0"}`}>

                        <Wrench className="shrink-0"/>
                        <span className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap`}>
                            Maintenance
                        </span>
                </Link>
                       
                <Link
                    to="/settings"
                    className={`flex items-center py-2 rounded-lg hover:bg-emerald-900/50 transition-colors text-white ${isOpen ? "justify-start gap-4" : "justify-center px-0"}`}>

                        <Settings className="shrink-0"/>
                        <span className={`${isOpen ? "block" : "hidden"} font-medium whitespace-nowrap`}>
                            Settings
                        </span>
                </Link>

            </nav> 
        </div>
    )
}

export default Sidebar;