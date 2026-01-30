import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
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
                  Privacy Policy
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
                    Dezora Luxe ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                  </p>
                  <p>
                    This Privacy Policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and other applicable Nigerian data protection laws. By using our Service, you consent to the data practices described in this policy.
                  </p>
                </section>

                {/* Information We Collect */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">2.1 Personal Information</h3>
                  <p>
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Register for an account</li>
                    <li>Place an order</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Contact us or request customer support</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  <p>
                    This information may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely through Paystack)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Preferences and interests</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">2.2 Automatically Collected Information</h3>
                  <p>
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages you visit and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Device identifiers</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-foreground mt-6">2.3 Cookies and Tracking Technologies</h3>
                  <p>
                    We use cookies, web beacons, and similar tracking technologies to collect information about your browsing behavior. For more detailed information, please see our <a href="/cookies-policy" className="text-gold hover:underline">Cookies Policy</a>.
                  </p>
                </section>

                {/* How We Use Your Information */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
                  <p>
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Order Processing:</strong> To process and fulfill your orders, manage payments, and arrange shipping</li>
                    <li><strong>Account Management:</strong> To create and manage your account, authenticate your identity, and provide customer support</li>
                    <li><strong>Communication:</strong> To send you order confirmations, shipping updates, and respond to your inquiries</li>
                    <li><strong>Marketing:</strong> To send you promotional materials, newsletters, and special offers (with your consent)</li>
                    <li><strong>Improvement:</strong> To analyze usage patterns, improve our website, products, and services</li>
                    <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
                    <li><strong>Security:</strong> To detect, prevent, and address fraud, security breaches, and other harmful activities</li>
                  </ul>
                </section>

                {/* Legal Basis for Processing */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">4. Legal Basis for Processing</h2>
                  <p>
                    Under the NDPR, we process your personal data based on the following legal grounds:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Consent:</strong> You have given clear consent for us to process your data for specific purposes</li>
                    <li><strong>Contract:</strong> Processing is necessary for the performance of a contract with you (e.g., fulfilling your order)</li>
                    <li><strong>Legal Obligation:</strong> Processing is necessary for compliance with a legal obligation</li>
                    <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests, provided your rights and interests do not override these interests</li>
                  </ul>
                </section>

                {/* Information Sharing and Disclosure */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">5. Information Sharing and Disclosure</h2>
                  <p>
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-foreground mt-6">5.1 Service Providers</h3>
                  <p>
                    We may share your information with third-party service providers who perform services on our behalf, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Payment processors (Paystack)</li>
                    <li>Shipping and delivery companies</li>
                    <li>Cloud storage providers (Supabase, Cloudinary)</li>
                    <li>Email service providers</li>
                    <li>Analytics and marketing service providers</li>
                  </ul>
                  <p>
                    These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">5.2 Legal Requirements</h3>
                  <p>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                  </p>

                  <h3 className="text-xl font-semibold text-foreground mt-6">5.3 Business Transfers</h3>
                  <p>
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                  </p>
                </section>

                {/* Data Security */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">6. Data Security</h2>
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure authentication and access controls</li>
                    <li>Regular security assessments and updates</li>
                    <li>Employee training on data protection</li>
                    <li>Incident response procedures</li>
                  </ul>
                  <p>
                    However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                  </p>
                </section>

                {/* Data Retention */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
                  <p>
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                  </p>
                  <p>
                    When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies and applicable legal requirements.
                  </p>
                </section>

                {/* Your Rights Under NDPR */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">8. Your Rights Under NDPR</h2>
                  <p>
                    Under the Nigeria Data Protection Regulation, you have the following rights regarding your personal data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right of Access:</strong> You have the right to request access to your personal data and receive a copy of the data we hold about you</li>
                    <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data</li>
                    <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain circumstances</li>
                    <li><strong>Right to Restrict Processing:</strong> You can request that we limit how we use your data</li>
                    <li><strong>Right to Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format</li>
                    <li><strong>Right to Object:</strong> You can object to processing of your data for certain purposes, including direct marketing</li>
                    <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw consent at any time</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
                  </p>
                </section>

                {/* Children's Privacy */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">9. Children's Privacy</h2>
                  <p>
                    Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
                  </p>
                </section>

                {/* International Data Transfers */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">10. International Data Transfers</h2>
                  <p>
                    Your information may be transferred to and processed in countries other than Nigeria. We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws.
                  </p>
                </section>

                {/* Changes to This Privacy Policy */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">11. Changes to This Privacy Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  <p>
                    We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                  </p>
                </section>

                {/* Contact Us */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">12. Contact Us</h2>
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-charcoal p-6 rounded-lg space-y-2">
                    <p className="text-foreground font-medium">Dezora Luxe - Data Protection Officer</p>
                    <p>Email: privacy@dezoraluxe.com</p>
                    <p>Website: www.dezoraluxe.com</p>
                    <p className="mt-4 text-sm">
                      You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC) if you believe your data protection rights have been violated.
                    </p>
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

export default PrivacyPolicy;

