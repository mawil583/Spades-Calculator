import browserstack from 'browserstack-local';

// BrowserStack configuration for real mobile browser testing
const bs_local = new browserstack.Local();

interface BrowserStackOptions {
    os: string;
    osVersion: string;
    deviceName: string;
    realMobile: string;
    projectName: string;
    buildName: string;
    sessionName: string;
    debug: string;
    networkLogs: string;
    consoleLogs: string;
}

interface Capabilities {
    'bstack:options': BrowserStackOptions;
    browserName: string;
    browserVersion: string;
}

interface MobileBrowser {
    name: string;
    os: string;
    osVersion: string;
    deviceName: string;
    browserName: string;
    browserVersion: string;
}

// BrowserStack capabilities
const capabilities: Capabilities = {
    'bstack:options': {
        os: 'iOS',
        osVersion: '14',
        deviceName: 'iPhone 12',
        realMobile: 'true',
        projectName: 'Spades Calculator PWA',
        buildName: 'PWA Installation Test',
        sessionName: 'Mobile PWA Installation Test',
        debug: 'true',
        networkLogs: 'true',
        consoleLogs: 'info',
    },
    browserName: 'safari',
    browserVersion: '14.0',
};

// Test configuration for different mobile browsers
const mobileBrowsers: MobileBrowser[] = [
    {
        name: 'iPhone 12 - Safari',
        os: 'iOS',
        osVersion: '14',
        deviceName: 'iPhone 12',
        browserName: 'safari',
        browserVersion: '14.0',
    },
    {
        name: 'Samsung Galaxy S20 - Chrome',
        os: 'Android',
        osVersion: '10.0',
        deviceName: 'Samsung Galaxy S20',
        browserName: 'chrome',
        browserVersion: '91.0',
    },
    {
        name: 'iPhone 12 - Chrome',
        os: 'iOS',
        osVersion: '14',
        deviceName: 'iPhone 12',
        browserName: 'chrome',
        browserVersion: '91.0',
    },
    {
        name: 'Samsung Galaxy S20 - Samsung Browser',
        os: 'Android',
        osVersion: '10.0',
        deviceName: 'Samsung Galaxy S20',
        browserName: 'samsung',
        browserVersion: '13.0',
    },
];

export default {
    capabilities,
    mobileBrowsers,
    bs_local,
};
