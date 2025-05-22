# Privacy Policy Implementation Notes

## Deployment Tasks
- Upload full privacy policy document to mysticarcana.com/privacy-policy
- Ensure the document is properly formatted with Markdown styling
- Add appropriate meta tags for SEO and social sharing

## Integration Points

### 1. App Footer
Add privacy policy link to the site footer:
```jsx
<footer>
  {/* Existing footer content */}
  <div className="footer-links">
    <Link href="/privacy-policy">Privacy Policy</Link>
    {/* Other footer links */}
  </div>
</footer>
```

### 2. Onboarding Flow
Add privacy policy acknowledgment checkbox during signup:
```jsx
<Checkbox 
  id="privacy-policy-consent" 
  required
  aria-required="true"
/>
<Label htmlFor="privacy-policy-consent">
  I have read and agree to the <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>
</Label>
```

### 3. Profile/Account Page
Add privacy policy link in account settings:
```jsx
<section className="account-links">
  <h3>Legal & Privacy</h3>
  <ul>
    <li><Link href="/privacy-policy">Privacy Policy</Link></li>
    <li><Link href="/manage-data">Manage My Data</Link></li>
    {/* Other links */}
  </ul>
</section>
```

### 4. Shop Checkout Page
Add privacy policy acknowledgment in checkout flow:
```jsx
<div className="checkout-terms">
  <Checkbox id="checkout-privacy" required />
  <Label htmlFor="checkout-privacy">
    I acknowledge that my information will be processed according to the 
    <Link href="/privacy-policy" target="_blank">Privacy Policy</Link>
  </Label>
</div>
```

### 5. Settings Page
Add privacy controls section:
```jsx
<section className="privacy-controls">
  <h3>Privacy Settings</h3>
  <p>Manage how your data is used. See our <Link href="/privacy-policy">Privacy Policy</Link> for details.</p>
  {/* Privacy toggles and controls */}
</section>
```

### 6. Cookie Banner
Implement cookie consent banner on initial visit:
```jsx
// components/cookie-banner.tsx
// Use the existing subscription-banner.tsx as a reference for implementation
```

## Cookie Banner Implementation
The cookie banner should:
- Appear on first visit
- Allow users to accept all cookies or customize preferences
- Store consent in localStorage
- Include link to privacy policy
- Meet GDPR and CCPA requirements

## Testing Checklist
- [ ] Privacy policy loads correctly at mysticarcana.com/privacy-policy
- [ ] All links to privacy policy work correctly
- [ ] Cookie banner appears on first visit
- [ ] Cookie preferences are saved correctly
- [ ] Consent checkboxes are working in onboarding and checkout
- [ ] Mobile responsiveness of all privacy-related UI elements