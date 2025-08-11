import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('PWA Manifest', () => {
  let manifestContent;

  beforeAll(() => {
    const manifestPath = path.join(__dirname, '../../public/manifest.json');
    manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  });

  describe('File Existence', () => {
    it('should have manifest.json file that exists', () => {
      const manifestPath = path.join(__dirname, '../../public/manifest.json');
      expect(fs.existsSync(manifestPath)).toBe(true);
    });
  });

  describe('Manifest Properties', () => {
    it('should have proper name property', () => {
      expect(manifestContent).toHaveProperty('name', 'Spades Calculator');
    });

    it('should have proper short_name property', () => {
      expect(manifestContent).toHaveProperty('short_name', 'Spades');
    });

    it('should have proper display property', () => {
      expect(manifestContent).toHaveProperty('display', 'standalone');
    });

    it('should have proper start_url property', () => {
      expect(manifestContent).toHaveProperty('start_url', '/');
    });

    it('should have proper theme_color property', () => {
      expect(manifestContent).toHaveProperty('theme_color', '#667eea');
    });

    it('should have proper background_color property', () => {
      expect(manifestContent).toHaveProperty('background_color', '#ffffff');
    });

    it('should have proper scope property', () => {
      expect(manifestContent).toHaveProperty('scope', '/');
    });

    it('should have proper id property', () => {
      expect(manifestContent).toHaveProperty('id', '/');
    });

    it('should have proper orientation property', () => {
      expect(manifestContent).toHaveProperty('orientation', 'portrait-primary');
    });

    it('should have proper categories property', () => {
      expect(manifestContent).toHaveProperty('categories');
      expect(manifestContent.categories).toContain('games');
      expect(manifestContent.categories).toContain('utilities');
    });

    it('should have proper lang property', () => {
      expect(manifestContent).toHaveProperty('lang', 'en');
    });
  });

  describe('Icons', () => {
    it('should have icons array', () => {
      expect(manifestContent).toHaveProperty('icons');
      expect(Array.isArray(manifestContent.icons)).toBe(true);
    });

    it('should have at least one icon', () => {
      expect(manifestContent.icons.length).toBeGreaterThan(0);
    });

    it('should have favicon.ico icon', () => {
      const faviconIcon = manifestContent.icons.find(
        (icon) => icon.src === 'favicon.ico'
      );
      expect(faviconIcon).toBeDefined();
      expect(faviconIcon.sizes).toBe('128x128');
      expect(faviconIcon.purpose).toBe('maskable');
      expect(faviconIcon.type).toBe('image/x-icon');
    });

    it('should have logo192.png icon', () => {
      const logo192Icon = manifestContent.icons.find(
        (icon) => icon.src === 'logo192.png'
      );
      expect(logo192Icon).toBeDefined();
      expect(logo192Icon.sizes).toBe('192x192');
      expect(logo192Icon.purpose).toBe('any maskable');
      expect(logo192Icon.type).toBe('image/png');
    });

    it('should have logo512.png icon', () => {
      const logo512Icon = manifestContent.icons.find(
        (icon) => icon.src === 'logo512.png'
      );
      expect(logo512Icon).toBeDefined();
      expect(logo512Icon.sizes).toBe('512x512');
      expect(logo512Icon.purpose).toBe('any maskable');
      expect(logo512Icon.type).toBe('image/png');
    });
  });

  describe('Icon File Existence', () => {
    it('should have favicon.ico file', () => {
      const faviconPath = path.join(__dirname, '../../public/favicon.ico');
      expect(fs.existsSync(faviconPath)).toBe(true);
    });

    it('should have logo192.png file', () => {
      const logo192Path = path.join(__dirname, '../../public/logo192.png');
      expect(fs.existsSync(logo192Path)).toBe(true);
    });

    it('should have logo512.png file', () => {
      const logo512Path = path.join(__dirname, '../../public/logo512.png');
      expect(fs.existsSync(logo512Path)).toBe(true);
    });
  });
});


