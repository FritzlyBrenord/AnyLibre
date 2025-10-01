import Layout from "@/Component/Layout/Layout";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout showHeaderSearchEtcategory={true}>
        <ServiceByCategory />
      </Layout>
    </div>
  );
};

export default page;
