import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Link } from "wouter";

// Simplified version of blog articles for preview
const previewArticles = [
  {
    id: 1,
    title: "Saturn-Uranus Square: Navigating March 2025's Cosmic Tension",
    category: "Astrology",
    date: "2025-03-10",
    excerpt:
      "Learn how this powerful transit affects global changes and personal transformation.",
    slug: "saturn-uranus-square-2025",
  },
  {
    id: 2,
    title: "The Digital Oracle Revolution: AI-Enhanced Tarot in 2025",
    category: "Tarot",
    date: "2025-03-08",
    excerpt:
      "Explore how quantum-neural interfaces are transforming traditional tarot practice.",
    slug: "ai-tarot-revolution-2025",
  },
  {
    id: 3,
    title: "Interpreting the March 2025 Lunar Eclipse Through Tarot Spreads",
    category: "Tarot",
    date: "2025-02-25",
    excerpt: "Learn our custom tarot spread designed for this celestial event.",
    slug: "march-2025-eclipse-tarot",
  },
];

interface BlogPreviewProps {
  postId?: string;
  title?: string;
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ postId, title }) => {
  // If postId is provided, find the specific article
  if (postId) {
    const article =
      previewArticles.find((a) => a.id.toString() === postId) ||
      previewArticles[0];

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <span className="text-xs text-purple-600 mb-1">
            {article.category}
          </span>
          <CardTitle className="text-lg">
            <Link
              href={`/blog/${article.slug}`}
              className="hover:text-purple-600"
            >
              {title || article.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
          <Link
            href={`/blog/${article.slug}`}
            className="text-sm text-purple-600 hover:underline"
          >
            Read more →
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Default behavior - show all articles
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {previewArticles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <span className="text-xs text-purple-600 mb-1">
              {article.category}
            </span>
            <CardTitle className="text-lg">
              <Link
                href={`/blog/${article.slug}`}
                className="hover:text-purple-600"
              >
                {article.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
            <Link
              href={`/blog/${article.slug}`}
              className="text-sm text-purple-600 hover:underline"
            >
              Read more →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
