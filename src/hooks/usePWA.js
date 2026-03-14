// import { useEffect, useState } from 'react';

// export const usePWA = () => {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isIOS, setIsIOS] = useState(false);

//   useEffect(() => {
//     // Check if the device is iOS
//     const userAgent = window.navigator.userAgent.toLowerCase();
//     const isApple = /iphone|ipad|ipod/.test(userAgent);
    
//     // Check if the app is already in standalone mode (already installed)
//     const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

//     if (isApple && !isStandalone) {
//       setIsIOS(true);
//     }

//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//     };

//     window.addEventListener('beforeinstallprompt', handler);
//     return () => window.removeEventListener('beforeinstallprompt', handler);
//   }, []);

//   const installApp = async () => {
//     if (deferredPrompt) {
//       deferredPrompt.prompt();
//       setDeferredPrompt(null);
//     }
//   };

//   return { deferredPrompt, installApp, isIOS };
// };


import { useEffect, useState } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect if the device is iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Detect if app is running in standalone mode (already installed)
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    // Set iOS flag only if device is iOS and app is NOT standalone
    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
    }

    // Listen for the beforeinstallprompt event on supported browsers (Android/Chrome)
    const handler = (e) => {
      e.preventDefault();  // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event to trigger later
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Trigger the PWA install prompt manually
  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  return { deferredPrompt, installApp, isIOS };
};
