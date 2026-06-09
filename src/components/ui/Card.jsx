/**
 * Generic surface card component — polymorphic via the `as` prop.
 */

import PropTypes from 'prop-types';

/**
 * @param {{
 *   children: React.ReactNode,
 *   className?: string,
 *   as?: 'div'|'section'|'article',
 *   ariaLabel?: string
 * }} props
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
