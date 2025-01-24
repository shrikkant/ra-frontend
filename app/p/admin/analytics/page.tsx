
import React from "react";
import Analytics from "../../../components/admin/Analytics.client";
import OrderAnalytics from "../../../components/admin/OrderAnalytics.client";
import SignupAnalytics from "../../../components/admin/SignupAnalytics.client";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";



export default function Page() {
  return (<>
    <div className="pt-8">

      <TabGroup>
        <TabList>
          <Tab>Top Products</Tab>
          <Tab>Revenue</Tab>
          <Tab>Signups</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Analytics />
          </TabPanel>
          <TabPanel>
            <OrderAnalytics />
          </TabPanel>
          <TabPanel>
            <SignupAnalytics />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </>);
}
