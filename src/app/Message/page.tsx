import Layout from "@/Component/Layout/Layout";
import BecomeFrelancePage from "@/Module/Freelance/Accueil/AccueilFreelance";
import MessagingInterface from "@/Module/MessagingInterface/MessagingInterface";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Layout showFooter={false}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }
        >
          <MessagingInterface />
        </Suspense>
      </Layout>
    </div>
  );
};

export default page;
