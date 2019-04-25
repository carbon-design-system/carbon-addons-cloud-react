/**
 * Use the local `localCompare` with the `numeric` option to sort two,
 * potentially alpha-numeric, strings in a list of items.
 *
 * @param {string} itemA
 * @param {string} itemB
 * @param {Object} options
 * @param {string} options.locale
 * @returns {number}
 */
export const defaultCompareItems = (itemA, itemB, { locale }) =>
  itemA.localeCompare(itemB, locale, {
    numeric: true,
  });

/**
 * Default sorting algorithm for options in a selection control
 */
export const defaultSortItems = (
  items,
  { selectedItems, itemToString, compareItems, locale = 'en' }
) =>
  items.sort((itemA, itemB) => {
    const hasItemA = selectedItems.some(item => item.id === itemA.id);
    const hasItemB = selectedItems.some(item => item.id === itemB.id);

    const parentItemA =
      itemA.parentId && items.filter(item => item.id === itemA.parentId)[0];
    const parentItemB =
      itemB.parentId && items.filter(item => item.id === itemB.parentId)[0];

    if (parentItemA && parentItemB) {
      if (parentItemA !== parentItemB) {
        return compareItems(
          itemToString(parentItemA),
          itemToString(parentItemB),
          {
            locale,
          }
        );
      }
    } else if (parentItemA && !parentItemB) {
      if (parentItemA.id === itemB.parentId) {
        return -1; // always place the child after the parent
      }

      const hasParentItemA = selectedItems.some(
        item => item.id === parentItemA.id
      );
      // Prefer whichever item is in the `selectedItems` array first
      if (hasParentItemA && !hasItemB) {
        return -1;
      } else if (hasItemB && !hasParentItemA) {
        return 1;
      }

      return compareItems(itemToString(parentItemA), itemToString(itemB), {
        locale,
      });
    } else if (!parentItemA && parentItemB) {
      if (parentItemB.id === itemA.parentId) {
        return 1; // always place the child after the parent
      }

      const hasParentItemB = selectedItems.some(
        item => item.id === parentItemB.id
      );
      // Prefer whichever item is in the `selectedItems` array first
      if (hasItemA && !hasParentItemB) {
        return -1;
      } else if (hasParentItemB && !hasItemA) {
        return 1;
      }

      return compareItems(itemToString(itemA), itemToString(parentItemB), {
        locale,
      });
    }

    // Prefer whichever item is in the `selectedItems` array first
    if (hasItemA && !hasItemB) {
      return -1;
    }

    if (hasItemB && !hasItemA) {
      return 1;
    }

    return compareItems(itemToString(itemA), itemToString(itemB), {
      locale,
    });
  });
