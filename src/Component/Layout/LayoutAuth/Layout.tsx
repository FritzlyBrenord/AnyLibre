import React from "react";

import { useAuth } from "@/Context/ContextUser";
import HeaderAuth from "@/Component/Header/HeaderAuth";
import Footer from "@/Component/Header/Footer/Footer";

interface Props {
  children?: React.ReactNode;
  showHeaderSearchEtcategory?: boolean;
}
const LayoutAuth = ({ children, showHeaderSearchEtcategory }: Props) => {
  return (
    <div className="overflow-hidden">
      <HeaderAuth />

      {children}

      <Footer />
    </div>
  );
};

export default LayoutAuth;
