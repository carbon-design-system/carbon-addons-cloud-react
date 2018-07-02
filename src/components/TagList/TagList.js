import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'carbon-components-react';
import Tag from '../Tag';

export default class TagList extends Component {
  static propTypes = {
    maxTagsDisplayed: PropTypes.number.isRequired,
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
    counterTagClassName: PropTypes.string,
  };

  static defaultProps = {
    isEditable: false,
    maxTagsDisplayed: 3,
  };

  render() {
    const {
      className,
      maxTagsDisplayed,
      isEditable,
      onIconClick,
      tags,
      counterTagClassName,
      ...rest
    } = this.props;

    const limit =
      maxTagsDisplayed > tags.length ? tags.length : maxTagsDisplayed;

    const displayList = tags.slice(0, limit);

    const overflowCount = tags.length - maxTagsDisplayed;

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
            title={tag.name}
            {...tag.otherProps}>
            {tag.name}
          </Tag>
        ))}
        {maxTagsDisplayed > 0 &&
          maxTagsDisplayed < tags.length && (
            <Tag
              type="functional"
              className={counterTagClassNames}
              description="overflow"
              title={`overflow ${overflowCount}`}>
              <Icon
                name="add"
                className="bx--tag-list--tag-counter--icon"
                title="add icon"
                description="add icon used to indicate additional tags"
              />
              {overflowCount}
            </Tag>
          )}
        {maxTagsDisplayed === 0 && (
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
