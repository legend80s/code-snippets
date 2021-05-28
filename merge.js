/**
 * @param {Record<string, any>} json
 * @param {Record<string, string | number | (value: string | number | any[], key: string, json: Record<string, any>) => string | number>} patch
 */
exports.merge = (json, patch) => {
  if (!patch) {
    return { ...json };
  }

  return Object.keys(patch).reduce((acc, key) => {
    const value = patch[key];

    const computed = typeof value !== 'function' ?
      value :
      value(json[key], key, json);

    return {
      ...acc,
      [key]: computed,
    }
  }, json);
}


describe('merge', () => {
  it('Should add static version', () => {
    const input = { name: 'foo' };
    const actual = merge(input, { version: '1.0.0' });
    const expected = { name: 'foo', version: '1.0.0' };

    expect(actual).toEqual(expected);
  });

  it('Should overwrite name', () => {
    const input = { name: 'foo' };
    const actual = merge(input, { name: 'bar' });
    const expected = { name: 'bar' };

    expect(actual).toEqual(expected);
  });

  it('Should add version be evaluated by function', () => {
    const input = { name: 'foo' };
    const actual = merge(input, {
      version: (value, key, json) => {
        expect(value).toEqual(undefined);
        expect(key).toEqual('version');
        expect(json).toEqual(input);

        return '2.0.0';
      }
    });

    const expected = { name: 'foo', version: '2.0.0' };

    expect(actual).toEqual(expected);
  });

  it('Should transform to array', () => {
    const input = { name: 'foo', types: 'bar', list: ['baz'] };
    const actual = merge(input, {
      types: (value, key, json) => {
        return [value, 'bar2'];
      },
      list: (value, key, json) => {
        return [...value, 'baz2']
      }
    });

    const expected = {
      name: 'foo',
      types: ['bar', 'bar2'],
      list: ['baz', 'baz2'],
    };

    expect(actual).toEqual(expected);
  });
});
