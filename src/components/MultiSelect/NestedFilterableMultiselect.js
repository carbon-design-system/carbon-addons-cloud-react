import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Downshift from 'downshift';
import isEqual from 'lodash.isequal';
import ListBox from '../ListBox';
import Checkbox from '../Checkbox';
import GroupLabel from '../GroupLabel';
import Selection from '../../internal/Selection';
import { sortingPropTypes } from './MultiSelectPropTypes';
import { defaultItemToString } from './tools/itemToString';
import { groupedByCategory } from './tools/groupedByCategory';
import { defaultSortItems, defaultCompareItems } from './tools/sorting';
import { defaultFilterItems } from './tools/filter';

export default class NestedFilterableMultiselect extends React.Component {
  static propTypes = {
    ...sortingPropTypes,

    /**
     * Disable the control
     */
    disabled: PropTypes.bool,

    /**
     * We try to stay as generic as possible here to allow individuals to pass
     * in a collection of whatever kind of data structure they prefer
     */
    items: PropTypes.array.isRequired,

    /**
     * Allow users to pass in arbitrary items from their collection that are
     * pre-selected
     */
    initialSelectedItems: PropTypes.array,

    /**
     * Helper function passed to downshift that allows the library to render a
     * given item to a string label. By default, it extracts the `label` field
     * from a given item to serve as the item label in the list.
     */
    itemToString: PropTypes.func,

    /**
     * Specify the locale of the control. Used for the default `compareItems`
     * used for sorting the list of items in the control.
     */
    locale: PropTypes.string,

    /**
     * `onChange` is a utility for this controlled component to communicate to a
     * consuming component what kind of internal state changes are occuring.
     */
    onChange: PropTypes.func,

    /**
     * Generic `placeholder` that will be used as the textual representation of
     * what this field is for
     */
    placeholder: PropTypes.string.isRequired,

    /**
     * `true` to use the light version.
     */
    light: PropTypes.bool,
  };

