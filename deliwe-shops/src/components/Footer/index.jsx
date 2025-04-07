import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 py-10 mt-16">
            <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* 1️⃣ Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold text-amber-500 mb-3">Luxury Beauty</h2>
                    <p className="text-sm">
                        Your trusted destination for premium skincare, cosmetics, and jewelry.
                    </p>
                </div>

                {/* 2️⃣ Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/shop" className="hover:text-amber-500">Shop</Link></li>
                        <li><Link to="/about" className="hover:text-amber-500">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-amber-500">Contact</Link></li>
                        <li><Link to="/faq" className="hover:text-amber-500">FAQs</Link></li>
                    </ul>
                </div>

                {/* 3️⃣ Contact Information */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                    <p>Email: support@luxurybeauty.com</p>
                    <p>Phone: +265 991 10 35 78</p>
                    <p>Location: Matawale, Zomba</p>
                </div>

                {/* 4️⃣ Newsletter Signup */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Newsletter</h3>
                    <p className="text-sm mb-3">Subscribe to get the latest updates and exclusive deals.</p>
                    <form className="flex items-center bg-gray-800 rounded-md">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 rounded-l-md focus:outline-none text-gray-900 bg-gray-100 placeholder-gray-600"
                        />
                        <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-md">
                            <Mail className="text-white" size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 border-t border-gray-800 pt-5 flex flex-col md:flex-row justify-between items-center text-sm">
                <p>&copy; {new Date().getFullYear()} Luxury Beauty. All Rights Reserved.</p>

                {/* Social Media Icons */}
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-amber-500"><Facebook size={18} /></a>
                    <a href="#" className="hover:text-amber-500"><Instagram size={18} /></a>
                    <a href="#" className="hover:text-amber-500"><Twitter size={18} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
