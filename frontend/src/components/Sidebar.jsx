import { useState } from 'react'
import treeLogo from "../assets/treeLogo.png";
import wordLogo from "../assets/wordLogo.png";
import { PanelLeftOpen, PanelLeftClose} from 'lucide-react';

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
        ${isOpen ? "w-80" : "w-25"}
        transition-all
        duration-200
        `}> 
            <div className='flex flex-row justify-between'>
                <img
                    onClick={handleLogoClick}
                    src={isOpen ? wordLogo : treeLogo}
                    alt='Sacramento State Sustainability'
                    className={`
                        w-auto 
                        object-contain 
                        object-[-4%_center] 
                        cursor-pointer
                        ${isOpen ? "h-20 cursor-default pointer-events-none" : "h-10"}`}/>

                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`${isOpen ? "block" : "hidden"} cursor-pointer
                    text-[#F2F2F3] aria-label="Collapse Sidebar"`}>
                        <PanelLeftClose className="w-5 h-5 " />
                </button>
            </div>
            

            <p className="text-[#0F583D] text-xl">
                
            </p>
        </div>
    )
}

export default Sidebar;