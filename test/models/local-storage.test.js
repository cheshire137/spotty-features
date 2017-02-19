import LocalStorage from '../../src/models/local-storage'

import mockLocalStorage from '../mocks/local-storage'

describe('LocalStorage', () => {
  beforeEach(() => {
    const store = {}
    mockLocalStorage(store)
  })

  test('fetches saved local values as JSON', () => {
    expect(LocalStorage.getJSON()).toEqual({})
  })

  test('can set and retrieve a value', () => {
    LocalStorage.set('foo', 'bar')
    expect(LocalStorage.get('foo')).toBe('bar')
  })

  test('can check if key has been set', () => {
    expect(LocalStorage.has('foo')).toBe(false)
    LocalStorage.set('foo', 'bar')
    expect(LocalStorage.has('foo')).toBe(true)
  })

  test('can remove a key', () => {
    LocalStorage.set('foo', 'bar')
    expect(LocalStorage.has('foo')).toBe(true)
    LocalStorage.delete('foo')
    expect(LocalStorage.has('foo')).toBe(false)
  })
})
