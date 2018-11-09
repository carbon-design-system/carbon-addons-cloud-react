import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'carbon-components-react';
import Tag from '../Tag';

export default class TagList extends Component {
  state = {
    showEditIcon: false,
  };

  static propTypes = {
    numTagsDisplayed: PropTypes.number.isRequired,
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
    isEditable: PropTypes.oneOf(['always', 'never', 'on-hover']),
    onIconClick: PropTypes.func,
    counterTagClassName: PropTypes.string,
    maxCharacters: PropTypes.number,
  };

  static defaultProps = {
    isEditable: 'never',
    numTagsDisplayed: 3,
  };

  toggleEditIconShow = () => {
    this.setState({
      showEditIcon: true,
    });
  };

  toggleEditIconHide = () => {
    this.setState({
      showEditIcon: false,
    });
  };

  handleOnIconClick = evt => {
    evt.stopPropagation();
    if (this.props.onIconClick) this.props.onIconClick();
  };

  render() {
    const {
      className,
      numTagsDisplayed,
      isEditable,
      onIconClick,
      tags,
      counterTagClassName,
      maxCharacters,
      ...rest
    } = this.props;

    const limit =
      numTagsDisplayed > tags.length ? tags.length : numTagsDisplayed;

    const displayList = tags.slice(0, limit);

    const overflowCount = tags.length - numTagsDisplayed;

    const tagListClassNames = classNames('bx--tag-list', className);

    const counterTagClassNames = classNames(
      'bx--tag-list--tag-counter',
      counterTagClassName
    );

    return (
      <div
        className={tagListClassNames}
        {...rest}
        onMouseEnter={
          isEditable === 'on-hover' ? this.toggleEditIconShow : undefined
        }
        onMouseLeave={
          isEditable === 'on-hover' ? this.toggleEditIconHide : undefined
        }>
        {displayList.map(tag => (
          <Tag
            key={tag.name}
            className="bx--tag-list--tag"
            type={tag.type}
            title={tag.name}
            maxCharacters={maxCharacters}
            {...tag.otherProps}>
            {tag.name}
          </Tag>
        ))}
        {numTagsDisplayed > 0 && numTagsDisplayed < tags.length && (
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
        {numTagsDisplayed === 0 && (
          <Tag
            type="functional"
            className={counterTagClassNames}
            title={`overflow ${overflowCount}`}>
            {tags.length}
          </Tag>
        )}
        {isEditable === 'always' && (
          <button
            className="bx--tag-list--edit--button"
            onClick={this.handleOnIconClick}>
            <Icon
              name="edit--glyph"
              className="bx--tag-list--edit--icon"
              title="edit icon"
              description="edit icon that can trigger an editable state for the tags in list"
            />
          </button>
        )}
        {isEditable === 'on-hover' && this.state.showEditIcon && (
          <button
            className="bx--tag-list--edit--button"
            onClick={this.handleOnIconClick}>
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
