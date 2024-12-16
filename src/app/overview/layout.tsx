import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Belluk Studio",
    description: "Dashboard",
};

const OverviewLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default OverviewLayout;