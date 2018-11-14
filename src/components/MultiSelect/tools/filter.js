export const defaultFilterItems = (
  items,
  { itemToString, inputValue, parent }
) =>
  items.filter(item => {
    if (!inputValue) {
      return true;
    }
    if (item.options) {
      // if any of the child item matches, the parent item should be shown
      const isMatch =
        item.options.filter(option =>
          itemToString(option)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        ).length > 0;
      if (isMatch) {
        return true;
      }
    }
    if (parent) {
      // if it matches the parent, all sub items should be shown
      const isMatch = itemToString(parent)
        .toLowerCase()
        .includes(inputValue.toLowerCase());
      if (isMatch) {
        return true;
      }
    }
    return itemToString(item)
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  });
