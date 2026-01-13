import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Collection } from "@/types/database";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const Collections = () => {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [collectionCounts, setCollectionCounts] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadCollections = async () => {
			try {
				// Load collections
				const { data: collectionsData, error: collectionsError } = await supabase
					.from('collections')
					.select('*')
					.order('name', { ascending: true });

				if (collectionsError) {
					console.error('Error loading collections:', collectionsError);
					setCollections([]);
					setLoading(false);
					return;
				}

				setCollections(collectionsData || []);

				// Load product counts for each collection
				if (collectionsData && collectionsData.length > 0) {
					const counts: Record<string, number> = {};
					
					for (const collection of collectionsData) {
						const { count, error: countError } = await supabase
							.from('products')
							.select('*', { count: 'exact', head: true })
							.eq('collection', collection.name);

						if (!countError) {
							counts[collection.name] = count || 0;
						}
					}

					setCollectionCounts(counts);
				}
			} catch (error) {
				console.error('Error loading collections:', error);
				setCollections([]);
			} finally {
				setLoading(false);
			}
		};

		loadCollections();
	}, []);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="text-center space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-gold">
                Curated Collections
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Our Collections
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Explore our carefully curated collections, each designed with a distinct vision and uncompromising quality.
              </p>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-[500px] bg-card rounded-sm animate-pulse"
                  />
                ))}
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No collections available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {collections.map((collection, index) => {
                  const productCount = collectionCounts[collection.name] || 0;
                  
                  return (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.name.toLowerCase()}`}
                      className="group relative h-[500px] overflow-hidden rounded-sm opacity-0 animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                    >
                      {/* Background Image or Gradient */}
                      <div className="absolute inset-0">
                        {collection.image_url ? (
                          <>
                            <img
                              src={getOptimizedCloudinaryUrl(collection.image_url, {
                                width: 800,
                                height: 800,
                                crop: 'fill',
                                quality: 'auto',
                              })}
                              alt={collection.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/60 to-charcoal-deep/80" />
                          </>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal-deep" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
                        <div className="flex justify-end">
                          <div className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center group-hover:bg-cream group-hover:border-cream transition-all duration-300">
                            <ArrowRight className="h-6 w-6 text-cream group-hover:text-charcoal-deep transition-colors duration-300" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-sm text-cream/60">
                            {productCount} Product{productCount !== 1 ? 's' : ''}
                          </p>
                          <h2 className="text-3xl md:text-4xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
                            {collection.name}
                          </h2>
                          {collection.description && (
                            <p className="text-cream/80 max-w-md">
                              {collection.description}
                            </p>
                          )}
                          <Button
                            variant="hero-outline"
                            className="mt-4 border-cream/40 text-cream hover:bg-cream hover:text-charcoal-deep"
                            asChild
                          >
                            <span>Explore Collection</span>
                          </Button>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;

