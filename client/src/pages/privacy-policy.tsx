import { Layout } from '@client/components/layout/layout';
import { SEO } from '@client/components/seo';
import { useEffect, useState } from "react";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch the Privacy Policy content from the docs/privacy-policy.md file
    fetch("/docs/privacy-policy.md")
      .then((response) => response.text())
      .then((text) => {
        setContent(text);
      })
      .catch((error) => {
        console.error("Error loading Privacy Policy:", error);
        setContent("Error loading Privacy Policy. Please try again later.");
      });
  }, []);

  return (
    <Layout>
      <SEO
        title="Privacy Policy | Mystic Arcana"
        description="Learn how Mystic Arcana collects, uses, and protects your personal information."
      />

      <div className="container mx-auto py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
          ) : (
            <p>Loading Privacy Policy...</p>
          )}
        </article>
      </div>
    </Layout>
  );
}
