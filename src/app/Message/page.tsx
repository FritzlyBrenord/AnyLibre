import Layout from "@/Component/Layout/Layout";
import BecomeFrelancePage from "@/Module/Freelance/Accueil/AccueilFreelance";
import MessagingInterface from "@/Module/MessagingInterface/MessagingInterface";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <MessagingInterface />
      </Layout>
    </div>
  );
};

export default page;
