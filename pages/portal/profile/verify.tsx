
import { useSelector } from "react-redux";
import { selectAuthState } from "app-store/auth/auth.slice";

import React from "react";
import { AppLayout } from "components/AppLayout";
import VerifyAadhar from "../../../components/user/VerifyAadhaar";

export default function Verify() {
  return (
    <AppLayout>
      <VerifyAadhar></VerifyAadhar>
    </AppLayout>
  );
}
