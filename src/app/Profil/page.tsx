import Layout from "@/Component/Layout/Layout";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
import FreelancerProfile from "@/Module/Freelance/TableauDeBord/FreelancerProfilPublic";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Layout showHeaderSearchEtcategory={true}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <FreelancerProfile />
        </Suspense>
      </Layout>
    </div>
  );
};

export default page;
