import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-gold">
                  Legal Information
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Cookies Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
                {/* Introduction */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
                  <p>
                    This Cookies Policy explains what cookies are, how Dezora Luxe ("we," "our," or "us") uses cookies on our website, and your choices regarding cookies.
                  </p>
                  <p>
                    This policy should be read together with our <a href="/privacy-policy" className="text-gold hover:underline">Privacy Policy</a>, which provides additional information about how we collect, use, and protect your personal information.
                  </p>
                </section>

                {/* What Are Cookies */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">2. What Are Cookies</h2>
                  <p>
                    Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. Cookies are widely used to make websites work more efficiently and to provide information to website owners.
                  </p>
                  <p>
                    Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website and allows us to improve our services.
                  </p>
                </section>

                {/* Types of Cookies We Use */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">3. Types of Cookies We Use</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">3.1 Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of essential cookies as they are required for the website to operate.
                  </p>
                  <p>
                    Examples of essential cookies we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Session cookies to maintain your login state</li>
                    <li>Security cookies to protect against fraud</li>
                    <li>Cookies that remember your shopping cart contents</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.2 Functional Cookies</h3>
                  <p>
                    These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features. They may also be used to provide services you have requested.
                  </p>
                  <p>
                    Examples of functional cookies we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Preference cookies that remember your settings</li>
                    <li>Language and region selection cookies</li>
                    <li>Cookies that remember your account preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.3 Analytics Cookies</h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website's structure and content.
                  </p>
                  <p>
                    Examples of analytics cookies we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Page view and navigation tracking</li>
                    <li>Time spent on pages</li>
                    <li>Click patterns and user flow</li>
                    <li>Error tracking and performance monitoring</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">3.4 Marketing Cookies</h3>
                  <p>
                    These cookies are used to track visitors across websites to display relevant advertisements. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                  </p>
                  <p>
                    Examples of marketing cookies we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Advertising cookies that track your browsing habits</li>
                    <li>Social media cookies for sharing content</li>
                    <li>Retargeting cookies that show you relevant ads</li>
                  </ul>
                </section>

                {/* Third-Party Cookies */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">4. Third-Party Cookies</h2>
                  <p>
                    In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver advertisements. These third parties may set their own cookies or similar technologies on your device.
                  </p>
                  <p>
                    Third-party services we use that may set cookies include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Paystack:</strong> Payment processing services</li>
                    <li><strong>Supabase:</strong> Backend and authentication services</li>
                    <li><strong>Cloudinary:</strong> Image hosting and optimization</li>
                    <li><strong>Analytics Providers:</strong> Website analytics and performance monitoring</li>
                    <li><strong>Social Media Platforms:</strong> Social sharing and integration features</li>
                  </ul>
                  <p>
                    These third parties may use cookies to collect information about your online activities across different websites. We do not control these third-party cookies, and you should review the privacy policies of these third parties to understand their cookie practices.
                  </p>
                </section>

                {/* How Long Cookies Stay on Your Device */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">5. How Long Cookies Stay on Your Device</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">5.1 Session Cookies</h3>
                  <p>
                    Session cookies are temporary cookies that are deleted when you close your browser. They allow the website to link your actions during a browsing session.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">5.2 Persistent Cookies</h3>
                  <p>
                    Persistent cookies remain on your device for a set period or until you delete them. They are activated each time you visit the website that created the cookie. The retention period varies depending on the purpose of the cookie.
                  </p>
                </section>

                {/* Your Cookie Choices */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">6. Your Cookie Choices</h2>
                  <p>
                    You have several options to manage or limit how cookies are used on your device:
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">6.1 Browser Settings</h3>
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or alert you when cookies are being sent. However, if you disable cookies, some parts of our website may not function properly.
                  </p>
                  <p>
                    Here are links to cookie management instructions for popular browsers:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Safari</a></li>
                    <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Microsoft Edge</a></li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">6.2 Cookie Consent Banner</h3>
                  <p>
                    When you first visit our website, you may see a cookie consent banner. You can choose to accept or reject non-essential cookies. You can change your preferences at any time through your browser settings or by contacting us.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">6.3 Opt-Out Links</h3>
                  <p>
                    For certain third-party cookies, you can opt out directly through the third party's website:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Opt-out tool</a></li>
                    <li>You can also use the <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Your Online Choices</a> website to opt out of many advertising cookies</li>
                  </ul>
                </section>

                {/* Do Not Track Signals */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">7. Do Not Track Signals</h2>
                  <p>
                    Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit that you do not want to have your online activity tracked. Currently, there is no standard for how DNT signals should be interpreted. As a result, our website does not currently respond to DNT signals.
                  </p>
                </section>

                {/* Updates to This Policy */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">8. Updates to This Policy</h2>
                  <p>
                    We may update this Cookies Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    We encourage you to review this Cookies Policy periodically to stay informed about our use of cookies.
                  </p>
                </section>

                {/* Contact Us */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">9. Contact Us</h2>
                  <p>
                    If you have any questions about our use of cookies or this Cookies Policy, please contact us:
                  </p>
                  <div className="bg-charcoal p-6 rounded-lg space-y-2">
                    <p className="text-foreground font-medium">Dezora Luxe</p>
                    <p>Email: privacy@dezoraluxe.com</p>
                    <p>Website: www.dezoraluxe.com</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPolicy;

