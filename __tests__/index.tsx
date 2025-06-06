import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import Page from '../pages/404'

import {getFilterByQueryString} from '../util/search.util'
import {IProductSubCategory} from '../app-store/types'
import {count} from 'console'

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    SOME_VARIABLE_HERE: 'whatever-you-want-here',
  },
}))

describe('getFilterByQueryString ', () => {
  test('city correct slug ', () => {
    const slug = ['pune', 'rent-camera']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual({
      city: 'pune',
      subCategory: 1,
    })
  })

  test('city only ', () => {
    const slug = ['pune']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual({city: 'pune'})
  })

  test('invalid city  ', () => {
    const slug = ['puneasdf']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual(null)
  })

  test('city with invalid sub category ', () => {
    const slug = ['pune', 'camera-123']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual(null)
  })

  test('country, city and subcategory ', () => {
    const slug = ['nz', 'auckland', 'rent-camera']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual({
      country: 'nz',
      city: 'auckland',
      subCategory: 1,
    })
  })

  test(' country, city and ', () => {
    const slug = ['nz', 'auckland']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual({
      country: 'nz',
      city: 'auckland',
    })
  })

  test('invalid country, city and subcategory ', () => {
    const slug = ['us', 'auckland', 'rent-camera']
    const subCategories: IProductSubCategory[] = [
      {id: 1, title: 'Camera', slug: 'rent-camera'},
    ]
    expect(getFilterByQueryString(slug, subCategories)).toEqual(null)
  })
})
