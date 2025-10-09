import Layout from "@/Component/Layout/FreelanceLayout/Layout";
import ServiceManagement from "@/Module/Freelance/TableauDeBord/ServiceManagement";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <ServiceManagement />
      </Layout>
    </div>
  );
};

export default page;
