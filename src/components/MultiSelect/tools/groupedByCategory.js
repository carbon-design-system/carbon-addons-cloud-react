function Comparator(a, b) {
  return a[0].localeCompare(b[0]);
}
export const groupedByCategory = items => {
  const result = items.reduce((groupedArray, currentItem) => {
    groupedArray[currentItem.category] =
      groupedArray[currentItem.category] || [];
    groupedArray[currentItem.category].push(currentItem);
    return groupedArray;
  }, Object.create(null));

  var finalResult = Object.entries(result);
  finalResult.sort(Comparator);

  return finalResult;
};
