import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from './types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      className="bg-gradient-to-b from-purple-800/40 to-indigo-900/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={product.images[0] || '/images/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.new && (
            <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.sale && (
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </span>
          )}
          {product.featured && (
            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </span>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 text-white">{product.name}</h3>
        
        <div className="flex items-center mb-2">
          {/* Star Rating */}
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <span className="text-xs text-purple-300">({product.reviewCount} reviews)</span>
        </div>
        
        <p className="text-sm text-purple-200 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            {product.sale ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-white">${product.salePrice?.toFixed(2)}</span>
                <span className="ml-2 text-sm line-through text-purple-400">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-full bg-purple-700 hover:bg-purple-600 transition-colors"
              aria-label="Add to wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button 
              className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 transition-colors"
              aria-label="Add to cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* View Details Link */}
      <Link 
        to={`/store/product/${product.id}`}
        className="block py-3 text-center bg-purple-700 hover:bg-purple-600 transition-colors text-white font-medium"
      >
        View Details
      </Link>
    </motion.div>
  );
};

export default ProductCard;
