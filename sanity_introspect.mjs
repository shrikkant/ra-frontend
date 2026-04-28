import { createClient } from 'next-sanity'
const client = createClient({ projectId: '6y25plyx', dataset: 'production', apiVersion: '2024-01-01', useCdn: false })
const post = await client.fetch(`*[_type=="post"][0]{_id,title,slug,short_desc,body,publishedAt,image,author->{_id,name},categories[]->{_id,title,slug}}`)
const cats = await client.fetch(`*[_type=="category"]{_id,title,slug}`)
const authors = await client.fetch(`*[_type=="author"]{_id,name,slug}`)
console.log('SAMPLE POST:', JSON.stringify(post, null, 2).slice(0,3000))
console.log('\nCATEGORIES:', JSON.stringify(cats, null, 2))
console.log('\nAUTHORS:', JSON.stringify(authors, null, 2))
