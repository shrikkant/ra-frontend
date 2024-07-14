import React from "react";
import { Footer } from "antd/lib/layout/layout";
import Scripts from "./common/Scripts";

export function AppFooter() {

    return (<>
        <Scripts />
        <Footer style={{ textAlign: 'center' }}>
            RentAcross ©2018 Created by The UI Studio
        </Footer>
    </>
    )
}
