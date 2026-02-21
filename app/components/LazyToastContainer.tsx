'use client'
import dynamic from 'next/dynamic'
import 'react-toastify/dist/ReactToastify.css'

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  {ssr: false},
)

export default function LazyToastContainer() {
  return <ToastContainer position="bottom-right" autoClose={3000} />
}
