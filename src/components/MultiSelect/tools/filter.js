export const defaultFilterItems = (
  items,
  { itemToString, inputValue, expandedItems }
) =>
  items.filter(item => {
    if (
      item.parentId &&
      expandedItems &&
      !expandedItems.some(expandedItem => expandedItem.id === item.parentId)
    ) {
      // If the parent item is not expanded, the child item should not be shown
      return false;
    }

    if (!inputValue) {
      return true;
    }

    const children = items.filter(
      theItem =>
        theItem.parentId &&
        theItem.parentId === item.id &&
        itemToString(theItem)
          .toLowerCase()
          .includes(inputValue.toLowerCase())
    );
    if (children.length > 0) {
      // if any of the child item matches, the parent item should be shown
      return true;
    }

    if (item.parentId) {
      const parent = items.filter(theItem => theItem.id === item.parentId)[0];
      if (
        parent &&
        itemToString(parent)
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      ) {
        // if it matches the parent, all sub items should be shown
        return true;
      }
    }

    return itemToString(item)
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  });
