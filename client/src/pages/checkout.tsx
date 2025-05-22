// Add this to your checkout form component
// This assumes you have a checkout form with a submit button

import { id, be } from "date-fns/locale"
import { a } from "framer-motion/dist/types.d-DDSxwf0n"
import { type } from "os"
import { input } from "zod"

<div className="mt-6 space-y-4">
  <div className="flex items-start">
    <input
      type="checkbox"
      id="tos-consent"
      required
      className="mt-1 mr-2"
    />
    <label htmlFor="tos-consent" className="text-sm">
      I agree to the <a href="/tos" target="_blank" rel="noopener noreferrer" className="text-primary">Terms of Service</a>
    </label>
  </div>
  
  <div className="flex items-start">
    <input
      type="checkbox"
      id="privacy-consent"
      required
      className="mt-1 mr-2"
    />
    <label htmlFor="privacy-consent" className="text-sm">
      I acknowledge that my information will be processed according to the 
      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary ml-1">
        Privacy Policy
      </a>
    </label>
  </div>
  
  <button
    type="submit"
    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md"
  >
    Complete Purchase
  </button>
</div>
