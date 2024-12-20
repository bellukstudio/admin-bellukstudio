import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Belluk Studio",
    description: "Dashboard",
};

const EditProfileLayout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export default EditProfileLayout;
