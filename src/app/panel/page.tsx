import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  verificarTokenSesion,
} from "@/lib/session";

import ConsultaPasajesClient from "./ConsultaPasajesClient";

export default async function PanelPage() {

  const cookieStore =
    await cookies();

  const sessionCookie =
    cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }

  const session =
    await verificarTokenSesion(
      sessionCookie.value
    );

  if (!session) {
    redirect("/login");
  }

  const login =
    typeof session.payload.login ===
    "string"
      ? session.payload.login
      : "";

  return (
    <ConsultaPasajesClient
      login={login}
    />
  );
}