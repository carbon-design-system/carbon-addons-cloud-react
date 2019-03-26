import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon, Tooltip } from 'carbon-components-react';
import Tag from '../Tag';

export default class TagList extends Component {
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
    maxCharactersTooltip: PropTypes.number,
    maxTagsTooltip: PropTypes.number,
  };

  static defaultProps = {
    isEditable: 'never',
    numTagsDisplayed: 3,
    maxCharactersTooltip: 15,
    maxTagsTooltip: 8,
  };

  handleOnIconClick = evt => {
    evt.stopPropagation();
    if (this.props.onIconClick) this.props.onIconClick();
  };

  overflowNode = () => {
    const {
      counterTagClassName,
      maxCharactersTooltip,
      maxTagsTooltip,
      numTagsDisplayed,
      tags,
    } = this.props;
    const counterTagClassNames = classNames(
      'bx--tag-list--tag-counter',
      counterTagClassName
    );

    const tooltipTagClassName = 'bx--tag-list--tag-tooltip';

    const overflowCount = tags.length - numTagsDisplayed;

    let overflowCountNode = null;

    if (numTagsDisplayed > 0 && numTagsDisplayed < tags.length) {
      overflowCountNode = (
        <Tag type="functional" className={counterTagClassNames}>
          {`+${overflowCount}`}
        </Tag>
      );
    }

    if (numTagsDisplayed === 0) {
      overflowCountNode = (
        <Tag type="functional" className={counterTagClassNames}>
          {tags.length}
        </Tag>
      );
    }

    if (overflowCountNode !== null) {
      const overflowTags = tags.slice(
        numTagsDisplayed,
        numTagsDisplayed + maxTagsTooltip
      );
      const overflowTagsNode = overflowTags.map(tag => {
        const { name } = tag;
        const tagValue =
          name.length > maxCharactersTooltip
            ? `${name.substring(0, maxCharactersTooltip).trim()}...`
            : name;
        return (
          <div key={name} title={name} className={tooltipTagClassName}>
            {tagValue}
          </div>
        );
      });
      const totalTagsDisplayed = Math.min(
        maxTagsTooltip + numTagsDisplayed,
        tags.length
      );
      const tooltipOverflowCount = tags.length - totalTagsDisplayed;
      overflowCountNode = (
        <Tooltip
          className="bx--cell--tooltip"
          showIcon={false}
          triggerText={overflowCountNode}
          tabIndex={0}>
          {overflowTagsNode}
          {tooltipOverflowCount === 0 ? (
            undefined
          ) : (
            <div
              className={tooltipTagClassName}
              title={`${tooltipOverflowCount} more ${
                tooltipOverflowCount === 1 ? 'tag' : 'tags'
              }`}>
              {`(+${tooltipOverflowCount})`}
            </div>
          )}
        </Tooltip>
      );
    }

    return overflowCountNode;
  };

  render() {
    const {
      className,
      counterTagClassName,
      numTagsDisplayed,
      isEditable,
      onIconClick,
      tags,
      maxCharacters,
      maxCharactersTooltip,
      maxTagsTooltip,
      ...rest
    } = this.props;

    const limit =
      numTagsDisplayed > tags.length ? tags.length : numTagsDisplayed;

    const displayList = tags.slice(0, limit);

    const tagListClassNames = classNames(
      'bx--tag-list',
      { 'bx--tag-list-editable': isEditable !== 'never' },
      className
    );

    const editButtonClasses = classNames({
      'bx--tag-list--edit--button': true,
      'always-editable': isEditable === 'always',
      'never-editable': isEditable === 'never',
    });

    return (
      <div
        className={tagListClassNames}
        onClick={this.handleOnIconClick}
        {...rest}>
        {displayList.map(tag => (
          <Tag
            key={tag.name}
            className="bx--tag-list--tag"
            tabIndex="0"
            type={tag.type}
            title={tag.name}
            maxCharacters={maxCharacters}
            {...tag.otherProps}>
            {tag.name}
          </Tag>
        ))}
        {this.overflowNode()}
        {
          <button className={editButtonClasses}>
            <Icon
              name="edit--glyph"
              className="bx--tag-list--edit--icon"
              title="edit icon"
              description="click to edit tags"
            />
          </button>
        }
      </div>
    );
  }
}
