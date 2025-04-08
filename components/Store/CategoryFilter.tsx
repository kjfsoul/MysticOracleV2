import React from 'react';
import { motion } from 'framer-motion';
import { Category } from './types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-200">Categories</h2>
      
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-pink-600 text-white'
              : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          All Products
        </motion.button>
        
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              selectedCategory === category.id
                ? 'bg-pink-600 text-white'
                : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
