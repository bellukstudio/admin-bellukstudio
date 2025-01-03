"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components-theme/common/Loader";
import { AuthProvider } from "@/core/context/authContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>{loading ? <Loader /> : children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
