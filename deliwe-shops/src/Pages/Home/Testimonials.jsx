import React from "react";
import Slider from "react-slick";
import { Star } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  { id: 1, name: "Jane Doe", review: "Absolutely love the products! The quality is top-notch!", rating: 5 },
  { id: 2, name: "John Smith", review: "Best skincare products I've ever used. Fast delivery!", rating: 4 },
  { id: 3, name: "Sarah Lee", review: "The necklace was exactly as shown in the pictures. Beautiful!", rating: 5 },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    appendDots: dots => (
      <div style={{ bottom: "-40px" }}>
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="dot-custom"></div>
    )
  };

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">💬 Customer Testimonials</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hear what our satisfied customers have to say about their experience
        </p>
      </div>
      
      <Slider {...settings} className="w-full md:w-3/4 lg:w-2/3 mx-auto">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <p className="text-gray-700 italic text-lg leading-relaxed mb-6">
                "{testimonial.review}"
              </p>
              <div className="flex justify-center space-x-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <h3 className="mt-2 text-xl font-semibold text-gray-800">{testimonial.name}</h3>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .slick-dots li button:before {
          color: #6366f1;
          opacity: 0.5;
          font-size: 10px;
        }
        .slick-dots li.slick-active button:before {
          color: #6366f1;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;