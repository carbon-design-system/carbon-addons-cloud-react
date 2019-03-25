import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
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

    /**
     * `customCategorySorting` is use to sort the items by category, aphabetic order if not specify
     */
    customCategorySorting: PropTypes.func,

    /**
     * `true` to show tooltip.
     */
    showTooltip: PropTypes.bool,
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
    showTooltip: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      isOpen: false,
      inputValue: '',
      openSections: [],
      checkedSuboptions: [],
    };
  }

  handleOnChange = changes => {
    if (this.props.onChange) {
      this.props.onChange(changes);
    }
  };

  handleOnChangeSubOption = option => {
    if (!option.checked) {
      this.setState(prevState => ({
        checkedSuboptions: [...prevState.checkedSuboptions, option],
      }));
    } else {
      this.setState(prevState => ({
        checkedSuboptions: prevState.checkedSuboptions.filter(
          selectedOption => selectedOption !== option
        ),
      }));
    }
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

  handleOnOuterClick = () => {
    this.setState({
      isOpen: false,
      inputValue: '',
    });
  };

  handleOnStateChange = changes => {
    const { type } = changes;
    switch (type) {
      case Downshift.stateChangeTypes.changeInput:
        this.setState({ inputValue: changes.inputValue });
        break;
      case Downshift.stateChangeTypes.keyDownArrowUp:
      case Downshift.stateChangeTypes.itemMouseEnter:
        this.setState({ highlightedIndex: changes.highlightedIndex });
        break;
      case Downshift.stateChangeTypes.keyDownArrowDown:
        this.setState({
          highlightedIndex: changes.highlightedIndex,
          isOpen: true,
        });
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

  handleOnInputValueChange = debounce((value, { type }) => {
    if (type === Downshift.stateChangeTypes.changeInput) {
      const {
        items,
        initialSelectedItems,
        filterItems,
        itemToString,
      } = this.props;
      const { openSections, inputValue: prevInputValue } = this.state;

      const inputValue = Array.isArray(value) ? prevInputValue : value;
      const itemsToProcess = initialSelectedItems
        ? items.map(
            obj => initialSelectedItems.find(o => o.id === obj.id) || obj
          )
        : items;
      const matchedItems = itemsToProcess.filter(item => {
        if (!item.options || openSections.includes(item) || !inputValue) {
          return false;
        }
        const filteredItems = filterItems(item.options, {
          itemToString,
          inputValue,
        });
        return filteredItems.length > 0;
      });

      const itemsToExpand =
        matchedItems.length > 0
          ? [...openSections, ...matchedItems]
          : openSections;

      this.setState(() => {
        return {
          openSections: itemsToExpand,
          inputValue: inputValue || '',
        };
      });
    }
  }, 200);

  clearInputValue = event => {
    event.stopPropagation();
    this.setState({ inputValue: '' });
    this.inputNode && this.inputNode.focus && this.inputNode.focus();
  };

  getParentItem = item => {
    const { items } = this.props;

    let parent;
    items.some(thisItem => {
      if (thisItem.options && thisItem.options.includes(item)) {
        parent = thisItem;
        return true;
      }
      return false;
    });

    return parent;
  };

  handleSelectSubOptions = supOptions => {
    supOptions.map(option => {
      this.handleOnChangeSubOption(option);
    });
  };

  onItemChange = (item, selectedItems, onItemChange) => {
    const parent = this.getParentItem(item);

    const options = parent ? parent.options : item.options;
    const myCheckedOptions = options
      ? options.filter(subOption => subOption.checked)
      : null;
    const myUncheckedOptions = options
      ? options.filter(subOption => !subOption.checked)
      : null;

    if (parent) {
      this.handleOnChangeSubOption(item);

      const onlySupOpChecked =
        myCheckedOptions.length == 1 && myCheckedOptions.includes(item);
      if (onlySupOpChecked || myCheckedOptions.length == 0) {
        onItemChange(parent);
      } else {
        this.handleOnChange({ selectedItems });
      }
    } else {
      onItemChange(item);
      if (item.options) {
        const includesItem = selectedItems.includes(item);
        if (myCheckedOptions.length == 0 && !includesItem) {
          this.handleSelectSubOptions(myUncheckedOptions);
        } else {
          this.handleSelectSubOptions(myCheckedOptions);
        }
      }
    }
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
      customCategorySorting,
      showTooltip,
    } = this.props;

    const itemsToProcess = initialSelectedItems
      ? items.map(obj => initialSelectedItems.find(o => o.id === obj.id) || obj)
      : items;
    const className = cx(
      'bx--multi-select',
      'bx--combo-box',
      containerClassName,
      {
        'bx--list-box--light': light,
      }
    );

    let currentIndex = -1;
    let highlighted;

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
            onChange={item => {
              this.onItemChange(item, selectedItems, onItemChange);
            }}
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
                className={className}
                disabled={disabled}
                {...getRootProps({ refKey: 'innerRef' })}>
                <ListBox.Field tabIndex="-1" {...getButtonProps({ disabled })}>
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
                    aria-label={placeholder}
                    ref={el => (this.inputNode = el)}
                    {...getInputProps({
                      disabled,
                      id,
                      placeholder,
                      onKeyDown: e => {
                        e.stopPropagation();
                        const highlightedItem = highlighted && highlighted.item;
                        if (highlightedItem) {
                          if (e.which === 40) {
                            // Down arrow
                            if (
                              highlightedItem.options &&
                              !openSections.includes(highlightedItem)
                            ) {
                              this.onToggle(highlightedItem);
                            }
                          } else if (e.which === 38) {
                            // Up arrow
                            const parentItem = this.getParentItem(
                              highlightedItem
                            );
                            if (
                              parentItem &&
                              highlighted.index === 0 &&
                              openSections.includes(parentItem)
                            ) {
                              this.onToggle(parentItem);
                            }
                          }
                        }
                      },
                      onKeyUp: e => {
                        const which = e.which;
                        if (which === 27) {
                          this.setState({ isOpen: false });
                        }
                      },
                    })}
                  />
                  {inputValue && isOpen && (
                    <ListBox.Selection clearSelection={this.clearInputValue} />
                  )}
                  <ListBox.MenuIcon isOpen={isOpen} />
                </ListBox.Field>
                {isOpen && (
                  <ListBox.Menu
                    style={{
                      maxHeight: '424px',
                      overflowX: 'hidden',
                      paddingTop: '8px',
                    }}>
                    {groupedByCategory(
                      itemsToProcess,
                      customCategorySorting
                    ).map((group, index) => {
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
                        <Fragment key={group[0] || index}>
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
                            currentIndex++;

                            if (highlightedIndex === currentIndex) {
                              highlighted = { item, index };
                            }

                            const itemProps = getItemProps({
                              item,
                              index: currentIndex,
                            });
                            const itemText = itemToString(item);

                            const isChecked =
                              selectedItem.filter(
                                selected => selected.id == item.id
                              ).length > 0;
                            const subOptions = item.options;
                            const groupIsOpen =
                              openSections.filter(groupOpen =>
                                isEqual(groupOpen, item)
                              ).length > 0;

                            const myCheckedOptions = subOptions
                              ? item.options.filter(
                                  subOption => subOption.checked
                                )
                              : null;
                            const myUncheckedOptions = subOptions
                              ? item.options.filter(
                                  subOption => !subOption.checked
                                )
                              : null;

                            return (
                              <Fragment key={itemProps.id}>
                                <ListBox.MenuItem
                                  isActive={isChecked}
                                  isHighlighted={
                                    highlightedIndex === currentIndex
                                  }
                                  {...itemProps}
                                  onClick={e => {
                                    {
                                      const clickOutOfCheckBox =
                                        subOptions &&
                                        (e.target.localName !== 'label' &&
                                          e.target.localName !== 'input');
                                      if (clickOutOfCheckBox) {
                                        this.onToggle(item);
                                      } else {
                                        this.onItemChange(
                                          item,
                                          selectedItems,
                                          onItemChange
                                        );
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
                                    tooltipText={showTooltip && itemText}
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
                                    const myIndex = ++currentIndex;

                                    if (highlightedIndex === currentIndex) {
                                      highlighted = { item, index };
                                    }

                                    const optionsProps = getItemProps({
                                      item,
                                      index: currentIndex,
                                    });
                                    const isCheckedSub = myCheckedOptions.includes(
                                      item
                                    );
                                    const subOpText = itemToString(item);
                                    const checkBoxIndex = index.toString();
                                    return (
                                      <ListBox.MenuItem
                                        key={optionsProps.id}
                                        style={{ paddingLeft: '35px' }}
                                        isActive={isCheckedSub}
                                        isHighlighted={
                                          highlightedIndex === myIndex
                                        }
                                        {...optionsProps}
                                        onClick={e => {
                                          this.onItemChange(
                                            item,
                                            selectedItems,
                                            onItemChange
                                          );
                                        }}
                                        onMouseMove={() => {
                                          this.setState({
                                            highlightedIndex: myIndex,
                                          });
                                        }}>
                                        <Checkbox
                                          id={checkBoxIndex}
                                          name={subOpText}
                                          checked={isCheckedSub}
                                          tabIndex="-1"
                                          labelText={subOpText}
                                          tooltipText={showTooltip && subOpText}
                                          readOnly={true}
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
