/**
 * Custom hook providing accessibility helpers for EcoTrace AI.
 * Currently exposes a screen-reader announcement utility via an ARIA live region.
 */

/**
 * Provides accessibility utilities for announcing dynamic content changes
 * to assistive technologies.
 *
 * @returns {{
 *   announceToScreenReader: (message: string, politeness?: 'polite' | 'assertive') => void
 * }}
 */
export function useAccessibility() {
  /**
   * Announce a message to screen readers by injecting it into an ARIA live region.
   * The live region element is created once and reused on subsequent calls.
   * A brief timeout ensures the DOM update triggers a re-announcement even when
   * the message text is identical to the previous one.
   *
   * @param {string} message - The text to announce.
   * @param {'polite' | 'assertive'} [politeness='polite']
   *   'polite' waits for the user to be idle; 'assertive' interrupts immediately.
   */
  function announceToScreenReader(message, politeness = 'polite') {
    let liveRegion = document.getElementById('sr-announcer');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-announcer';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    } else {
      // Update politeness in case caller changes it between announcements
      liveRegion.setAttribute('aria-live', politeness);
    }

    // Clear first so identical messages still trigger a change event
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  return { announceToScreenReader };
}
