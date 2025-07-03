/*import React from "react";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";


const Layout = ({children}: {children: ReactNode}) => {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}

export default Layout*/

import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const Layout = async ({ children }: { children: ReactNode }) => {

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
