import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductSection from "../components/ProductSection";
import Banner from "../components/Banner";
import SmBanner from "../components/SmBanner";
import Banner3 from "../components/Banner3";
import Newsletter from "../components/Newsletter";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../services/constants";

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products`);
                const data = response.data;

                console.log("✅ Raw API Response:", response);
                console.log("✅ Products Fetched:", data);

                setFeaturedProducts(data.filter((p) => p.type === "Featured"));
                setNewArrivals(data.filter((p) => p.type === "New Arrival"));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }


    return (
        <div>
            <Hero />
            <div className="mt-12">
                {" "}
                {/* Add space between Hero and Features */}
                <Features />
            </div>
            <div className="mt-12">
                {" "}
                {/* Add space between Features and ProductSection */}
                <ProductSection
                    title="Featured Products"
                    subtitle="Summer Collection new Modern Design"
                    products={featuredProducts}
                />
            </div>
            <div className="mt-12">
                {" "}
                {/* Add space between ProductSection and Banner */}
                <Banner
                    title="Up to 70% Off All T-shirts & Accessories"
                    buttonText="Explore More"
                />
            </div>
            <div className="mt-12">
                {" "}
                {/* Add space between Banner and next ProductSection */}
                <ProductSection
                    title="New Arrivals"
                    subtitle="Summer Collection new Modern Design"
                    products={newArrivals}
                />
            </div>
            <SmBanner />
            <Banner3 />
            <Newsletter />
        </div>
    );
}
