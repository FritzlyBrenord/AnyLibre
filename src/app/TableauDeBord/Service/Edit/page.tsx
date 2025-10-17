import Layout from "@/Component/Layout/FreelanceLayout/Layout";
import EditService from "@/Module/Freelance/TableauDeBord/EditService";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <EditService />
      </Layout>
    </div>
  );
};

export default page;
