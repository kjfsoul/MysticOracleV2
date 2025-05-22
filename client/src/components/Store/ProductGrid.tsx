import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from './types';

// Mock data - in a real implementation, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Mystic Arcana Tarot Deck',
    description: 'Our signature tarot deck featuring stunning original artwork.',
    price: 45.99,
    images: ['/images/products/tarot-deck-1.jpg'],
    category: 'tarot-decks',
    tags: ['tarot', 'deck', 'original'],
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Amethyst Crystal',
    description: 'Natural amethyst crystal for spiritual protection and purification.',
    price: 24.99,
    images: ['/images/products/crystal-1.jpg'],
    category: 'crystals',
    tags: ['crystal', 'amethyst', 'protection'],
    rating: 4.6,
    reviewCount: 89,
    stock: 35
  },
  {
    id: '3',
    name: 'Full Moon Ritual Kit',
    description: 'Complete kit for performing powerful full moon rituals.',
    price: 39.99,
    images: ['/images/products/ritual-kit-1.jpg'],
    category: 'ritual-kits',
    tags: ['ritual', 'moon', 'kit'],
    rating: 4.9,
    reviewCount: 67,
    stock: 20,
    new: true
  },
  {
    id: '4',
    name: 'Zodiac Constellation Necklace',
    description: 'Elegant necklace featuring your zodiac constellation.',
    price: 29.99,
    images: ['/images/products/zodiac-1.jpg'],
    category: 'zodiac-merch',
    tags: ['zodiac', 'jewelry', 'constellation'],
    rating: 4.7,
    reviewCount: 103,
    stock: 45
  },
  {
    id: '5',
    name: 'Tarot Reading Guide',
    description: 'Comprehensive guide to tarot reading for beginners and advanced practitioners.',
    price: 19.99,
    images: ['/images/products/book-1.jpg'],
    category: 'books',
    tags: ['book', 'guide', 'tarot'],
    rating: 4.5,
    reviewCount: 78,
    stock: 60
  },
  {
    id: '6',
    name: 'Celestial Tarot Deck',
    description: 'Tarot deck inspired by celestial bodies and astrological symbols.',
    price: 42.99,
    images: ['/images/products/tarot-deck-2.jpg'],
    category: 'tarot-decks',
    tags: ['tarot', 'deck', 'celestial', 'astrology'],
    rating: 4.7,
    reviewCount: 91,
    stock: 40,
    sale: true,
    salePrice: 35.99
  },
  {
    id: '7',
    name: 'Rose Quartz Crystal',
    description: 'Rose quartz crystal for love, healing, and emotional balance.',
    price: 22.99,
    images: ['/images/products/crystal-2.jpg'],
    category: 'crystals',
    tags: ['crystal', 'rose quartz', 'love'],
    rating: 4.8,
    reviewCount: 112,
    stock: 30
  },
  {
    id: '8',
    name: 'New Moon Manifestation Kit',
    description: 'Kit for setting intentions and manifesting during the new moon.',
    price: 34.99,
    images: ['/images/products/ritual-kit-2.jpg'],
    category: 'ritual-kits',
    tags: ['ritual', 'moon', 'manifestation'],
    rating: 4.6,
    reviewCount: 54,
    stock: 25
  }
];

interface ProductGridProps {
  categoryFilter: string | null;
  searchQuery: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryFilter, searchQuery }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [sortOption, setSortOption] = useState<string>('featured');

  useEffect(() => {
    let filtered = [...mockProducts];
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered.filter(p => p.new).concat(filtered.filter(p => !p.new));
        break;
      case 'featured':
      default:
        filtered = filtered.filter(p => p.featured).concat(filtered.filter(p => !p.featured));
        break;
    }
    
    setFilteredProducts(filtered);
  }, [categoryFilter, searchQuery, sortOption]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      {/* Sort and Filter Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-purple-200">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-purple-200">Sort by:</label>
          <select 
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="bg-purple-800 text-white border border-purple-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      
      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-purple-200">No products found matching your criteria.</p>
          <button 
            onClick={() => {
              setSortOption('featured');
            }}
            className="mt-4 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
