import React from 'react'
import PageContainer from '../../components/common/PageContainer'
import {PageTitle} from '../../components/common/PageTitle'

export default async function Page() {
  return (
    <>
      <PageTitle title="Return & Refund Policy" />
      <section className="s-news">
        <PageContainer>
          <div>
            <div className="pt-3">
              <b> 1. Can I return items at the time of delivery?</b>
            </div>
            <div>
              We make sure all the products are new or almost new when they
              reach you without compromising on quality. There are a series of
              stringent quality checks that are undertaken on every Product
              before delivery. However, if you don’t like the products at the
              time of delivery, you can return them - there will be no questions
              asked. If accepted by you or your representative (anyone receiving
              the order on your behalf) at the time of delivery, the products
              cannot be returned later. Only items with major defects or
              non-functionality will be taken back. Since the dimensions for all
              products are mentioned on the website, we will not be able to
              accept any returns based on that criteria. However, some genuine
              issues can be discussed over a call and we might take items back,
              but only if pointed out at the time of delivery. Unfortunately,
              returns cannot be initiated once the delivery is accepted by you
              or your representatives. To ensure that you face no issues
              regarding this, RentAcross team will leave your premises only when
              you are satisfied with the order.
            </div>

            <div className="pt-1">
              <b>2. How would I get my refundable deposit back?</b>
            </div>
            <div>
              If a clean chit is provided based on the QC report and all your
              dues towards RentAcross have been cleared, the whole amount of
              refundable deposit will be transferred to account from where
              initial deposit was received. The mode of payment would be NEFT &
              would be credited to the account within 7 working days. NEFT
              Details shared should be under the name of the Customer on whose
              name the order was placed. In case the customer wants money in a
              different account, the requisite account details need to be
              communicated via email from the registered email id through which
              the order was placed. A written confirmation will also be required
              at the time of return pick up after which RentAcross will not be
              liable for further claims. Please make sure that the account
              details for the transfer are shared with RetAcross. In case of any
              damage, the products will undergo further inspection at
              RentAcross’s premises to ascertain the damage cost. This damage
              cost will then be mitigated from the refundable deposit paid by
              you.
            </div>
            <div className="pt-1">
              <b>3. What if I cancel my order before delivery?</b>
            </div>
            <div>
              If you choose to cancel the order, before the product is shipped
              or picked up by you, you will be entitled to a 100% refund.
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  )
}
