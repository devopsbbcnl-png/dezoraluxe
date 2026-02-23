import { useEffect } from "react";
import Navbar from "@/components/layout/NavBar";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Footer from "@/components/layout/Footer";
import { trackAnalyticsEvent } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackAnalyticsEvent({
      eventName: "visit",
      metadata: { page: "home" },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
