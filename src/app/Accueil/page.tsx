import Layout from "@/Component/Layout/Layout";
import LayoutAuth from "@/Component/Layout/LayoutAuth/Layout";
import AccueilClient from "@/Module/AccueilClient/AccueilClient";

import React from "react";

const page = () => {
  return (
    <div>
      <LayoutAuth>
        <AccueilClient />
      </LayoutAuth>
    </div>
  );
};

export default page;
