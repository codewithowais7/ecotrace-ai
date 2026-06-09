/**
 * @fileoverview Accessible modal dialog with focus trap, Escape dismissal, and scroll lock.
 * @module components/ui/Modal
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const TITLE_ID = 'modal-title';

/**
 * Accessible modal dialog with focus trapping, Escape key dismissal,
 * backdrop click-to-close, and body scroll locking.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Called when the modal should close
 * @param {string} props.title - Accessible title text (rendered in h2)
 * @param {React.ReactNode} props.children - Modal body content
 * @returns {JSX.Element | null} The rendered modal or null when closed
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const contentRef = useRef(null);

  // ── Escape key listener ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ── Focus trap + scroll lock ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusable = contentRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
    if (focusable.length > 0) focusable[0].focus();

    // Tab / Shift+Tab trap
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      const elements = contentRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal content */}
      <div
        ref={contentRef}
        role="document"
        className="relative bg-[#16213e] rounded-xl border border-[#0f3460] max-w-lg w-full mx-4 p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id={TITLE_ID} className="text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-white rounded p-1 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition-colors"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Modal.displayName = 'Modal';
