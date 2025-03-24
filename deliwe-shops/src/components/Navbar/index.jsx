import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detect scroll to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Luxury Beauty
        </Link>

        {/* Desktop Search Bar - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-2">
          <Input placeholder="Search products..." className="w-64" />
          <Button variant="outline">Search</Button>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">2</span>
          </Link>
          <Link to="/profile">
            <User size={24} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-4 md:hidden">
          <Link to="/" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/cart" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={20} /> Cart
          </Link>
          <Link to="/profile" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <User size={20} /> Profile
          </Link>
          <Input placeholder="Search..." className="w-full" />
          <Button variant="outline" className="w-full">Search</Button>
        </div>
      )}
    </nav>
  );
}
