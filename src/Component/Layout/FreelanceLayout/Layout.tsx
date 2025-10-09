import Header from "@/Module/Freelance/Header/Header";
import React from "react";

interface Props {
  children?: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <div className="overflow-hidden">
      <Header />

      {children}
    </div>
  );
};

export default Layout;
