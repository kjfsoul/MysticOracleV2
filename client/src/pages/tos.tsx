import { Layout } from '@client/components/layout/layout';
import { SEO } from '@client/components/seo';

export default function TermsOfServicePage() {
  return (
    <Layout>
      <SEO 
        title="Terms of Service | Mystic Arcana"
        description="Mystic Arcana's Terms of Service - please read these terms carefully before using our platform."
      />
      
      <div className="container mx-auto py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1>Mystic Arcana Terms & Conditions</h1>
          <p><em>Effective Date: May 1, 2025</em></p>
          <p><em>Version 1.1</em></p>
          
          <hr />
          
          <h2>1. Welcome to Mystic Arcana</h2>
          <p>Thank you for joining us on this spiritual journey. Mystic Arcana is a personalized tarot and astrology platform that offers interactive readings, custom decks, AI-guided insights, and evolving mystical experiences. By accessing our website, app, or services, you agree to the terms below <strong>as well as our Privacy Policy, Disclaimer, and Cookies Policy</strong>, which are incorporated by reference.</p>
          
          <hr />
          
          <h2>2. Eligibility & Age Requirement</h2>
          <p>Mystic Arcana is intended for users <strong>age 16 and older</strong>. By using our platform, you confirm that:</p>
          <ul>
            <li>You are at least 16 years old</li>
            <li>If under 18, you have legal guardian consent</li>
            <li>You understand this platform is intended for spiritual entertainment only</li>
          </ul>
          
          <hr />
          
          <h2>3. Account Creation & Responsibilities</h2>
          <p>To access personalized features, you must create an account. You agree to:</p>
          <ul>
            <li>Provide truthful, accurate info</li>
            <li>Keep login credentials secure</li>
            <li>Be responsible for all activity under your account</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts for violating these terms.</p>
          
          <hr />
          
          <h2>4. Services Are Interpretive, Not Professional Advice</h2>
          <p>Our tarot readings, astrology tools, and AI insights are intended for <strong>personal growth and spiritual entertainment only</strong>.</p>
          <blockquote>
            <p>We do not provide medical, legal, or financial advice.<br />
            No fiduciary, clinical, or professional relationship is created by using Mystic Arcana.</p>
          </blockquote>
          <p>You agree not to hold us liable for any decisions or outcomes resulting from your engagement with our services.</p>
          
          <hr />
          
          <h2>5. Subscription Plans & Payments</h2>
          <p>Premium features may require payment. All transactions are securely processed via Stripe.</p>
          <p>You agree to:</p>
          <ul>
            <li>Pay fees in full</li>
            <li>Understand subscriptions auto-renew unless canceled</li>
            <li>Refer to our [Refund Policy] (coming soon) for eligibility</li>
          </ul>
          
          <hr />
          
          <h2>6. Intellectual Property</h2>
          <p>All Mystic Arcana content (including card art, text, branding, and AI-generated insights) is owned by Mystic Arcana, LLC.</p>
          <p>You may not copy, reproduce, or reuse our intellectual property without permission.</p>
          <p>User-submitted content (like journal entries) remains your property, but:</p>
          <ul>
            <li>You grant us a non-exclusive license to store, analyze, and learn from this content</li>
            <li>We will not publish it without your consent</li>
          </ul>
          
          <hr />
          
          {/* Continue with the rest of the terms of service sections */}
          {/* This is a simplified version - the full content should be included */}
          
          <h2>13. Contact & Questions</h2>
          <p>For questions, support, or legal inquiries:</p>
          <p><strong>Email</strong>: support@mysticarcana.com</p>
          <p><strong>Mailing Address</strong>: Mystic Arcana, LLC — 1810 E Palm Ave #5107, Tampa, FL 33605</p>
        </article>
      </div>
    </Layout>
  );
}