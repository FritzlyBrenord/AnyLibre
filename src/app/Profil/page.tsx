import Layout from "@/Component/Layout/Layout";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
import FreelancerProfile from "@/Module/Freelance/TableauDeBord/FreelancerProfilPublic";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout showHeaderSearchEtcategory={true}>
        <FreelancerProfile />
      </Layout>
    </div>
  );
};

export default page;
