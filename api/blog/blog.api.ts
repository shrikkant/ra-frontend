import {fetchData, fetchDataServer} from '../axios.config'

// Client-side version
export async function fetchBlogs(
  page: number,
  limit?: number,
  type?: number,
): Promise<any> {
  const res = await fetchData(
    `blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`,
  )
  return res
}

// Server-side version
export async function fetchBlogsServer(
  page: number,
  limit?: number,
  type?: number,
): Promise<any> {
  const res = await fetchDataServer(
    `blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`,
  )
  return res
}

export async function fetchBlogBySlug(slug: string): Promise<any> {
  const res = await fetchDataServer(`blog/.by.slug/${slug}`)
  return res
}
