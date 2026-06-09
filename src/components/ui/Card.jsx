/**
 * @fileoverview Generic polymorphic surface card component with customizable element type.
 * @module components/ui/Card
 */

import PropTypes from 'prop-types';

/**
 * A styled surface card that renders as any block element via the `as` prop.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.className] - Additional CSS class names
 * @param {'div'|'section'|'article'} [props.as='div'] - HTML element to render as
 * @param {string} [props.ariaLabel] - Accessible label for landmark semantics
 * @returns {JSX.Element} The rendered card element
 */
export default function Card({ children, className, as: Tag = 'div', ariaLabel }) {
  return (
    <Tag
      aria-label={ariaLabel}
      className={`bg-[#16213e] border border-[#0f3460] rounded-xl p-5 ${className ?? ''}`}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.oneOf(['div', 'section', 'article']),
  ariaLabel: PropTypes.string,
};

Card.displayName = 'Card';
