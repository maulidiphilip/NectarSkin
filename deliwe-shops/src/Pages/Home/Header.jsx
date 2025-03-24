import { Link } from "react-router-dom";
import bannerIMG from "../../assets/header.png";

const Header = () => {
  return (
    <div className="max-w-screen mx-auto px-6 pt-16 pb-10 bg-[#FAF5EF] rounded-bl-3xl rounded-br-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Section - Text */}
        <div className="max-w-[600px]">
          <h4 className="text-sm uppercase font-medium text-amber-600 tracking-wider">
            Indulge in Self-Care
          </h4>
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-gray-900 mt-3 leading-tight">
            Glow with Confidence, <br /> Shine with Elegance
          </h1>
          <p className="text-gray-700 mt-5 mb-6 leading-relaxed">
            Treat yourself to the finest <strong>cosmetics, skincare, body care, and jewelry</strong>.  
            Feel luxurious every day with products designed to enhance your natural beauty.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Right Section - Image */}
        <div className="relative h-full flex justify-center">
          <img
            src={bannerIMG}
            alt="Banner"
            className="max-w-[420px] md:max-w-[500px] w-full drop-shadow-lg"
          />
        </div>

      </div>
    </div>
  );
};

export default Header;
