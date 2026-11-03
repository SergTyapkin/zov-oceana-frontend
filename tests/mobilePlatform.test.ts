import { describe, expect, it } from '@jest/globals';
import { detectMobilePlatform } from '../src/utils/utils';

describe('Application download platform selection', () => {
  it('selects Android in Chrome and embedded browsers', () => {
    expect(detectMobilePlatform('Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36')).toBe('android');
    expect(detectMobilePlatform('Mozilla/5.0 (Linux; Android 14) Telegram')).toBe('android');
  });
  it('selects iPhone and iPad', () => {
    expect(detectMobilePlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe('ios');
    expect(detectMobilePlatform('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)')).toBe('ios');
  });
  it('recognizes iPadOS desktop mode without confusing a MacBook', () => {
    expect(detectMobilePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 'MacIntel', 5)).toBe('ios');
    expect(detectMobilePlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 'MacIntel', 0)).toBeNull();
  });
  it('leaves desktop users free to select either platform', () => {
    expect(detectMobilePlatform('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32')).toBeNull();
    expect(detectMobilePlatform('')).toBeNull();
  });
});
