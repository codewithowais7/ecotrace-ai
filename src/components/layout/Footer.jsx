/**
 * @fileoverview Application footer with attribution, data source citation, and copyright.
 * @module components/layout/Footer
 */

/**
 * Sticky application footer with attribution and emission data source references.
 *
 * @returns {JSX.Element} The rendered footer element
 */
export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto py-6 text-center text-slate-400 text-sm border-t border-[#0f3460]"
    >
      <p>
        Made with <span aria-label="love">💚</span> for the planet · EcoTrace AI ·{' '}
        {new Date().getFullYear()}
      </p>
      <p className="text-xs mt-1">Emission factors: IPCC AR6, EPA, CEA India 2023</p>
    </footer>
  );
}

Footer.displayName = 'Footer';

