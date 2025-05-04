import React, {Suspense} from 'react'

import UserCart from '../../components/user/orders/UserCart.client'
import Loader from '../../../components/Loader'

export default async function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <UserCart />
    </Suspense>
  )
}
