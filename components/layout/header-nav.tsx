import { auth } from "@clerk/nextjs/server";
import Header from "./header";

export default async function HeaderNav() {
  const { userId } = await auth();
  const adminId = process.env.ADMIN_USER_ID!;
  const isAdmin = userId === adminId;

  return <Header isAdmin={isAdmin} isLoggedIn={!!userId} />;
}