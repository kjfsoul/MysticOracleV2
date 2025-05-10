# Terms of Service Implementation Notes

## Integration Points

### 1. Onboarding Flow
- Terms of Service acceptance checkbox required during signup
- Link to /tos opens in new tab

### 2. App Footer
- Terms of Service link in the site footer
- Grouped with other legal links

### 3. Profile/Account Page
- Terms of Service link in account settings
- Under "Legal & Privacy" section

### 4. Shop Checkout Page
- Terms of Service acknowledgment required in checkout flow
- Must be accepted before purchase completion

## Implementation Details
- TOS content loaded directly from docs/tos.md
- Privacy Policy content loaded from docs/privacy-policy.md
- No duplicate content stored in React components
