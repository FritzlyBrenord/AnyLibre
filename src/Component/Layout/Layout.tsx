import React from "react";
import Header from "../Header/Header";
import Footer from "../Header/Footer/Footer";

interface Props {
  children?: React.ReactNode;
  showHeaderSearchEtcategory?: boolean;
}
const Layout = ({ children, showHeaderSearchEtcategory }: Props) => {
  return (
    <div className="overflow-hidden">
      <Header show={true} />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
