import {fetchData} from '../axios.config'

export async function fetchBlogs(
  page: number,
  limit?: number,
  type?: number,
): Promise<any> {
  // const response = await httpClient.get<any>(`blog?limit=4&page=${page || 1}`);
  const res = await fetchData(
    `blog?limit=${limit ? limit : 4}&page=1${type ? `&type=${type}` : ''}`,
  )

  return res
}

export async function fetchBlogBySlug(slug: string): Promise<any> {
  const res = await fetchData(`blog/.by.slug/${slug}`)
  return res
}
