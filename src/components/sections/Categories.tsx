import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/database";
import { getOptimizedCloudinaryUrl } from "@/lib/cloudinary";

const Categories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				// Load categories
				const { data: categoriesData, error: categoriesError } = await supabase
					.from('categories')
					.select('*')
					.order('name', { ascending: true });

				if (categoriesError) {
					console.error('Error loading categories:', categoriesError);
					setCategories([]);
					setLoading(false);
					return;
				}

				setCategories(categoriesData || []);

				// Load product counts for each category
				if (categoriesData && categoriesData.length > 0) {
					const counts: Record<string, number> = {};
					
					for (const category of categoriesData) {
						const { count, error: countError } = await supabase
							.from('products')
							.select('*', { count: 'exact', head: true })
							.eq('category', category.name);

						if (!countError) {
							counts[category.name] = count || 0;
						}
					}

					setCategoryCounts(counts);
				}
			} catch (error) {
				console.error('Error loading categories:', error);
				setCategories([]);
			} finally {
				setLoading(false);
			}
		};

		loadCategories();
	}, []);
  return (
    <section className="py-24 md:py-32 bg-charcoal">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Browse</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold-muted transition-colors group"
          >
            View All Categories
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        {/* Categories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 bg-card rounded-sm animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const productCount = categoryCounts[category.name] || 0;
              const imageUrl = category.image_url 
                ? getOptimizedCloudinaryUrl(category.image_url, { width: 400, height: 400, crop: 'fill' })
                : null;

              return (
                <Link
                  key={category.id}
                  to={`/collections/${category.name.toLowerCase()}`}
                  className="group relative h-64 overflow-hidden rounded-sm opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  {/* Background Image or Gradient */}
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/60 to-charcoal-deep/80" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal-deep" />
                  )}
                  
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <div className="flex justify-end">
                      <div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center group-hover:bg-cream group-hover:border-cream transition-all duration-300">
                        <ArrowUpRight className="h-5 w-5 text-cream group-hover:text-charcoal-deep transition-colors duration-300" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-cream/60 mb-1">{productCount} Products</p>
                      <h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors duration-300">
                        {category.name}
                      </h3>
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
  );
};

export default Categories;
