import httpClient from '../axios.config'

export async function fetchBlogs(
  page: number,
  limit?: number,
  type?: number,
): Promise<any> {
  const res = await httpClient.get(
    `blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`,
  )
  return res
}

export async function fetchBlogBySlug(slug: string): Promise<any> {
  const res = await httpClient.get(`blog/.by.slug/${slug}`)
  return res
}
