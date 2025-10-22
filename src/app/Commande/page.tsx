import CheckoutPage from "@/Module/Client/PageCommande/CheckoutPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
      >
        <CheckoutPage />
      </Suspense>
    </div>
  );
};

export default page;
