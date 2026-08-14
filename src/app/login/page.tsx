"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje(
          data.mensaje ?? "No se pudo iniciar sesión."
        );
        return;
      }

      router.push("/panel");
      router.refresh();
    } catch {
      setMensaje(
        "No se pudo establecer conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Inicio de sesión
        </h1>

        <p className="mb-8 text-center text-sm text-gray-500">
          Ingrese sus credenciales para continuar
        </p>

        <form
          onSubmit={iniciarSesion}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="login"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>

            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username"
              placeholder="Ingrese su usuario"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Ingrese su contraseña"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {mensaje && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>

      </div>
    </main>
  );
}