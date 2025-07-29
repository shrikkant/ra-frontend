import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'

import {getFilterByQueryString} from '../util/search.util'
import {IProductCategory, IProductSubCategory} from '../app-store/types'
import {count} from 'console'

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    SOME_VARIABLE_HERE: 'whatever-you-want-here',
  },
}))

describe('getFilterByQueryString ', () => {
  test('city correct slug ', () => {
    const slug = ['pune', 'rent-camera']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual({
      city: 'pune',
      subCategory: 1,
    })
  })

  test('city only ', () => {
    const slug = ['pune']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual({city: 'pune'})
  })

  test('invalid city  ', () => {
    const slug = ['puneasdf']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual(null)
  })

  test('city with invalid sub category ', () => {
    const slug = ['pune', 'camera-123']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual(null)
  })

  test('country, city and subcategory ', () => {
    const slug = ['nz', 'auckland', 'rent-camera']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual({
      country: 'nz',
      city: 'auckland',
      subCategory: 1,
    })
  })

  test(' country, city and ', () => {
    const slug = ['nz', 'auckland']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual({
      country: 'nz',
      city: 'auckland',
    })
  })

  test('invalid country, city and subcategory ', () => {
    const slug = ['us', 'auckland', 'rent-camera']
    const categories: IProductCategory[] = [
      {
        id: 1,
        title: 'Camera',
        slug: 'rent-camera',
        subCategories: [],
      },
    ]
    expect(getFilterByQueryString(slug, categories)).toEqual(null)
  })
})
