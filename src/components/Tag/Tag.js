import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { Icon } from 'carbon-components-react';
import { iconClose } from 'carbon-icons';

const TYPES = {
  functional: 'Functional',
};

export default class Tag extends Component {
  state = {
    removed: false,
  };

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(TYPES)).isRequired,
    isRemovable: PropTypes.bool,
    onRemove: PropTypes.func,
    maxCharacters: PropTypes.number,
  };

  static defaultProps = {
    onRemove: () => {},
    isRemovable: false,
  };

  handleRemove = event => {
    const { onRemove, children } = this.props;
    event.stopPropagation();
    this.setState({
      removed: true,
    });

    if (onRemove) {
      onRemove(children);
    }
  };

  render() {
    const {
      children,
      className,
      type,
      isRemovable,
      maxCharacters,
      onRemove, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    let shortenedName = children;
    if (
      typeof children === 'string' &&
      maxCharacters &&
      children.length > maxCharacters
    ) {
      const shorten = children.substring(0, maxCharacters).trim();
      shortenedName = shorten + '...';
    }
    const tagClasses = classNames({
      'bx--tag': true,
      'cac--tag': true,
      [`bx--tag--${type}`]: true,
      'bx--tag__removed': this.state.removed,
      [className]: className,
    });

    let tagProps = {
      ...other,
      className: tagClasses,
    };

    const closeIcon = (
      <Icon
        className="bx--tag-close cac--tag-close"
        icon={iconClose}
        tabIndex="0"
        role="button"
        description="detach the tag"
        onClick={this.handleRemove}
        onKeyDown={evt => {
          if (evt.which === 13 || evt.which === 32) this.handleRemove(evt);
        }}
      />
    );

    return (
      <span {...tagProps}>
        {shortenedName || TYPES[type]}
        {isRemovable && closeIcon}
      </span>
    );
  }
}

export const types = Object.keys(TYPES);
