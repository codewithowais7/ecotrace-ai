import React from 'react';
import PropTypes from 'prop-types';

/**
 * Surface card container with optional header and footer
 */
function Card({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag
      className={[
        'rounded-xl border border-surface-border bg-surface-card p-6',
        'shadow-lg',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

/**
 * Card header sub-component
 */
Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 border-b border-surface-border pb-4 ${className}`}>{children}</div>
  );
};

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
Card.Header.displayName = 'Card.Header';

/**
 * Card footer sub-component
 */
Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 border-t border-surface-border pt-4 ${className}`}>{children}</div>
  );
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
Card.Footer.displayName = 'Card.Footer';

export default Card;
