export default function TermsConditionsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-16">
      <div className="prose dark:prose-invert">
        <h1 className="font-headline text-4xl font-bold text-primary">Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          Please read these Terms and Conditions carefully before using the Danny Store website. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.
        </p>

        <h2 className="font-headline">1. Accounts</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You must provide a valid WhatsApp number for order processing.
        </p>

        <h2 className="font-headline">2. Products and Services</h2>
        <p>
          We make every effort to display as accurately as possible the colors and images of our products. We cannot guarantee that your computer monitor's display of any color will be accurate. All descriptions of products or product pricing are subject to change at any time without notice.
        </p>

        <h2 className="font-headline">3. Virtual Try-On</h2>
        <p>
          Our Virtual Try-On service is provided for entertainment and guidance purposes only. The feature is limited to 5 uses per day per user. We do not store any photos you upload for this feature. We are not responsible for any inaccuracies in the generated images.
        </p>
        
        <h2 className="font-headline">4. Orders and Payment</h2>
        <p>
          We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, or error in your order. Our primary method of order finalization is via WhatsApp.
        </p>

        <h2 className="font-headline">5. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are and will remain the exclusive property of Danny Store and its licensors.
        </p>
        
        <h2 className="font-headline">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:support@dannystore.com">support@dannystore.com</a>.
        </p>
      </div>
    </div>
  );
}
