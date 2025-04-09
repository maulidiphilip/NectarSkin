import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, User, Menu, X, ShoppingBagIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/store/Auth-slice";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false);
  };

  const isAdmin = role === "admin";
  const isLoggedIn = !!user;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold text-primary">
          Luxury Beauty
        </Link>

        {/* Desktop Search (Non-Admin Only) */}
        {!isAdmin && (
          <div className="hidden md:flex items-center gap-2">
            <Input placeholder="Search products..." className="w-64" />
            <Button variant="outline">Search</Button>
          </div>
        )}

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <User size={24} /> Dashboard
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700"
              >
                <LogOut size={24} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/shop">
                <ShoppingBagIcon size={24} />
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart size={24} />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                  2
                </span>
              </Link>
              <Link to={isLoggedIn ? "/user/dashboard" : "/auth"}>
                <User size={24} />
              </Link>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-amber-600 hover:text-amber-700"
                >
                  <LogOut size={24} />
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-4 md:hidden">
          <Link to="/" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} /> Dashboard
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 w-full justify-start"
              >
                <LogOut size={20} /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/shop"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingBagIcon size={20} /> Shop
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <ShoppingCart size={20} /> Cart
              </Link>
              <Link
                to={isLoggedIn ? "/user/dashboard" : "/auth"}
                className="flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={20} /> {isLoggedIn ? "Dashboard" : "Profile"}
              </Link>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-amber-600 hover:text-amber-700 w-full justify-start"
                >
                  <LogOut size={20} /> Logout
                </Button>
              )}
              <Input placeholder="Search..." className="w-full" />
              <Button variant="outline" className="w-full">
                Search
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}