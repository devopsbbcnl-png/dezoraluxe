import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CookiePreferences } from '@/lib/cookies';

export function CookiePreferencesDialog() {
  const { showPreferences, preferences, savePreferences, closePreferences } = useCookieConsent();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences, showPreferences]);

  const handleToggle = (category: keyof CookiePreferences) => {
    if (category === 'essential') return; // Essential cookies cannot be disabled
    
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    savePreferences(localPreferences);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setLocalPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setLocalPreferences(onlyEssential);
    savePreferences(onlyEssential);
  };

  return (
    <Dialog open={showPreferences} onOpenChange={closePreferences}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Cookie className="h-6 w-6 text-gold" />
            <DialogTitle className="text-2xl">Cookie Preferences</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            Manage your cookie preferences. You can enable or disable different types of cookies below. 
            Learn more in our{' '}
            <Link to="/cookies-policy" className="text-gold hover:underline">
              Cookies Policy
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Essential Cookies */}
          <div className="space-y-3 p-4 rounded-lg border border-border bg-charcoal/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="essential" className="text-base font-semibold cursor-pointer">
                    Essential Cookies
                  </Label>
                  <span className="text-xs text-muted-foreground bg-gold/20 text-gold px-2 py-0.5 rounded">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They are usually only set in response to actions made by you such as setting your privacy preferences, 
                  logging in, or filling in forms.
                </p>
              </div>
              <Switch
                id="essential"
                checked={localPreferences.essential}
                disabled
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Examples: Authentication cookies, shopping cart cookies, security cookies
              </span>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="space-y-3 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="functional" className="text-base font-semibold cursor-pointer">
                  Functional Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  These cookies enable the website to provide enhanced functionality and personalization. 
                  They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
              </div>
              <Switch
                id="functional"
                checked={localPreferences.functional}
                onCheckedChange={() => handleToggle('functional')}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Examples: Language preferences, region settings, user interface preferences
              </span>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our website's performance and user experience.
                </p>
              </div>
              <Switch
                id="analytics"
                checked={localPreferences.analytics}
                onCheckedChange={() => handleToggle('analytics')}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Examples: Page views, navigation patterns, time spent on pages, error tracking
              </span>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="marketing" className="text-base font-semibold cursor-pointer">
                  Marketing Cookies
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  These cookies are used to make advertising messages more relevant to you and your interests. 
                  They also perform functions like preventing the same advertisement from continuously reappearing.
                </p>
              </div>
              <Switch
                id="marketing"
                checked={localPreferences.marketing}
                onCheckedChange={() => handleToggle('marketing')}
                className="ml-4"
              />
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-2 mt-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Examples: Advertising cookies, retargeting cookies, social media cookies
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="flex-1 sm:flex-none"
            >
              Reject All
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none"
            >
              Accept All
            </Button>
          </div>
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto bg-gold text-charcoal hover:bg-gold/90"
          >
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

