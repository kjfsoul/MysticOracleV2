// Add this section to your account/profile page
// This assumes you have an account page component

<section className="mt-8 p-6 bg-card rounded-lg border border-border">
  <h3 className="text-xl font-semibold mb-4">Legal & Privacy</h3>
  <ul className="space-y-3">
    <li>
      <a 
        href="/tos" 
        className="text-primary hover:underline flex items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="mr-2">📜</span> Terms of Service
      </a>
    </li>
    <li>
      <a 
        href="/privacy-policy" 
        className="text-primary hover:underline flex items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="mr-2">🔒</span> Privacy Policy
      </a>
    </li>
    <li>
      <a 
        href="/manage-data" 
        className="text-primary hover:underline flex items-center"
      >
        <span className="mr-2">⚙️</span> Manage My Data
      </a>
    </li>
  </ul>
</section>