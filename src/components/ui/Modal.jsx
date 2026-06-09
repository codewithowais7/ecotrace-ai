import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFocusTrap } from '../../hooks/useAccessibility';
import Button from './Button';

/**
 * Accessible modal dialog with focus trap and keyboard dismiss
 */
function Modal({ isOpen, onClose, title, children, size = 'md', className = '' }) {
  const containerRef = useRef(null);
  useFocusTrap(containerRef, isOpen);

  const widths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={containerRef}
        className={[
          'relative w-full rounded-2xl border border-surface-border bg-surface-card shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          widths[size] || widths.md,
          className,
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border p-5">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ✕
            </span>
          </Button>
        </div>

        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Modal;
