import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Elimina la cookie utilizada para la sesión.
    cookieStore.delete("session");

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("Error cerrando sesión:", error);

    return NextResponse.json(
      {
        ok: false,
        mensaje: "No se pudo cerrar la sesión.",
      },
      {
        status: 500,
      }
    );
  }
}