import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

export default class Selection extends React.Component {
  static propTypes = {
    initialSelectedItems: PropTypes.array.isRequired,
  };

  static defaultProps = {
    initialSelectedItems: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: props.initialSelectedItems,
    };
  }

  internalSetState = (stateToSet, callback) =>
    this.setState(stateToSet, () => {
      if (callback) {
        callback();
      }
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    });

  handleClearSelection = () => {
    this.internalSetState({
      selectedItems: [],
    });
  };

  handleSelectItem = item => {
    this.internalSetState(prevState => ({
      selectedItems: [...prevState.selectedItems, item],
    }));
  };

  handleRemoveItem = item => {
    this.internalSetState(prevState => ({
      selectedItems: prevState.selectedItems.filter(
        itemOnState => itemOnState !== item
      ),
    }));
  };

  handleOnItemChange = item => {
    const { selectedItems } = this.state;

    let selectedIndex;
    selectedItems.forEach((selectedItem, index) => {
      if (isEqual(selectedItem, item)) {
        selectedIndex = index;
      }
    });

    if (selectedIndex === undefined) {
      this.handleSelectItem(item);
      return;
    }
    this.handleRemoveItem(item);
  };

  render() {
    const { children, render } = this.props;
    const { selectedItems } = this.state;
    const renderProps = {
      selectedItems,
      onItemChange: this.handleOnItemChange,
      clearSelection: this.handleClearSelection,
    };

    if (render !== undefined) {
      return render(renderProps);
    }

    if (children !== undefined) {
      return children(renderProps);
    }

    return null;
  }
}
