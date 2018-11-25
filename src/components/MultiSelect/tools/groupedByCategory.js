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

  const finalResult = Object.keys(result).reduce((array, key) => {
    const elementArr = [key, result[key]];
    array.push(elementArr);
    return array;
  }, []);
  finalResult.sort(Comparator);

  return finalResult;
};
