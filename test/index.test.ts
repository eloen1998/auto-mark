import { describe, expect, it } from 'vitest'
import { replace } from '../src/replace'

describe('should', () => {
  it('exported', () => {
    expect(replace('1', '2')).toEqual(undefined)
  })
  it('exported', () => {
    expect(replace('1', '，')).toEqual(',')
  })
  it('exported', () => {
    expect(replace('汉', '，')).toEqual(undefined)
  })
  // it('exported', () => {
  //   expect(replace('，', '，')).toEqual(undefined)
  // })
  it('exported', () => {
    expect(replace('d', '；')).toEqual(';')
  })
})
