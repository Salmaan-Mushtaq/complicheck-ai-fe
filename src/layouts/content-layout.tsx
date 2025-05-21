// src/components/layout/content-layout.tsx
import { Outlet } from "@tanstack/react-router";
import { Suspense } from "react";

import { Loading } from "@/components/loading";

interface ContentLayoutProps {
	children?: React.ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => (
	<Suspense fallback={<Loading />}>{children || <Outlet />}</Suspense>
);
