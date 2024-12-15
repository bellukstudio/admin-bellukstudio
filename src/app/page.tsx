import { Metadata } from "next";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title:
    "Belluk Studio",
  description: "",
};

export default function Home() {
  return (
      <SignIn />
  );
}
