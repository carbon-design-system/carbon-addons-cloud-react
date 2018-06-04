import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'carbon-components-react';
import Tag from '../Tag';

export default class TagList extends Component {
  static propTypes = {
    condense: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['functional', '...']).isRequired,
        otherProps: PropTypes.objectOf(
          PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
            PropTypes.node,
            PropTypes.func,
          ]).isRequired
        ),
      })
    ).isRequired,
    className: PropTypes.string,
    isEditable: PropTypes.bool,
    onIconClick: PropTypes.func,
    sort: PropTypes.func,
    counterTagClassName: PropTypes.string,
  };

  static defaultProps = {
    sort: () => {},
    isEditable: false,
    condense: 0,
  };

  render() {
    const {
      className,
      condense,
      isEditable,
      onIconClick,
      sort,
      tags,
      counterTagClassName,
      ...rest
    } = this.props;

    const sortedTags = tags.sort(sort);

    const limit = condense > sortedTags.length ? sortedTags.length : condense;

    const displayList = sortedTags.slice(0, sortedTags.length - limit);

    const tagListClassNames = classNames('bx--tag-list', className);

    const counterTagClassNames = classNames(
      'bx--tag-list--tag-counter',
      counterTagClassName
    );

    return (
      <div className={tagListClassNames} {...rest}>
        {displayList.map(tag => (
          <Tag
            key={tag.name}
            className="bx--tag-list--tag"
            type={tag.type}
            {...tag.otherProps}>
            {tag.name}
          </Tag>
        ))}
        {condense > 0 &&
          condense < sortedTags.length && (
            <Tag type="functional" className={counterTagClassNames}>
              <Icon
                name="add"
                className="bx--tag-list--tag-counter--icon"
                title="add icon"
                description="add icon used to indicate additional condensed tags"
              />
              {condense}
            </Tag>
          )}
        {condense >= tags.length && (
          <Tag type="functional" className={counterTagClassNames}>
            {tags.length}
          </Tag>
        )}
        {isEditable && (
          <button className="bx--tag-list--edit--button" onClick={onIconClick}>
            <Icon
              name="edit--glyph"
              className="bx--tag-list--edit--icon"
              title="edit icon"
              description="edit icon that can trigger an editable state for the tags in list"
            />
          </button>
        )}
      </div>
    );
  }
}
