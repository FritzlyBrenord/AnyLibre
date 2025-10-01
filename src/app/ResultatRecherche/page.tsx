import Layout from "@/Component/Layout/Layout";
import SearchResultsPage from "@/Module/Client/ResultatRecherche/ResultatRecherche";
import React from "react";

const page = () => {
  return (
    <div>
      <Layout>
        <SearchResultsPage />
      </Layout>
    </div>
  );
};

export default page;
