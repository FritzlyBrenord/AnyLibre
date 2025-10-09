import Layout from "@/Component/Layout/FreelanceLayout/Layout";
import UserProfile from "@/Module/Freelance/TableauDeBord/UserProfile";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <UserProfile />
      </Layout>
    </div>
  );
};

export default page;
