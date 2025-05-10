import { useEffect, useState } from "react";
import { Layout } from "@client/components/layout/layout";
import { SEO } from "@client/components/seo";
import marked from "marked";

export default function TermsOfServicePage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch the TOS content from the docs/tos.md file
    fetch("/docs/tos.md")
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
      })
      .catch((error) => {
        console.error("Error loading Terms of Service:", error);
        setContent("Error loading Terms of Service. Please try again later.");
      });
  }, []);

  return (
    <Layout>
      <SEO
        title="Terms of Service | Mystic Arcana"
        description="Mystic Arcana's Terms of Service - please read these terms carefully before using our platform."
      />

      <div className="container mx-auto py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          ) : (
            <p>Loading Terms of Service...</p>
          )}
        </article>
      </div>
    </Layout>
  );
}
