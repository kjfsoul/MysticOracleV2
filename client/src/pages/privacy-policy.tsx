import { Layout } from '@client/components/layout/layout';
import { SEO } from '@client/components/seo';
import { table, time } from 'console';
import { th, tr } from 'date-fns/locale';
import { on } from 'events';
import { p } from 'framer-motion/dist/types.d-DDSxwf0n';
import { Type, Logs, Info, Send, Share, Contact, Mail } from 'lucide-react';
import { only } from 'node:test';
import { platform } from 'os';
import { use } from 'passport';
import path from 'path';
import { title } from 'process';
import Stripe from 'stripe';
import { types } from 'util';
import { date, optional } from 'zod';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy | Mystic Arcana"
        description="Learn how Mystic Arcana collects, uses, and protects your personal information."
      />
      
      <div className="container mx-auto py-12 max-w-4xl">
        <article className="prose prose-lg dark:prose-invert mx-auto">
          <h1>Mystic Arcana Privacy Policy</h1>
          <p><em>Effective Date: May 1, 2025</em></p>
          
          <hr />
          
          <h2>1. What We Collect (and Why)</h2>
          <p>To guide your path, we collect the following types of information:</p>
          
          <table>
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Examples</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Identity & Profile</strong></td>
                <td>Name, email, birth date, age, gender, profession, interests</td>
                <td>To personalize your readings and birth chart</td>
              </tr>
              <tr>
                <td><strong>Astrological Details</strong></td>
                <td>Birth location, current location</td>
                <td>To generate accurate astrology insights</td>
              </tr>
              <tr>
                <td><strong>Behavioral Data</strong></td>
                <td>Interactions with cards, spreads, and journal entries</td>
                <td>To tailor AI-generated guidance over time</td>
              </tr>
              <tr>
                <td><strong>Communication Logs</strong></td>
                <td>Comments, messages, Q&A participation</td>
                <td>To support community connection and safety</td>
              </tr>
              <tr>
                <td><strong>Payment Info</strong></td>
                <td>Billing address, transaction history (via Stripe)</td>
                <td>To manage subscriptions and purchases</td>
              </tr>
              <tr>
                <td><strong>Device & Usage</strong></td>
                <td>IP address, browser, device ID</td>
                <td>To improve performance, security, and analytics</td>
              </tr>
            </tbody>
          </table>
          
          <h2>2. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Deliver personalized tarot, astrology, and journaling experiences</li>
            <li>Interpret planetary influences based on your birth chart</li>
            <li>Offer relevant spreads, decks, and recommendations</li>
            <li>Analyze usage patterns to evolve our platform's wisdom</li>
            <li>Send optional updates, horoscopes, and event invitations (if opted in)</li>
            <li>Process secure payments and subscriptions</li>
            <li>Prevent abuse and ensure community safety</li>
          </ul>
          
          <h2>3. Who We Share It With</h2>
          <p>We only share your data with trusted service providers:</p>
          <ul>
            <li><strong>Supabase</strong> – secure data storage and user authentication</li>
            <li><strong>Stripe</strong> – payment processing</li>
            <li><strong>Google Analytics</strong> – anonymous usage metrics</li>
            <li><strong>Netlify</strong> – website deployment</li>
            <li><strong>Affiliates</strong> – with clear link disclosure</li>
            <li><strong>Legal authorities</strong> – only if legally required</li>
          </ul>
          <p>We do not sell your personal information.</p>
          
          {/* Continue with the rest of the privacy policy sections */}
          {/* This is a simplified version - the full content should be included */}
          
          <h2>11. Contact Us</h2>
          <p><strong>Email</strong>: support@mysticarcana.com</p>
          <p><strong>Mail</strong>: Mystic Arcana, LLC – 1810 E Palm Ave #5107, Tampa, FL 33605</p>
          <p><strong>Data Access</strong>: <a href="/manage-data">Manage My Data</a></p>
        </article>
      </div>
    </Layout>
  );
}
