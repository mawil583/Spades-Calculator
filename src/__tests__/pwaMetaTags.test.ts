import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PWA Meta Tags', () => {
  let htmlContent: string;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, '../../public/index.html');
    htmlContent = fs.readFileSync(htmlPath, 'utf8');
  });

  describe('File Existence', () => {
    it('should have index.html file that exists', () => {
      const htmlPath = path.join(__dirname, '../../public/index.html');
      expect(fs.existsSync(htmlPath)).toBe(true);
    });
  });

  describe('PWA Meta Tags', () => {
    it('should have theme-color meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="theme-color" content="#667eea" \/>/
      );
    });

    it('should have apple-mobile-web-app-capable meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="apple-mobile-web-app-capable" content="yes" \/>/
      );
    });

    it('should have mobile-web-app-capable meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="mobile-web-app-capable" content="yes" \/>/
      );
    });

    it('should have apple-mobile-web-app-status-bar-style meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="apple-mobile-web-app-status-bar-style" content="default" \/>/
      );
    });

    it('should have apple-mobile-web-app-title meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="apple-mobile-web-app-title" content="Spades Calculator" \/>/
      );
    });

    it('should have msapplication-TileColor meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="msapplication-TileColor" content="#667eea" \/>/
      );
    });

    it('should have msapplication-tap-highlight meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="msapplication-tap-highlight" content="no" \/>/
      );
    });
  });

  describe('Manifest Link', () => {
    it('should have manifest link', () => {
      expect(htmlContent).toMatch(
        /<link rel="manifest" href="%PUBLIC_URL%\/manifest.json" \/>/
      );
    });
  });

  describe('App Icons', () => {
    it('should have apple-touch-icon link', () => {
      expect(htmlContent).toMatch(
        /<link rel="apple-touch-icon" href="%PUBLIC_URL%\/logo192.png" \/>/
      );
    });

    it('should have apple-touch-icon with size 152x152', () => {
      expect(htmlContent).toMatch(
        /<link rel="apple-touch-icon" sizes="152x152" href="%PUBLIC_URL%\/logo192.png" \/>/
      );
    });

    it('should have apple-touch-icon with size 180x180', () => {
      expect(htmlContent).toMatch(
        /<link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%\/logo512.png" \/>/
      );
    });

    it('should have apple-touch-icon with size 167x167', () => {
      expect(htmlContent).toMatch(
        /<link rel="apple-touch-icon" sizes="167x167" href="%PUBLIC_URL%\/logo192.png" \/>/
      );
    });

    it('should have favicon link', () => {
      expect(htmlContent).toMatch(
        /<link rel="icon" href="%PUBLIC_URL%\/favicon.ico" \/>/
      );
    });
  });

  describe('Viewport and Charset', () => {
    it('should have proper viewport meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/
      );
    });

    it('should have proper charset meta tag', () => {
      expect(htmlContent).toMatch(/<meta charset="utf-8" \/>/);
    });
  });

  describe('Description', () => {
    it('should have proper description meta tag', () => {
      expect(htmlContent).toMatch(
        /<meta\s+name="description"\s+content="A comprehensive Spades card game calculator and score tracker\. Track your games, calculate scores, and manage your Spades matches with ease\."\s*\/?>/
      );
    });
  });

  describe('Title', () => {
    it('should have proper title tag', () => {
      expect(htmlContent).toMatch(/<title>Spades Calculator<\/title>/);
    });
  });
});
