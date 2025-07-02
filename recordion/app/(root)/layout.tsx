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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

    export async function middleware(request: NextRequest, response: NextResponse) {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if(!session) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
    
        return NextResponse.next();
    }

const Layout = async ({ children }: { children: ReactNode }) => {
  /*const session = await auth.api.getSession({
    headers: await headers(), // ✅ Await headers() to get the Headers object
  });

  if (!session) {
    redirect("/sign-in");
  }*/

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
