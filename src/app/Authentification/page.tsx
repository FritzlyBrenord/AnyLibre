import Layout from "@/Component/Layout/Layout";
import AuthPage from "@/Module/Authentification/Athentification";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
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
          <AuthPage />
        </Suspense>
      </Layout>
    </div>
  );
};

export default page;
