"use client"
import MyPageHeader from "components/MyPageHeader";

import React, { useEffect, useState } from "react";

import { fetchSignupAnalytics } from "../../../api/admin/analytics.api";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function SignupAnalytics() {

  const [analytics, setAnalytics] = useState<any[] | undefined>(undefined);

  const fetchData = async () => {
    const response = await fetchSignupAnalytics();
    console.log(response);
    setAnalytics(response);
  };

  useEffect(() => {
    if (!analytics) {
      fetchData();
    }
  }, [analytics]);


  return (
    <>
      <MyPageHeader title={"Signups"}>

      </MyPageHeader>
      {analytics &&
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analytics}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis yAxisId={0} />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="2023" stroke="#387300" yAxisId={0} />
              <Line type="monotone" dataKey="2024" stroke="#ff7300" yAxisId={0} />
              <Line type="monotone" dataKey="2025" stroke="#387908" yAxisId={0} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      }
    </>);
}
