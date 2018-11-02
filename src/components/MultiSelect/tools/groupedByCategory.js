export const groupedByCategory = items => {
  const result = items.reduce((groupedArray, currentItem) => {
    groupedArray[currentItem.category] =
      groupedArray[currentItem.category] || [];
    groupedArray[currentItem.category].push(currentItem);
    return groupedArray;
  }, Object.create(null));
  return Object.entries(result);
};
