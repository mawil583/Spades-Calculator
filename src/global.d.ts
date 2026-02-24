// Global browser type augmentations for non-standard navigator properties
// used in PWA detection logic

interface Navigator {
  /** iOS PWA standalone mode detection */
  standalone?: boolean;
  /** Brave browser detection */
  brave?: {
    isBrave: () => Promise<boolean>;
  };
  /** BeforeInstallPromptEvent outcome */
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface FeatureFlagEvent extends CustomEvent {
  detail: {
    key: string;
    value: boolean;
  };
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
  "feature-flag-changed": FeatureFlagEvent;
}

declare module "virtual:pwa-register/react" {
  interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisteredSW?: (
      swScriptUrl: string,
      registration: ServiceWorkerRegistration | undefined,
    ) => void;
    onRegisterError?: (error: Error) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    offlineReady: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
