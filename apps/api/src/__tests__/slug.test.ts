import { describe, it, expect } from 'vitest'
import { generateSlug } from '@portfolio/utils'

describe('generateSlug', () => {
  it('기본 슬러그 생성', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('특수 문자 제거', () => {
    expect(generateSlug('BandStage!')).toBe('bandstage')
  })

  it('언더스코어를 하이픈으로', () => {
    expect(generateSlug('page_of_artist')).toBe('page-of-artist')
  })

  it('앞뒤 하이픈 제거', () => {
    expect(generateSlug('  -test- ')).toBe('test')
  })

  it('연속 하이픈 단일화', () => {
    expect(generateSlug('hello---world')).toBe('hello-world')
  })

  it('빈 문자열', () => {
    expect(generateSlug('')).toBe('')
  })

  it('한글 포함 시 한글 제거 (영문/숫자만)', () => {
    expect(generateSlug('프로젝트 2024')).toBe('2024')
  })
})
