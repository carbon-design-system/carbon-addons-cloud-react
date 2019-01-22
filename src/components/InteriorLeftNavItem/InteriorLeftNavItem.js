import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const newChild = (children, onFocus, onClick, href) => {
  const child = React.Children.only(children);
  return React.cloneElement(React.Children.only(child), {
    className: 'left-nav-list__item-link',
    onFocus: onFocus,
    onClick: evt => onClick(evt, href),
  });
};

const InteriorLeftNavItem = ({
  className,
  href,
  activeHref,
  onClick,
  tabIndex,
  children,
  label,
  onFocus,
  ...other
}) => {
  const classNames = classnames('left-nav-list__item', className, {
    'left-nav-list__item--active': activeHref === href,
  });

  return (
    <li className={classNames} {...other}>
      {children ? (
        newChild(children, onFocus, onClick, href)
      ) : (
        <a
          className="left-nav-list__item-link"
          href={href}
          onClick={evt => onClick(evt, href)}>
          {label}
        </a>
      )}
    </li>
  );
};

InteriorLeftNavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
  activeHref: PropTypes.string,
  tabIndex: PropTypes.number,
  onClick: PropTypes.func,
  blankTarget: PropTypes.bool,
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
};

InteriorLeftNavItem.defaultProps = {
  activeHref: '#',
  tabIndex: 0,
  label: 'InteriorLeftNavItem Label',
  onClick: /* istanbul ignore next */ () => {},
};

export default InteriorLeftNavItem;
