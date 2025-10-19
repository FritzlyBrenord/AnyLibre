import React from "react";
import Header from "../Header/Header";
import Footer from "../Header/Footer/Footer";
import HeaderAuth from "../Header/HeaderAuth";
import { useAuth } from "@/Context/ContextUser";

interface Props {
  children?: React.ReactNode;
  showHeaderSearchEtcategory?: boolean;
  showFooter?: boolean;
}
const Layout = ({
  children,
  showHeaderSearchEtcategory,
  showFooter = true,
}: Props) => {
  return (
    <div className="overflow-hidden">
      <Header />

      <HeaderAuth />

      {children}

      <div className={`${!showFooter && "hidden"}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
