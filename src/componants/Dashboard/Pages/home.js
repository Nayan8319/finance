import React from 'react';
import DashTeam from "./HomeInners/dashboard_team";
// import DashBoxes from "./HomeInners/dashboard_boxes";
import DashFeature from "./HomeInners/dashboard_features";
import DashGrowBox from "./HomeInners/dashboard_growbox";
import DashCustomer from "./HomeInners/dashboard_customer";
// import Footer from './HomeInners/footer';

export default function Home() {
  return (
    <>
        <DashGrowBox/>
        <DashCustomer/>
        <DashTeam/>
        <DashFeature/>
    </>
  )
}