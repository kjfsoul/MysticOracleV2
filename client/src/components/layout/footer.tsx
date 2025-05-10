// Update your footer component to include the Terms of Service link
// This assumes you have a footer component with links section

import { a, p } from "framer-motion/dist/types.d-DDSxwf0n"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto">
        {/* Existing footer content */}
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Other footer sections */}
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/tos" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/privacy-policy" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              {/* Other legal links */}
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mystic Arcana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
