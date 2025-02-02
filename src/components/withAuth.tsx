"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/hook";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    React.useEffect(() => {
      const cookie = document.cookie;
      const isVerified = cookie.includes("isVerified=true");
      if (!isVerified) {
        router.push("/pages/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
