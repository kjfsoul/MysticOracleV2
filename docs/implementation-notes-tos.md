# Terms of Service Implementation Notes

## Deployment Tasks
- Upload full Terms of Service document to mysticarcana.com/tos
- Ensure the document is properly formatted with Markdown styling
- Add appropriate meta tags for SEO and social sharing

## Integration Points

### 1. Onboarding Flow
Add Terms of Service acceptance checkbox during signup (required):
```jsx
<div className="space-y-2">
  <div className="flex items-start">
    <Checkbox 
      id="tos-consent" 
      required
      aria-required="true"
      className="mt-1 mr-2"
    />
    <Label htmlFor="tos-consent" className="text-sm">
      I have read and agree to the <Link href="/tos" target="_blank" className="text-primary">Terms of Service</Link>
    </Label>
  </div>
  
  {/* Other consent checkboxes */}
  
  <Button type="submit" className="w-full">
    Create Account
  </Button>
</div>
```

### 2. App Footer
Add Terms of Service link to the site footer (already implemented for Privacy Policy):
```jsx
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
```

### 3. Profile/Account Page
Add Terms of Service link in account settings:
```jsx
<section className="account-links">
  <h3>Legal & Privacy</h3>
  <ul>
    <li><Link href="/tos">Terms of Service</Link></li>
    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
    <li><Link href="/manage-data">Manage My Data</Link></li>
    {/* Other links */}
  </ul>
</section>
```

### 4. Shop Checkout Page
Add Terms of Service acknowledgment in checkout flow:
```jsx
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
```

## Testing Checklist
- [ ] Terms of Service loads correctly at mysticarcana.com/tos
- [ ] All links to Terms of Service work correctly
- [ ] Terms acceptance is required during signup
- [ ] Terms acceptance is required during checkout
- [ ] Mobile responsiveness of all Terms-related UI elements