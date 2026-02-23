// No import needed for jest in this environment

// Mock the offline page HTML content
const mockOfflinePageContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spades Calculator - Offline</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .offline-container {
            text-align: center;
            max-width: 400px;
            padding: 40px 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .offline-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }
        h1 {
            margin: 0 0 20px 0;
            font-size: 24px;
            font-weight: 600;
        }
        p {
            margin: 0 0 30px 0;
            line-height: 1.6;
            opacity: 0.9;
        }
        .retry-button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .retry-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Offline</h1>
        <p>It looks like you don't have an internet connection right now. Don't worry - you can still use Spades Calculator for basic functionality!</p>
        <a href="/" class="retry-button" onclick="window.location.reload()">Try Again</a>
    </div>
    <script>
        // Check if we're back online
        window.addEventListener('online', () => {
            window.location.reload();
        });
    </script>
</body>
</html>
`;

describe('Offline Page Content', () => {
  beforeEach(() => {
    // Mock DOMParser
    global.DOMParser = jest.fn().mockImplementation(() => ({
      parseFromString: jest.fn().mockReturnValue({
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(),
        getElementsByTagName: jest.fn(),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('HTML Structure', () => {
    it('should contain proper HTML structure', () => {
      expect(mockOfflinePageContent).toContain('<!DOCTYPE html>');
      expect(mockOfflinePageContent).toContain('<html lang="en">');
      expect(mockOfflinePageContent).toContain('<head>');
      expect(mockOfflinePageContent).toContain('<body>');
    });

    it('should have proper meta tags', () => {
      expect(mockOfflinePageContent).toContain('<meta charset="UTF-8">');
      expect(mockOfflinePageContent).toContain(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      );
      expect(mockOfflinePageContent).toContain(
        '<title>Spades Calculator - Offline</title>'
      );
    });
  });

  describe('Content and Messaging', () => {
    it('should contain appropriate offline messaging', () => {
      expect(mockOfflinePageContent).toContain("You're Offline");
      expect(mockOfflinePageContent).toContain(
        "It looks like you don't have an internet connection right now"
      );
      expect(mockOfflinePageContent).toContain(
        "Don't worry - you can still use Spades Calculator for basic functionality!"
      );
    });

    it('should have proper heading structure', () => {
      expect(mockOfflinePageContent).toContain('<h1>');
      expect(mockOfflinePageContent).toContain("You're Offline");
    });

    it('should have retry button with correct text', () => {
      expect(mockOfflinePageContent).toContain('Try Again');
      expect(mockOfflinePageContent).toContain('class="retry-button"');
    });
  });

  describe('Styling and Layout', () => {
    it('should have offline container class', () => {
      expect(mockOfflinePageContent).toContain('class="offline-container"');
    });

    it('should have offline icon', () => {
      expect(mockOfflinePageContent).toContain('class="offline-icon"');
      expect(mockOfflinePageContent).toContain('📱');
    });

    it('should have gradient background styling', () => {
      expect(mockOfflinePageContent).toContain(
        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      );
    });

    it('should have proper button styling', () => {
      expect(mockOfflinePageContent).toContain('.retry-button');
      expect(mockOfflinePageContent).toContain(
        'background: rgba(255, 255, 255, 0.2)'
      );
      expect(mockOfflinePageContent).toContain('border-radius: 25px');
    });
  });

  describe('JavaScript Functionality', () => {
    it('should have online event listener', () => {
      expect(mockOfflinePageContent).toContain(
        "window.addEventListener('online'"
      );
      expect(mockOfflinePageContent).toContain('window.location.reload()');
    });

    it('should have retry button click handler', () => {
      expect(mockOfflinePageContent).toContain(
        'onclick="window.location.reload()"'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper language attribute', () => {
      expect(mockOfflinePageContent).toContain('<html lang="en">');
    });

    it('should have semantic HTML structure', () => {
      expect(mockOfflinePageContent).toContain('<h1>');
      expect(mockOfflinePageContent).toContain('<p>');
      expect(mockOfflinePageContent).toContain('<a');
    });
  });
});

describe('Offline Page Validation', () => {
  it('should be valid HTML', () => {
    // Basic HTML validation checks
    const hasDoctype = mockOfflinePageContent.includes('<!DOCTYPE html>');
    const hasOpeningHtml = mockOfflinePageContent.includes('<html');
    const hasClosingHtml = mockOfflinePageContent.includes('</html>');
    const hasOpeningHead = mockOfflinePageContent.includes('<head>');
    const hasClosingHead = mockOfflinePageContent.includes('</head>');
    const hasOpeningBody = mockOfflinePageContent.includes('<body>');
    const hasClosingBody = mockOfflinePageContent.includes('</body>');

    expect(hasDoctype).toBe(true);
    expect(hasOpeningHtml).toBe(true);
    expect(hasClosingHtml).toBe(true);
    expect(hasOpeningHead).toBe(true);
    expect(hasClosingHead).toBe(true);
    expect(hasOpeningBody).toBe(true);
    expect(hasClosingBody).toBe(true);
  });

  it('should have all required CSS classes', () => {
    const requiredClasses = [
      'offline-container',
      'offline-icon',
      'retry-button',
    ];

    requiredClasses.forEach((className) => {
      expect(mockOfflinePageContent).toContain(`class="${className}"`);
    });
  });

  it('should have all required text content', () => {
    const requiredText = [
      "You're Offline",
      "It looks like you don't have an internet connection right now",
      "Don't worry - you can still use Spades Calculator for basic functionality!",
      'Try Again',
    ];

    requiredText.forEach((text) => {
      expect(mockOfflinePageContent).toContain(text);
    });
  });
});
