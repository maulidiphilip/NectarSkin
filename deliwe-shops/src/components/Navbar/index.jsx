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
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const { user, role } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
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

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setMenuOpen(false); // Close mobile menu if open
      setSearchQuery(""); // Clear input after search
    }
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isAdmin = role === "admin";
  const isLoggedIn = !!user;
  const cartItemCount = items.length;

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

        {!isAdmin && (
          <div className="hidden md:flex items-center gap-2">
            <Input
              placeholder="Search products..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="outline" onClick={handleSearch}>
              Search
            </Button>
          </div>
        )}

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
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {cartItemCount}
                  </span>
                )}
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

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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
                <ShoppingCart size={20} /> Cart {cartItemCount > 0 && `(${cartItemCount})`}
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
              <Input
                placeholder="Search..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="outline" className="w-full" onClick={handleSearch}>
                Search
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}