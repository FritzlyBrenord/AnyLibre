import Layout from "@/Component/Layout/FreelanceLayout/Layout";
import OrderManagement from "@/Module/Freelance/TableauDeBord/OrderManagement";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <OrderManagement />
      </Layout>
    </div>
  );
};

export default page;
