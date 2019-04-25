import { defaultSortItems, defaultCompareItems } from '../sorting';

describe('defaultSortItems', () => {
  let mockItemToString;
  let mockOptions;

  beforeEach(() => {
    mockItemToString = jest.fn(({ label }) => label);
    mockOptions = {
      selectedItems: [],
      itemToString: mockItemToString,
      compareItems: defaultCompareItems,
      locale: 'en',
    };
  });

  it('should sort un-selected options alphabetically', () => {
    const mockItems = ['d', 'c', 'b', 'a'].map(label => ({ id: label, label }));
    expect(defaultSortItems(mockItems, mockOptions)).toEqual([
      {
        id: 'a',
        label: 'a',
      },
      {
        id: 'b',
        label: 'b',
      },
      {
        id: 'c',
        label: 'c',
      },
      {
        id: 'd',
        label: 'd',
      },
    ]);
  });

  it('should sort un-selected numbers in increasing order', () => {
    const mockItems = ['1', '10', '11', '2', '3'].map(label => ({
      id: label,
      label,
    }));
    expect(defaultSortItems(mockItems, mockOptions)).toEqual([
      {
        id: '1',
        label: '1',
      },
      {
        id: '2',
        label: '2',
      },
      {
        id: '3',
        label: '3',
      },
      {
        id: '10',
        label: '10',
      },
      {
        id: '11',
        label: '11',
      },
    ]);
  });

  it('should sort un-selected alpha-numeric sequences with increasing order', () => {
    const mockItems = ['Option 1', 'Option 10', 'Option 11', 'Option 2'].map(
      label => ({ id: label, label })
    );
    expect(defaultSortItems(mockItems, mockOptions)).toEqual([
      {
        id: 'Option 1',
        label: 'Option 1',
      },
      {
        id: 'Option 2',
        label: 'Option 2',
      },
      {
        id: 'Option 10',
        label: 'Option 10',
      },
      {
        id: 'Option 11',
        label: 'Option 11',
      },
    ]);
  });

  it('should order a selected item before all other options', () => {
    const mockItems = ['Option 1', 'Option 10', 'Option 11', 'Option 2'].map(
      label => ({ id: label, label })
    );

    // Set `selectedItems` to ['Option 11']
    mockOptions.selectedItems = [mockItems[2]];

    expect(defaultSortItems(mockItems, mockOptions)).toEqual([
      {
        id: 'Option 11',
        label: 'Option 11',
      },
      {
        id: 'Option 1',
        label: 'Option 1',
      },
      {
        id: 'Option 2',
        label: 'Option 2',
      },
      {
        id: 'Option 10',
        label: 'Option 10',
      },
    ]);
  });

  it('should sort selected items and order them before all other options', () => {
    const mockItems = ['Option 1', 'Option 10', 'Option 11', 'Option 2'].map(
      label => ({ id: label, label })
    );

    // Set `selectedItems` to ['Option 11', 'Option 2']
    mockOptions.selectedItems = [mockItems[2], mockItems[3]];

    expect(defaultSortItems(mockItems, mockOptions)).toEqual([
      {
        id: 'Option 2',
        label: 'Option 2',
      },
      {
        id: 'Option 11',
        label: 'Option 11',
      },
      {
        id: 'Option 1',
        label: 'Option 1',
      },
      {
        id: 'Option 10',
        label: 'Option 10',
      },
    ]);
  });
});
