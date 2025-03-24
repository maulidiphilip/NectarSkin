import React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import serum from "../../assets/card-2.png";
import lipstick from "../../assets/card-3.png";
import jewelry1 from "../../assets/card-1.png";

const deals = [
    {
        id: 1,
        name: "Luxury Gold Necklace",
        price: 129.99,
        oldPrice: 159.99,
        image: jewelry1,
    },
    {
        id: 2,
        name: "Hydrating Face Serum",
        price: 49.99,
        oldPrice: 69.99,
        image: serum,
    },
    {
        id: 3,
        name: "Velvet Matte Lipstick",
        price: 14.99,
        oldPrice: 24.99,
        image: lipstick,
    },
];

const Deals = () => {
    return (
        <section className="max-w-screen-xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">🔥 Deals of the Day</h2>
                <div className="flex items-center text-red-600">
                    <Clock className="mr-2" /> <span>Limited Time Offer!</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {deals.map((deal) => (
                    <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                        <img src={deal.image} alt={deal.name} className="w-full h-56 object-cover" />
                        <h3 className="text-lg font-semibold mt-3">{deal.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-amber-600 font-bold text-xl">MWK{deal.price}</span>
                            <span className="text-gray-500 line-through">MWK{deal.oldPrice}</span>
                        </div>
                        <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700">Grab Deal</Button>
                    </div>
                ))}
            </div>

            {/* Shop More Button */}
            <div className="text-center mt-10">
                <Link to="/shop">
                    <Button className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 text-lg">
                        Shop More Deals
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default Deals;
