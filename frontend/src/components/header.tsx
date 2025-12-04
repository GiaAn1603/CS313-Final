import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CitySearch } from "./city-search";
import { Navbar } from "./navbar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-1000 w-full border-b py-2 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"}>
          <img src="/Aero-logo.svg" alt="Web logo" className="h-16 w-40 object-cover" />
        </Link>

        <div className="hidden gap-4 md:flex">
          <Navbar />
          <CitySearch />
          <ThemeToggle />
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 border-t px-4 py-3 md:hidden">
          <Navbar />
          <div className="flex items-center justify-between gap-10">
            <CitySearch />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
