import { findBy } from '../toolbox.util';

describe('fuzzyFind', () => {
  const data = [
    { name: 'Alice', age: 30, city: 'New York' },
    { name: 'Bob', age: 25, city: 'Los Angeles' },
    { name: 'Charlie', age: 35, city: 'Chicago' },
  ];

  it('should return objects that match the search string in any key', () => {
    const result = findBy(data, 'Alice');
    expect(result).toEqual([{ name: 'Alice', age: 30, city: 'New York' }]);
  });

  it('should return objects that match the search string in any value', () => {
    const result = findBy(data, '30');
    expect(result).toEqual([{ name: 'Alice', age: 30, city: 'New York' }]);
  });

  it('should return objects that match the search string case-insensitively', () => {
    const result = findBy(data, 'alice');
    expect(result).toEqual([{ name: 'Alice', age: 30, city: 'New York' }]);
  });

  it('should return multiple objects if they match the search string', () => {
    const result = findBy(data, 'arlie');
    expect(result).toEqual([
      { name: 'Alice', age: 30, city: 'New York' },
      { name: 'Charlie', age: 35, city: 'Chicago' },
    ]);
  });

  it('should return an empty array if no objects match the search string', () => {
    const result = findBy(data, 'xyz');
    expect(result).toEqual([]);
  });
});
