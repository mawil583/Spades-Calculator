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
    userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
}
