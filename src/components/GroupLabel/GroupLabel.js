import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

/*const categoryLabel = {
  color: '#8897A2',
  fontSize: '12px',
  fontFamily: 'ibm plex Sans',
  fontWeight: '700',
  letterSpacing: '0.2px',
  margin: '8px',
};*/

const GroupLabel = ({ className, children, id, ...other }) => {
  const classNames = classnames('bx--group-label', className);

  return (
    <label htmlFor={id} className="bx--group-label" {...other}>
      {children}
    </label>
  );
};

GroupLabel.propTypes = {
  /**
   * Specify the content of the form label
   */
  children: PropTypes.node,

  /**
   * Provide a custom className to be applied to the containing <label> node
   */
  className: PropTypes.string,

  /**
   * Provide a unique id for the given <GroupLabel>
   */
  id: PropTypes.string,
};

export default GroupLabel;
