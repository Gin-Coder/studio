export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-16">
      <div className="prose dark:prose-invert">
        <h1 className="font-headline text-4xl font-bold text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          Welcome to Danny Store. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>

        <h2 className="font-headline">1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, email address, and WhatsApp number when you create an account, place an order, or contact us for support. We also collect non-personal information, such as browser type and pages visited, to improve our service.
        </p>

        <h2 className="font-headline">2. How We Use Your Information</h2>
        <ul>
          <li>To process and manage your orders and returns.</li>
          <li>To communicate with you, including sending order confirmations via WhatsApp.</li>
          <li>To provide customer support.</li>
          <li>To improve our website and services.</li>
          <li>To send you promotional materials, if you opt-in.</li>
        </ul>

        <h2 className="font-headline">3. Information Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or servicing you, so long as those parties agree to keep this information confidential.
        </p>

        <h2 className="font-headline">4. Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
        
        <h2 className="font-headline">5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information at any time by logging into your account or contacting us directly.
        </p>

        <h2 className="font-headline">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@dannystore.com">privacy@dannystore.com</a>.
        