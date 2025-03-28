
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Clock, ArrowRight, Heart } from 'lucide-react';

interface BlogPageProps {
  params?: {
    slug?: string;
    category?: string;
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  const [activeTab, setActiveTab] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const articleSlug = params?.slug;
  const categoryFilter = params?.category;
  
  // Current 2025 blog articles with trending topics
  const currentDate = new Date();
  const blogArticles = [
    {
      id: 1,
      title: 'Saturn-Uranus Square: Navigating March 2025\'s Cosmic Tension',
      category: 'Astrology',
      date: '2025-03-10',
      excerpt: 'As Saturn and Uranus form their climactic square this month, learn how this powerful transit affects global changes and personal transformation in your life.',
      image: '/images/placeholders/astrology-placeholder.jpg',
      slug: 'saturn-uranus-square-2025',
      likes: 287
    },
    {
      id: 2,
      title: 'The Digital Oracle Revolution: AI-Enhanced Tarot in 2025',
      category: 'Tarot',
      date: '2025-03-08',
      excerpt: 'Explore how the latest quantum-neural interfaces are transforming traditional tarot practice while preserving the intuitive core of card reading.',
      image: '/images/placeholders/tarot-placeholder.jpg',
      slug: 'ai-tarot-revolution-2025',
      likes: 243
    },
    {
      id: 3,
      title: 'Astrological Implications of James Webb\'s Latest Exoplanet Discoveries',
      category: 'Astronomy',
      date: '2025-03-05',
      excerpt: 'NASA\'s James Webb Space Telescope has discovered seven Earth-like planets with potential for water. We explore the astrological significance of these cosmic findings.',
      image: '/images/placeholders/astronomy-placeholder.jpg',
      slug: 'jwst-exoplanets-astrology-2025',
      likes: 312
    },
    {
      id: 4,
      title: 'Lunar Habitat Initiative: Spiritual Implications of the First Moon Colony',
      category: 'Spirituality',
      date: '2025-03-01',
      excerpt: 'With the Artemis Base Camp now under construction, we examine how humanity\'s return to the Moon is reshaping our spiritual connection to Earth\'s companion.',
      image: '/images/placeholders/spirituality-placeholder.jpg',
      slug: 'artemis-moon-colony-spirituality',
      likes: 198
    },
    {
      id: 5,
      title: 'Climate Consciousness: Eco-Spiritual Practices for the 2025 Pacific Healing',
      category: 'Eco-Spirituality',
      date: '2025-02-27',
      excerpt: 'Following the landmark Global Plastics Treaty, discover rituals and practices to connect with and contribute to the ocean restoration initiatives.',
      image: '/images/placeholders/eco-spirituality-placeholder.jpg',
      slug: 'ocean-healing-rituals-2025',
      likes: 226
    },
    {
      id: 6,
      title: 'Interpreting the March 2025 Lunar Eclipse Through Tarot Spreads',
      category: 'Tarot',
      date: '2025-02-25',
      excerpt: 'The upcoming lunar eclipse in Virgo offers a powerful moment for divination. Learn our custom tarot spread designed specifically for this celestial event.',
      image: '/images/placeholders/tarot-placeholder.jpg',
      slug: 'march-2025-eclipse-tarot',
      likes: 275
    },
    {
      id: 7,
      title: 'Global Meditation Day 2025: Join the Quantum Consciousness Field',
      category: 'Spirituality',
      date: '2025-02-22',
      excerpt: 'On March 20th, billions will join the largest synchronized meditation in human history. Learn how to participate in this historic consciousness experiment.',
      image: '/images/placeholders/spirituality-placeholder.jpg',
      slug: 'global-meditation-day-2025',
      likes: 334
    },
    {
      id: 8,
      title: 'Mars-Venus Conjunction: The Cosmic Romance of Spring 2025',
      category: 'Astrology',
      date: '2025-02-18',
      excerpt: 'The rare Mars-Venus conjunction in Aries brings passionate energy to relationships worldwide. Discover how this fiery alignment will affect your love life.',
      image: '/images/placeholders/astrology-placeholder.jpg',
      slug: 'mars-venus-spring-2025',
      likes: 293
    },
    {
      id: 9,
      title: 'Oracle Cards vs Neural Generation: The Evolution of Divination Tools',
      category: 'Oracle',
      date: '2025-02-15',
      excerpt: 'As AI-generated imagery becomes increasingly sophisticated, we examine the spiritual differences between traditional oracle decks and personalized digital divination.',
      image: '/images/placeholders/oracle-placeholder.jpg',
      slug: 'oracle-vs-ai-divination',
      likes: 188
    },
  ];
  
  // Apply category filter if provided
  let filteredByCategory = categoryFilter 
    ? blogArticles.filter(article => article.category.toLowerCase() === categoryFilter.toLowerCase())
    : blogArticles;
    
  // Filter articles based on search query
  const filteredArticles = filteredByCategory.filter(article => 
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Find the specific article if slug is provided
  const specificArticle = articleSlug
    ? blogArticles.find(article => article.slug === articleSlug)
    : null;
  
  // Render single article view if slug is provided
  if (specificArticle) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link href="/blog" className="flex items-center text-accent text-sm hover:underline mb-8">
            ← Back to Articles
          </Link>
          
          <div className="rounded-lg overflow-hidden mb-8 h-64 md:h-80">
            <img 
              src={specificArticle.image} 
              alt={specificArticle.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholders/default-placeholder.jpg';
                target.onerror = null;
              }}
            />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-accent/80 bg-accent/10 px-3 py-1 rounded-full">
              {specificArticle.category}
            </span>
            <div className="flex items-center text-light/50 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(specificArticle.date).toLocaleDateString()}
            </div>
          </div>
          
          <h1 className="font-heading text-3xl md:text-4xl text-light mb-6">
            {specificArticle.title}
          </h1>
          
          <div className="prose prose-invert prose-accent max-w-none">
            <p className="text-light/70 text-lg mb-4">
              {specificArticle.excerpt}
            </p>
            <p className="text-light/80">
              This is a full article content that would be loaded from the API. For now, we're showing a placeholder excerpt.
              The article would continue with more detailed information about {specificArticle.title}.
            </p>
            <p className="text-light/80">
              In the future implementation, this would be fetched from a database with the full article content,
              including formatting, images, and possibly interactive elements related to the topic.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Render category view if category filter is provided
  if (categoryFilter && !specificArticle) {
    const categoryTitle = categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);
    
    return (
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link href="/blog" className="flex items-center text-accent text-sm hover:underline mb-8">
            ← Back to All Categories
          </Link>
          
          <h1 className="font-heading text-4xl md:text-5xl text-accent mb-4">{categoryTitle} Articles</h1>
          <p className="text-light/70 mb-12 max-w-2xl">
            Explore our collection of articles about {categoryTitle.toLowerCase()}, offering insights and wisdom
            to deepen your understanding of this metaphysical practice.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(article => (
              <BlogCard 
                key={article.id} 
                article={article} 
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-light/50 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default blog listing view
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-4xl md:text-5xl text-accent text-center mb-4">Mystic Insights</h1>
        <p className="text-light/70 text-center mb-12 max-w-2xl mx-auto">
          Explore our collection of articles on tarot, astrology, and spiritual practices to deepen your connection with the mystical realm.
        </p>
      </motion.div>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light/40 h-4 w-4" />
          <Input
            placeholder="Search articles..."
            className="pl-10 bg-dark/50 border-light/10 focus:border-accent/50 placeholder:text-light/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-dark/50 border border-light/10 backdrop-blur-sm h-auto p-1 mb-8">
          <TabsTrigger 
            value="recent" 
            className="px-4 py-2 data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger 
            value="popular"
            className="px-4 py-2 data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger 
            value="categories"
            className="px-4 py-2 data-[state=active]:bg-accent/20 data-[state=active]:text-accent"
          >
            Categories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(article => (
              <BlogCard 
                key={article.id} 
                article={article} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.sort((a, b) => b.likes - a.likes).map(article => (
              <BlogCard 
                key={article.id} 
                article={article} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard 
              title="Astrology" 
              count={blogArticles.filter(a => a.category === 'Astrology').length}
              description="Explore the cosmic influences on your life and destiny."
              image="/images/placeholders/astrology-placeholder.jpg"
            />
            <CategoryCard 
              title="Tarot" 
              count={blogArticles.filter(a => a.category === 'Tarot').length}
              description="Discover the wisdom and guidance of the tarot cards."
              image="/images/placeholders/tarot-placeholder.jpg"
            />
            <CategoryCard 
              title="Spirituality" 
              count={blogArticles.filter(a => a.category === 'Spirituality').length}
              description="Deepen your connection with your higher self and the universe."
              image="/images/placeholders/spirituality-placeholder.jpg"
            />
            <CategoryCard 
              title="Astronomy" 
              count={blogArticles.filter(a => a.category === 'Astronomy').length}
              description="Learn how celestial discoveries influence our metaphysical understanding."
              image="/images/placeholders/astronomy-placeholder.jpg"
            />
            <CategoryCard 
              title="Oracle" 
              count={blogArticles.filter(a => a.category === 'Oracle').length}
              description="Explore divination beyond tarot with oracle systems and techniques."
              image="/images/placeholders/oracle-placeholder.jpg"
            />
            <CategoryCard 
              title="Eco-Spirituality" 
              count={blogArticles.filter(a => a.category === 'Eco-Spirituality').length}
              description="Connect your spiritual practice with environmental consciousness."
              image="/images/placeholders/eco-spirituality-placeholder.jpg"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Blog article type
interface BlogArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  slug: string;
  likes: number;
}

// Blog article card component
function BlogCard({ article }: { article: BlogArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden bg-dark/40 border-light/10 backdrop-blur-md h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholders/default-placeholder.jpg';
              target.onerror = null; // Prevent infinite loop
            }}
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-accent/80 bg-accent/10 px-2 py-1 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center text-light/50 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(article.date).toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="text-xl text-light hover:text-accent transition-colors">
            <Link href={`/blog/${article.slug}`}>{article.title}</Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-light/70 text-sm">
            {article.excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-light/5 pt-4">
          <div className="flex items-center text-light/50 text-xs">
            <Heart className="h-3 w-3 mr-1 fill-accent stroke-accent" />
            {article.likes} likes
          </div>
          <Link href={`/blog/${article.slug}`} className="flex items-center text-accent text-sm hover:underline">
            Read More
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Category card props interface
interface CategoryCardProps {
  title: string;
  count: number;
  description: string;
  image: string;
}

// Category card component
function CategoryCard({ title, count, description, image }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="overflow-hidden bg-dark/40 border-light/10 backdrop-blur-md h-full">
        <div className="h-40 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10"></div>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholders/default-placeholder.jpg';
              target.onerror = null; // Prevent infinite loop
            }}
          />
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="text-xl font-semibold text-light">{title}</h3>
            <span className="text-xs text-light/70">{count} articles</span>
          </div>
        </div>
        <CardContent className="pt-4">
          <p className="text-light/70 text-sm mb-4">
            {description}
          </p>
          <Link href={`/blog/category/${title.toLowerCase()}`} className="flex items-center text-accent text-sm hover:underline">
            View All Articles
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
