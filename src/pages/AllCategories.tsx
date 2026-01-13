import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/database';
import { getOptimizedCloudinaryUrl } from '@/lib/cloudinary';

const AllCategories = () => {
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
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="pt-20">
				{/* Hero Section */}
				<section className="py-16 md:py-24 border-b border-border">
					<div className="container mx-auto px-6">
						<div className="text-center space-y-4">
							<p className="text-sm uppercase tracking-[0.3em] text-gold">
								Browse All
							</p>
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
								All Categories
							</h1>
							<p className="text-muted-foreground max-w-md mx-auto">
								Explore our complete range of premium categories, each curated with
								uncompromising quality and style.
							</p>
						</div>
					</div>
				</section>

				{/* Categories Grid */}
				<section className="py-16 md:py-32 bg-charcoal">
					<div className="container mx-auto px-6">
						{loading ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
								{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
									<div
										key={i}
										className="h-80 bg-card rounded-sm animate-pulse"
									/>
								))}
							</div>
						) : categories.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">No categories available</p>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
								{categories.map((category, index) => {
									const productCount = categoryCounts[category.name] || 0;
									const imageUrl = category.image_url 
										? getOptimizedCloudinaryUrl(category.image_url, { width: 400, height: 400, crop: 'fill' })
										: null;

									return (
										<Link
											key={category.id}
											to={`/collections/${category.name.toLowerCase()}`}
											className="group relative h-80 overflow-hidden rounded-sm opacity-0 animate-fade-up"
											style={{
												animationDelay: `${index * 100}ms`,
												animationFillMode: 'forwards',
											}}
										>
											{/* Background Image or Gradient */}
											<div className="absolute inset-0">
												{imageUrl ? (
													<>
														<img
															src={imageUrl}
															alt={category.name}
															className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
														/>
														<div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/60 to-charcoal-deep/80" />
													</>
												) : (
													<div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 to-charcoal-deep" />
												)}
											</div>

											{/* Content */}
											<div className="relative h-full flex flex-col justify-between p-6">
												<div className="flex justify-end">
													<div className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center group-hover:bg-cream group-hover:border-cream transition-all duration-300">
														<ArrowUpRight className="h-5 w-5 text-cream group-hover:text-charcoal-deep transition-colors duration-300" />
													</div>
												</div>

												<div>
													<p className="text-sm text-cream/60 mb-1">
														{productCount} Product{productCount !== 1 ? 's' : ''}
													</p>
													<h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors duration-300 mb-2">
														{category.name}
													</h3>
													{category.description && (
														<p className="text-sm text-cream/80 line-clamp-2">
															{category.description}
														</p>
													)}
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

export default AllCategories;

