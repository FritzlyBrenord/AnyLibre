import Layout from "@/Component/Layout/Layout";
import AccueilClient from "@/Module/AccueilClient/AccueilClient";

import React from "react";

const page = () => {
  return (
    <div>
      <Layout showHeaderSearchEtcategory={true}>
        <AccueilClient />
      </Layout>
    </div>
  );
};

export default page;
