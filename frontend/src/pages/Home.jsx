import { Link } from "react-router-dom";
import wordLogo from "../assets/wordLogo.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col justify-between">
      
      {/* 1. Official Sac State Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={wordLogo} alt="Sacramento State Logo" className="h-10 object-contain" />
            <div className="border-l border-gray-300 pl-3">
              <span className="text-xl font-bold tracking-tight text-[#046A38] uppercase">
                SACRAMENTO STATE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[#046A38] font-semibold text-sm">
            <button className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
              <span>MENU</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button className="hover:opacity-80 transition cursor-pointer" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Banner Overlay */}
      <section 
        className="relative w-full h-[260px] md:h-[320px] bg-slate-800 bg-cover bg-center flex items-center" 
        style={{ backgroundImage: "url('/src/assets/loginBackground.jpg')" }}
      >
        <div className="absolute inset-0 bg-emerald-950/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-white space-y-1">
          <p className="text-lg md:text-xl font-light text-emerald-200">Division Of</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            Information Resources & Technology
          </h1>
          <p className="text-xl md:text-2xl font-normal text-emerald-100 pt-1">
            Sacramento State
          </p>
        </div>
      </section>

      {/* 3. Black Breadcrumb Navigation Bar */}
      <div className="bg-black py-3 px-8 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-white">
          <span className="text-[#FFC72C] font-semibold">Information Resources & Technology</span>
          <span className="text-gray-400">➤</span>
          <span className="text-[#FFC72C] font-semibold">Bin Tracker Portal</span>
        </div>
      </div>

      {/* Expanded Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full space-y-12">
        
        {/* Main Section Header */}
        <div>
            <h2 className="text-4xl md:text-5xl font-light text-[#004E38] tracking-tight mb-8">
            Bin Tracker & Campus Portal
            </h2>

            {/* Expanded Gold Border Navigation Links */}
            <div className="border-l-4 border-[#C49A45] pl-8 py-3 space-y-6 w-full bg-slate-50/60 rounded-r-xl shadow-sm">
            <div className="border-b border-amber-200/80 pb-4">
                <Link 
                to="/login" 
                className="text-xl md:text-2xl font-semibold text-[#004E38] hover:underline flex items-center justify-between tracking-tight pr-4"
                >
                Bin Tracker Dashboard
                <span className="text-sm text-emerald-700 font-medium">Access Maps & Bins →</span>
                </Link>
            </div>

            <div className="border-b border-amber-200/80 pb-4">
                <a 
                href="https://csus.instructure.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl md:text-2xl font-semibold text-[#004E38] hover:underline flex items-center justify-between tracking-tight pr-4"
                >
                Sac State Canvas Portal
                <span className="text-sm text-emerald-700 font-medium">External ↗</span>
                </a>
            </div>

            <div className="border-b border-amber-200/80 pb-4">
                <a 
                href="https://www.csus.edu/information-resources-technology/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl md:text-2xl font-semibold text-[#004E38] hover:underline flex items-center justify-between tracking-tight pr-4"
                >
                IRT Tech Resources
                <span className="text-sm text-emerald-700 font-medium">Get Support ↗</span>
                </a>
            </div>

            <div className="pb-1">
                <a 
                href="https://www.csus.edu/campusmap/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl md:text-2xl font-semibold text-[#004E38] hover:underline tracking-tight"
                >
                Campus Map & Facilities
                </a>
            </div>
            </div>
        </div>

        {/* Description & Action Button */}
        <div className="space-y-6 w-full pt-4">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#004E38]">
            The Home Base for Every Hornet Bin Location
            </h3>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg max-w-4xl">
            The Bin Tracker portal is the official real-time monitoring dashboard where campus facility staff and students can check waste bin fill status, track sensor health, and manage maintenance logs across Sacramento State.
            </p>

            <div className="pt-4">
            <Link
                to="/login"
                className="inline-block px-140 py-4 bg-white border-2 border-[#004E38] text-[#004E38] hover:bg-[#004E38] hover:text-white font-bold text-base rounded-lg shadow-sm transition duration-200 text-center"
            >
                Log in to Bin Tracker Portal
            </Link>
            </div>
        </div>

        </main>

      {/* 5. Clean Sac State Footer */}
      <footer className="bg-slate-100 border-t border-gray-200 py-6 text-center text-xs text-gray-600">
        <p>© {new Date().getFullYear()} California State University, Sacramento — Division of Information Resources & Technology</p>
      </footer>
    </div>
  );
}