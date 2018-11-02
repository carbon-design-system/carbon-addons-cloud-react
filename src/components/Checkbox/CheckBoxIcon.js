import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { iconChevronDown } from 'carbon-icons';
import { Icon } from 'carbon-components-react';

export const translationIds = {
  'collapse.group': 'collapse.group',
  'expand.group': 'expand.group',
};

const defaultTranslations = {
  [translationIds['collapse.group']]: 'Collapse group',
  [translationIds['expand.group']]: 'Expand group',
};

const CheckBoxIcon = ({ isExpanded, translateWithId: t }) => {
  const className = cx({
    'bx--list-box__menu-icon': true,
    'bx--list-box__menu-icon--open': isExpanded,
  });
  const description = isExpanded ? t('collapse.group') : t('expand.group');
  return (
    <div className={className} style={{ marginRight: '-18px' }}>
      <Icon
        icon={iconChevronDown}
        description={description}
        alt={description}
      />
    </div>
  );
};

CheckBoxIcon.propTypes = {
  /**
   * Specify whether the group is currently expanded, which will influence the
   * direction of the icon
   */
  isExpanded: PropTypes.bool.isRequired,

  /**
   * i18n hook used to provide the appropriate description for the given
   * icon. This function takes in an id defined in `translationIds` and should
   * return a string message for that given message id.
   */
  translateWithId: PropTypes.func.isRequired,
};

CheckBoxIcon.defaultProps = {
  translateWithId: id => defaultTranslations[id],
};

export default CheckBoxIcon;
