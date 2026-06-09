import { useEffect, useCallback } from 'react';

/**
 * Hook providing accessibility helpers:
 * - Trap focus within a container (for modals)
 * - Announce messages to screen readers
 * - Skip-link management
 */

/**
 * Announce a message to screen readers via an ARIA live region
 * @param {string} message
 * @param {'polite'|'assertive'} [politeness='polite']
 */
export function announceToScreenReader(message, politeness = 'polite') {
  const existing = document.getElementById('ecotrace-live-region');
  const el = existing || document.createElement('div');

  if (!existing) {
    el.id = 'ecotrace-live-region';
    el.setAttribute('aria-live', politeness);
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText =
      'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(el);
  } else {
    el.setAttribute('aria-live', politeness);
  }

  // Clear then set to trigger re-announcement
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = message;
  });
}

/**
 * Hook to trap focus within a ref element while active
 * @param {React.RefObject} containerRef
 * @param {boolean} isActive
 */
export function useFocusTrap(containerRef, isActive) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown);
    first?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}

/**
 * Hook to restore focus to a trigger element when a modal/popover closes
 * @param {boolean} isOpen
 * @returns {Function} - call this to save the current focus target
 */
export function useRestoreFocus(isOpen) {
  const saveFocus = useCallback(() => {
    return document.activeElement;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement;
    return () => {
      trigger?.focus();
    };
  }, [isOpen]);

  return saveFocus;
}

/**
 * Hook providing all accessibility utilities together
 */
export function useAccessibility() {
  return {
    announce: announceToScreenReader,
    useFocusTrap,
    useRestoreFocus,
  };
}
