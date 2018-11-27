import React from 'react';
import PropTypes from 'prop-types';
import ListBoxMenuIcon from './ListBoxMenuIcon';
import ListBoxSelection from './ListBoxSelection';
import childrenOf from '../../prop-types/childrenOf';

/**
 * `ListBoxField` is responsible for creating the containing node for valid
 * elements inside of a field. It also provides a11y-related attributes like
 * `role` to make sure a user can focus the given field.
 */
const ListBoxField = ({ children, tabIndex, ...rest }) => (
  <div
    role="button"
    className="bx--list-box__field"
    tabIndex={tabIndex}
    {...rest}>
    {children}
  </div>
);

ListBoxField.propTypes = {
  children: childrenOf([ListBoxMenuIcon, ListBoxSelection, 'span', 'input']),
  tabIndex: PropTypes.string,
};

ListBoxField.defaultProps = {
  tabIndex: '0',
};

export default ListBoxField;
