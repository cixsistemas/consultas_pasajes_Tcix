import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verificarTokenSesion } from "@/lib/session";

export default async function PanelPage() {
  const cookieStore = await cookies();

  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  const token = await verificarTokenSesion(
    session.value
  );

  if (!token) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold">
          Sistema de consultas
        </h1>

        <p className="mt-3 text-gray-600">
          Inicio de sesión realizado correctamente.
        </p>
      </div>
    </main>
  );
}