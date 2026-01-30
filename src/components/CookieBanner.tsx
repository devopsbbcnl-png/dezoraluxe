import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 pb-4">
        <div className="bg-charcoal border border-border rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon and Content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="h-6 w-6 text-gold" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <Link 
                    to="/cookies-policy" 
                    className="text-gold hover:underline inline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={rejectAll}
                className="whitespace-nowrap"
              >
                Reject All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openPreferences}
                className="whitespace-nowrap"
              >
                Customize
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={acceptAll}
                className="whitespace-nowrap bg-gold text-charcoal hover:bg-gold/90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

