import Layout from "@/Component/Layout/Layout";
import AuthPage from "@/Module/Authentification/Athentification";
import ServiceByCategory from "@/Module/Client/ServiceByCategory/ServiceByCategory";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <AuthPage />
      </Layout>
    </div>
  );
};

export default page;
