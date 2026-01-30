import Navbar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
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
                  Terms of Service
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
                    Welcome to Dezora Luxe ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, the "Service") operated by Dezora Luxe, a company registered in Nigeria.
                  </p>
                  <p>
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
                  </p>
                </section>

                {/* Acceptance of Terms */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">2. Acceptance of Terms</h2>
                  <p>
                    By creating an account, placing an order, or using any part of our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. These Terms constitute a legally binding agreement between you and Dezora Luxe.
                  </p>
                  <p>
                    If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms.
                  </p>
                </section>

                {/* Eligibility */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">3. Eligibility</h2>
                  <p>
                    You must be at least 18 years old to use our Service. By using the Service, you represent and warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are at least 18 years of age</li>
                    <li>You have the legal capacity to enter into these Terms</li>
                    <li>You will comply with all applicable laws and regulations in Nigeria</li>
                    <li>All information you provide is accurate and current</li>
                  </ul>
                </section>

                {/* Account Registration */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">4. Account Registration</h2>
                  <p>
                    To access certain features of our Service, you may be required to create an account. You agree to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities that occur under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.
                  </p>
                </section>

                {/* Products and Pricing */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">5. Products and Pricing</h2>
                  <p>
                    We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on the Service is accurate, complete, reliable, current, or error-free.
                  </p>
                  <p>
                    All prices are displayed in Nigerian Naira (NGN) and are subject to change without notice. We reserve the right to modify prices at any time, but price changes will not affect orders that have already been confirmed.
                  </p>
                  <p>
                    Product availability is subject to change. We reserve the right to discontinue any product at any time and to limit quantities of products we sell.
                  </p>
                </section>

                {/* Orders and Payment */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">6. Orders and Payment</h2>
                  <p>
                    When you place an order, you are making an offer to purchase products at the prices stated. We reserve the right to accept or reject any order for any reason, including product availability, errors in pricing or product information, or suspected fraud.
                  </p>
                  <p>
                    Payment must be made at the time of order placement. We accept payment through Paystack and other payment methods as may be specified on our website. All payments are processed securely in accordance with applicable Nigerian financial regulations.
                  </p>
                  <p>
                    You agree to provide current, complete, and accurate purchase and account information for all purchases made through our Service.
                  </p>
                </section>

                {/* Shipping and Delivery */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">7. Shipping and Delivery</h2>
                  <p>
                    We ship products within Nigeria. Shipping costs and estimated delivery times are provided at checkout. Delivery times are estimates and not guaranteed.
                  </p>
                  <p>
                    Risk of loss and title for products purchased from us pass to you upon delivery to the carrier. You are responsible for filing any claims with carriers for damaged or lost shipments.
                  </p>
                  <p>
                    We are not responsible for delays caused by customs, weather, or other circumstances beyond our control.
                  </p>
                </section>

                {/* Returns and Refunds */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">8. Returns and Refunds</h2>
                  <p>
                    We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible products within 7 days of delivery, subject to our Return Policy.
                  </p>
                  <p>
                    To be eligible for a return, items must be unused, in their original packaging, and in the same condition as when you received them. Certain items, such as personalized products or items marked as non-returnable, may not be eligible for return.
                  </p>
                  <p>
                    Refunds will be processed to the original payment method within 5-10 business days after we receive and inspect the returned item.
                  </p>
                </section>

                {/* Intellectual Property */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">9. Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are owned by Dezora Luxe and are protected by Nigerian and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
                  </p>
                  <p>
                    The Dezora Luxe name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Dezora Luxe or its affiliates.
                  </p>
                </section>

                {/* User Conduct */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">10. User Conduct</h2>
                  <p>
                    You agree not to use the Service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>In any way that violates any applicable Nigerian or international law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                    <li>To impersonate or attempt to impersonate the company, a company employee, another user, or any other person or entity</li>
                    <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                  </ul>
                </section>

                {/* Limitation of Liability */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">11. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by Nigerian law, Dezora Luxe shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
                  </p>
                  <p>
                    Our total liability to you for all claims arising from or related to the use of the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.
                  </p>
                </section>

                {/* Indemnification */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">12. Indemnification</h2>
                  <p>
                    You agree to defend, indemnify, and hold harmless Dezora Luxe, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your access to or use of the Service, your violation of these Terms, or your violation of any rights of another.
                  </p>
                </section>

                {/* Governing Law */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">13. Governing Law</h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Nigeria.
                  </p>
                </section>

                {/* Changes to Terms */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">14. Changes to Terms</h2>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                  </p>
                  <p>
                    What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </section>

                {/* Contact Information */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold text-foreground">15. Contact Information</h2>
                  <p>
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="bg-charcoal p-6 rounded-lg space-y-2">
                    <p className="text-foreground font-medium">Dezora Luxe</p>
                    <p>Email: legal@dezoraluxe.com</p>
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

export default TermsOfService;