  static defaultProps = {
    compareItems: defaultCompareItems,
    disabled: false,
    filterItems: defaultFilterItems,
    initialSelectedItems: [],
    itemToString: defaultItemToString,
    locale: 'en',
    sortItems: defaultSortItems,
    light: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      isOpen: false,
      inputValue: '',
      openSections: [],
    };
  }

  handleOnChange = changes => {
    if (this.props.onChange) {
      this.props.onChange(changes);
    }
  };

  handleOnChangeSubOption = option => {
    option.checked = !option.checked;
  };

  onToggle = item => {
    !this.state.openSections.includes(item)
      ? this.setState({ openSections: [...this.state.openSections, item] })
      : this.setState(prevState => ({
          openSections: prevState.openSections.filter(
            itemOnState => itemOnState !== item
          ),
        }));
  };

  handleOnToggleMenu = () => {
    this.setState(state => ({
      isOpen: !state.isOpen,
    }));
  };

  handleOnOuterClick = () => {
    this.setState({
      isOpen: false,
    });
  };

  handleOnStateChange = changes => {
    const { type } = changes;
    switch (type) {
      case Downshift.stateChangeTypes.changeInput:
        this.setState({ inputValue: changes.inputValue });
        break;
      case Downshift.stateChangeTypes.keyDownArrowDown:
      case Downshift.stateChangeTypes.keyDownArrowUp:
      case Downshift.stateChangeTypes.itemMouseEnter:
        this.setState({ highlightedIndex: changes.highlightedIndex });
        break;
      case Downshift.stateChangeTypes.keyDownEscape:
      case Downshift.stateChangeTypes.mouseUp:
        this.setState({ isOpen: false });
        break;
      // Opt-in to some cases where we should be toggling the menu based on
      // a given key press or mouse handler
      // Reference: https://github.com/paypal/downshift/issues/206
      case Downshift.stateChangeTypes.clickButton:
      case Downshift.stateChangeTypes.keyDownSpaceButton:
        this.setState(() => {
          let nextIsOpen = changes.isOpen || false;
          if (changes.isOpen === false) {
            // If Downshift is trying to close the menu, but we know the input
            // is the active element in thedocument, then keep the menu open
            if (this.inputNode === document.activeElement) {
              nextIsOpen = true;
            }
          }
          return {
            isOpen: nextIsOpen,
          };
        });
        break;
    }
  };

  handleOnInputKeyDown = event => {
    event.stopPropagation();
  };

  handleOnInputValueChange = inputValue => {
    this.setState(() => {
      if (Array.isArray(inputValue)) {
        return {
          inputValue: '',
        };
      }
      return {
        inputValue: inputValue || '',
      };
    });
  };

  clearInputValue = event => {
    event.stopPropagation();
    this.setState({ inputValue: '' });
    this.inputNode && this.inputNode.focus && this.inputNode.focus();
  };

  handleSelectSubOptions = supOptions => {
    supOptions.map(option => {
      this.handleOnChangeSubOption(option);
    });
  };

  render() {
    const { highlightedIndex, isOpen, inputValue, openSections } = this.state;
    const {
      className: containerClassName,
      disabled,
      filterItems,
      items,
      itemToString,
      initialSelectedItems,
      id,
      locale,
      placeholder,
      sortItems,
      compareItems,
      light,
    } = this.props;
    const className = cx(
      'bx--multi-select',
      'bx--combo-box',
      containerClassName,
      {
        'bx--list-box--light': light,
      }
    );
    return (
      <Selection
        onChange={this.handleOnChange}
        initialSelectedItems={initialSelectedItems}
        render={({ selectedItems, onItemChange, clearSelection }) => (
          <Downshift
            highlightedIndex={highlightedIndex}
            isOpen={isOpen}
            inputValue={inputValue}
            onInputValueChange={this.handleOnInputValueChange}
            itemToString={itemToString}
            onStateChange={this.handleOnStateChange}
            onOuterClick={this.handleOnOuterClick}
            selectedItem={selectedItems}
            render={({
              getButtonProps,
              getInputProps,
              getItemProps,
              getRootProps,
              isOpen,
              inputValue,
              selectedItem,
            }) => (
              <ListBox
                style={{ outline: 'none' }}
                className={className}
                disabled={disabled}
                {...getRootProps({ refKey: 'innerRef' })}>
                <ListBox.Field {...getButtonProps({ disabled })}>
                  {selectedItem.length > 0 && (
                    <ListBox.Selection
                      clearSelection={e => {
                        {
                          selectedItems.forEach(item => {
                            if (item.options) {
                              const myCheckedOptions = item.options.filter(
                                subOption => subOption.checked == true
                              );
                              this.handleSelectSubOptions(myCheckedOptions);
                            }
                          });
                          clearSelection(e);
                        }
                      }}
                      selectionCount={selectedItems.reduce((total, item) => {
                        if (item.options) {
                          return (
                            total +
                            item.options.filter(option => option.checked).length
                          );
                        }
                        return total + 1;
                      }, 0)}
                    />
                  )}
                  <input
                    className="bx--text-input"
                    ref={el => (this.inputNode = el)}
                    {...getInputProps({
                      disabled,
                      id,
                      placeholder,
                      onKeyDown: this.handleOnInputKeyDown,
                    })}
                  />
                  {inputValue && isOpen && (
                    <ListBox.Selection clearSelection={this.clearInputValue} />
                  )}
                  <ListBox.MenuIcon isOpen={isOpen} />
                </ListBox.Field>
                {isOpen && (
                  <ListBox.Menu
                    style={{ maxHeight: '424px', overflowX: 'hidden' }}>
                    {groupedByCategory(items).map((group, index) => {
                      const hasGroups = group[0] !== 'undefined' ? true : false;
                      const filteredItems = filterItems(group[1], {
                        itemToString,
                        inputValue,
                      });
                      let categoryName = '';
                      hasGroups
                        ? (categoryName = group[0].toUpperCase())
                        : null;
                      return (
                        <Fragment>
                          {hasGroups && filteredItems.length > 0 && (
                            <div>
                              <GroupLabel key={index}>
                                {categoryName}
                              </GroupLabel>
                            </div>
                          )}
                          {sortItems(filteredItems, {
                            selectedItems,
                            itemToString,
                            compareItems,
                            locale,
                          }).map(item => {
                            const itemProps = getItemProps({ item });
                            const itemText = itemToString(item);
                            const isChecked =
                              selectedItem.filter(selected =>
                                isEqual(selected, item)
                              ).length > 0;
                            const subOptions = item.options;
                            const groupIsOpen =
                              openSections.filter(groupOpen =>
                                isEqual(groupOpen, item)
                              ).length > 0;

                            const myCheckedOptions = subOptions
                              ? item.options.filter(
                                  subOption => subOption.checked == true
                                )
                              : null;
                            const myUncheckedOptions = subOptions
                              ? item.options.filter(
                                  subOption => subOption.checked != true
                                )
                              : null;

                            const currentParent = item;
                            return (
                              <Fragment>
                                <ListBox.MenuItem
                                  key={itemProps.id}
                                  isActive={isChecked}
                                  onClick={e => {
                                    {
                                      const clickOutOfCheckBox =
                                        subOptions &&
                                        e.target.localName != 'label';
                                      if (clickOutOfCheckBox) {
                                        this.onToggle(item);
                                      } else {
                                        onItemChange(item);
                                        if (subOptions) {
                                          if (
                                            myCheckedOptions.length == 0 &&
                                            !selectedItems.includes(item)
                                          ) {
                                            this.handleSelectSubOptions(
                                              myUncheckedOptions
                                            );
                                          } else {
                                            this.handleSelectSubOptions(
                                              myCheckedOptions
                                            );
                                          }
                                        }
                                      }
                                    }
                                  }}>
                                  <Checkbox
                                    id={itemProps.id}
                                    name={itemText}
                                    checked={isChecked}
                                    indeterminate={
                                      myCheckedOptions &&
                                      myUncheckedOptions &&
                                      myCheckedOptions.length > 0 &&
                                      myUncheckedOptions.length > 0
                                    }
                                    readOnly={true}
                                    tabIndex="-1"
                                    labelText={itemText}
                                    hasGroups={subOptions}
                                    isExpanded={groupIsOpen}
                                  />
                                </ListBox.MenuItem>

                                {groupIsOpen &&
                                  subOptions != undefined &&
                                  sortItems(
                                    filterItems(subOptions, {
                                      itemToString,
                                      inputValue,
                                      parent: item,
                                    }),
                                    {
                                      selectedItems,
                                      itemToString,
                                      compareItems,
                                      locale,
                                      parent: item,
                                    }
                                  ).map((item, index) => {
                                    const optionsProps = getItemProps({ item });
                                    const isCheckedSub = item.checked;
                                    const subOpText = itemToString(item);
                                    const checkBoxIndex = index.toString();
                                    return (
                                      <ListBox.MenuItem
                                        key={index}
                                        style={{ paddingLeft: '35px' }}
                                        isActive={isCheckedSub}
                                        onClick={e => {
                                          {
                                            if (subOptions) {
                                              const onlySupOpChecked =
                                                myCheckedOptions.length == 1 &&
                                                myCheckedOptions.includes(item);
                                              onlySupOpChecked ||
                                              myCheckedOptions.length == 0
                                                ? onItemChange(currentParent)
                                                : null;
                                            }

                                            this.handleOnChangeSubOption(item);
                                            this.handleOnChange({
                                              selectedItems,
                                            });
                                          }
                                        }}>
                                        <Checkbox
                                          id={checkBoxIndex}
                                          name={subOpText}
                                          checked={isCheckedSub}
                                          labelText={subOpText}
                                          readOnly={true}
                                          tabIndex="-1"
                                        />
                                      </ListBox.MenuItem>
                                    );
                                  })}
                              </Fragment>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </ListBox.Menu>
                )}
              </ListBox>
            )}
          />
        )}
      />
    );
  }
}
