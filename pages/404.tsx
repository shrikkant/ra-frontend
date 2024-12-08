import { Content } from 'antd/lib/layout/layout'

import React from 'react'



// export async function getStaticProps(context) {
//   return {
//     notFound: true, // triggers 404
//   };
// }

export default function Custom404() {

  return (
    <Content>
      <div className="h-screen flex justify-center flex-col items-center">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      </div>
    </Content>
  )
}
