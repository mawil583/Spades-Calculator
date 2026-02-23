import { useState, useEffect, useRef } from 'react';
import { toaster } from '../../components/ui/toaster';

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isCheckingInstall, setIsCheckingInstall] = useState(true);
  const deferredPromptRef = useRef(null);

  useEffect(() => {
    const checkIfInstalled = () => {
      try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = window.navigator.standalone === true;
        const isInApp =
          window.navigator.userAgent.includes('wv') ||
          (window.navigator.userAgent.includes('Mobile') &&
            !window.navigator.userAgent.includes('Safari'));

        const installed = isStandalone || isIOSStandalone || isInApp;
        setIsInstalled(installed);
        setIsCheckingInstall(false);
      } catch (error) {
        console.log('Error checking if installed:', error);
        setIsInstalled(false);
        setIsCheckingInstall(false);
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e) => {
      try {
        e.preventDefault();
        setDeferredPrompt(e);
        deferredPromptRef.current = e;
      } catch (error) {
        console.log('Error handling beforeinstallprompt:', error);
      }
    };

    const handleAppInstalled = () => {
      try {
        setIsInstalled(true);
        setDeferredPrompt(null);
        deferredPromptRef.current = null;
        toaster.create({
          title: 'App Installed!',
          description: 'Spades Calculator has been added to your home screen.',
          type: 'success',
          duration: 3000,
        });
      } catch (error) {
        console.log('Error handling appinstalled:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    try {
      const currentDeferredPrompt = deferredPromptRef.current || deferredPrompt;
      if (currentDeferredPrompt && currentDeferredPrompt.prompt) {
        currentDeferredPrompt.prompt();

        if (
          currentDeferredPrompt.userChoice &&
          typeof currentDeferredPrompt.userChoice.then === 'function'
        ) {
          const { outcome } = await currentDeferredPrompt.userChoice;

          if (outcome === 'accepted') {
            toaster.create({
              title: 'Installation Started!',
              description: 'Please follow the browser prompts to complete the installation.',
              type: 'success',
              duration: 3000,
            });
          } else {
            toaster.create({
              title: 'Installation Cancelled',
              description: 'You can try again anytime from the menu.',
              type: 'info',
              duration: 3000,
            });
          }
        } else {
          toaster.create({
            title: 'Installation Prompt Shown',
            description: 'Please follow the browser prompts to complete the installation.',
            type: 'info',
            duration: 3000,
          });
        }

        setDeferredPrompt(null);
        deferredPromptRef.current = null;
        return;
      }

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isBrave = navigator.brave?.isBrave() || /Brave/.test(navigator.userAgent);
      const isChrome = /Chrome/.test(navigator.userAgent) && !isBrave;
      const isSafari = /Safari/.test(navigator.userAgent) && !isChrome && !isBrave;
      const isFirefox = /Firefox/.test(navigator.userAgent);

      if (isIOS || isAndroid) {
        showMobileInstallInstructions(isIOS, isAndroid, isBrave, isChrome, isSafari, isFirefox);
        return;
      }

      showManualInstallInstructions();
    } catch (error) {
      console.error('Error during installation:', error);
      showManualInstallInstructions();
    }
  };

  const showMobileInstallInstructions = (isIOS, isAndroid, isBrave, isChrome, isSafari, isFirefox) => {
    let instructions = '';
    let title = 'Install Instructions';

    if (isIOS) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions = 'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App".';
      } else if (isSafari) {
        title = 'Install in Safari';
        instructions = 'Tap the Share button (📤), then "Add to Home Screen"';
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else {
        title = 'Install on iOS';
        instructions = 'Tap the Share button (📤) in your browser, then "Add to Home Screen"';
      }
    } else if (isAndroid) {
      if (isBrave) {
        title = 'Install in Brave Browser';
        instructions = 'Tap the menu (⋯) in Brave, then look for "Add to Home Screen" or "Install App".';
      } else if (isChrome) {
        title = 'Install in Chrome';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else if (isFirefox) {
        title = 'Install in Firefox';
        instructions = 'Tap the menu (⋯), then "Add to Home Screen"';
      } else {
        title = 'Install on Android';
        instructions = 'Tap the menu (⋯) in your browser, then "Add to Home Screen"';
      }
    }

    toaster.create({ title, description: instructions, type: 'info', duration: 8000 });
  };

  const showManualInstallInstructions = () => {
    const isBrave = navigator.brave?.isBrave() || /Brave/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !isBrave;
    const isFirefox = /Firefox/.test(navigator.userAgent);

    let instructions = 'Look for the share/install icon (↗️) in your browser\'s address bar';
    let title = 'Install Instructions';

    if (isBrave) {
      title = 'Install in Brave Browser';
      instructions = "Look for the install icon (↗️) in Brave's address bar, or tap the menu (⋯) and select 'Install Spades Calculator'";
    } else if (isChrome) {
      title = 'Install in Chrome';
      instructions = "Look for the install icon (↗️) in Chrome's address bar, or tap the menu (⋯) and select 'Install Spades Calculator'";
    } else if (isFirefox) {
      title = 'Install in Firefox';
      instructions = "Tap the menu (⋯) in Firefox and select 'Install Spades Calculator'";
    }

    toaster.create({ title, description: instructions, type: 'info', duration: 8000 });
  };

  return { isInstalled, isCheckingInstall, handleInstallClick };
};
