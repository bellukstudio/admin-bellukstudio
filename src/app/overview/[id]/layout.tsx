import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Belluk Studio",
    description: "Dashboard",
};

const EditOverviewLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default EditOverviewLayout;
