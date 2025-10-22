import Layout from "@/Component/Layout/FreelanceLayout/Layout";
import ServiceManagement from "@/Module/Freelance/TableauDeBord/ServiceManagement";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <ServiceManagement />
        </Suspense>
      </Layout>
    </div>
  );
};

export default page;
