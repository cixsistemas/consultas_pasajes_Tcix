"use client";

import Image from "next/image";
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
    <main className="relative min-h-screen overflow-hidden bg-slate-100">

      {/* =====================================================
          FONDO DECORATIVO PARA MÓVIL
          ===================================================== */}

      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffb51f] via-[#ff8a31] to-[#f04432]" />

        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />
      </div>


      {/* =====================================================
          CONTENEDOR PRINCIPAL
          ===================================================== */}

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* ===================================================
            PANEL IZQUIERDO - MARCA
            =================================================== */}

        <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">

          {/* Fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb51f] via-[#ff8a2e] to-[#ef4434]" />

          {/* Decoraciones */}
          <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute bottom-[-120px] right-[-80px] h-[420px] w-[420px] rounded-full bg-red-900/10 blur-3xl" />

          <div className="absolute right-20 top-24 h-48 w-48 rounded-full border border-white/10" />

          <div className="absolute right-32 top-36 h-32 w-32 rounded-full border border-white/10" />


          {/* CONTENIDO */}
          <div className="relative z-10 flex h-full flex-col justify-between px-14 py-12 xl:px-20">

            {/* Marca */}
            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                <Image
                  src="/logo-tcix.jpg"
                  alt="Transportes Chiclayo"
                  width={42}
                  height={42}
                  className="object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-white/70">
                  Transportes Chiclayo
                </p>

                <h2 className="mt-1 text-xl font-semibold text-white">
                  Sistema de Consultas
                </h2>
              </div>

            </div>


            {/* Mensaje central */}
            <div className="max-w-xl">

              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-white/65">
                Plataforma interna
              </p>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Consulta tus pasajes
                <span className="block">
                  de forma rápida y segura.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/80">
                Accede al sistema para realizar consultas de pasajeros
                y visualizar sus documentos asociados.
              </p>

            </div>


            {/* Footer izquierda */}
            <div className="text-xs text-white/60">
              Acceso exclusivo para usuarios autorizados
            </div>

          </div>

        </section>


        {/* ===================================================
            PANEL DERECHO - LOGIN
            =================================================== */}

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:bg-white lg:px-12">

          <div className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-white/50
            bg-white/95
            p-7
            shadow-2xl
            backdrop-blur-xl
            sm:p-9
            lg:border-0
            lg:bg-transparent
            lg:p-0
            lg:shadow-none
            lg:backdrop-blur-none
          ">

            {/* =================================================
                LOGO SOLO MÓVIL
                ================================================= */}

            <div className="mb-7 flex justify-center lg:hidden">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white/30">

                <Image
                  src="/logo-tcix.jpg"
                  alt="Transportes Chiclayo"
                  width={58}
                  height={58}
                  className="object-contain"
                  priority
                />

              </div>

            </div>


            {/* =================================================
                CABECERA LOGIN
                ================================================= */}

            <div className="mb-8">

              <p className="hidden text-sm font-semibold uppercase tracking-[0.16em] text-orange-500 lg:block">
                Bienvenido
              </p>

              <h2 className="mt-1 text-center text-2xl font-bold text-slate-900 sm:text-3xl lg:text-left">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-slate-500 lg:text-left">
                Ingrese sus credenciales para acceder al sistema.
              </p>

            </div>


            {/* =================================================
                FORMULARIO
                ================================================= */}

            <form
              onSubmit={iniciarSesion}
              className="space-y-5"
            >

              {/* USUARIO */}
              <div>

                <label
                  htmlFor="login"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Usuario
                </label>

                <div className="relative">

                  {/* Icono usuario */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>

                  </div>

                  <input
                    id="login"
                    type="text"
                    value={login}
                    onChange={(e) =>
                      setLogin(e.target.value)
                    }
                    autoComplete="username"
                    placeholder="Ingrese su usuario"
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3.5
                      pl-12
                      pr-4
                      text-base
                      font-medium
                      text-slate-900
                      caret-slate-900
                      outline-none
                      transition
                      placeholder:font-normal
                      placeholder:text-slate-400
                      focus:border-orange-400
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />

                </div>

              </div>


              {/* CONTRASEÑA */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Contraseña
                </label>

                <div className="relative">

                  {/* Icono candado */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        width="18"
                        height="11"
                        x="3"
                        y="11"
                        rx="2"
                        ry="2"
                      />

                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>

                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-300
                      bg-white
                      py-3.5
                      pl-12
                      pr-4
                      text-base
                      font-medium
                      text-slate-900
                      caret-slate-900
                      outline-none
                      transition
                      placeholder:font-normal
                      placeholder:text-slate-400
                      focus:border-orange-400
                      focus:ring-4
                      focus:ring-orange-100
                    "
                  />

                </div>

              </div>


              {/* =================================================
                  MENSAJE DE ERROR
                  ================================================= */}

              {mensaje && (

                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">

                  <div className="mt-0.5 shrink-0 text-red-500">

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                      />

                      <line
                        x1="12"
                        x2="12"
                        y1="8"
                        y2="12"
                      />

                      <line
                        x1="12"
                        x2="12.01"
                        y1="16"
                        y2="16"
                      />
                    </svg>

                  </div>

                  <p className="text-sm text-red-700">
                    {mensaje}
                  </p>

                </div>

              )}


              {/* =================================================
                  BOTÓN
                  ================================================= */}

              <button
                type="submit"
                disabled={cargando}
                className="
                  mt-2
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-slate-900/10
                  transition
                  hover:bg-slate-800
                  hover:shadow-xl
                  focus:outline-none
                  focus:ring-4
                  focus:ring-slate-200
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {cargando ? (

                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Ingresando...
                  </>

                ) : (

                  <>
                    Ingresar

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line
                        x1="5"
                        y1="12"
                        x2="19"
                        y2="12"
                      />

                      <polyline
                        points="12 5 19 12 12 19"
                      />
                    </svg>
                  </>

                )}

              </button>

            </form>


            {/* =================================================
                PIE
                ================================================= */}

            <p className="mt-8 text-center text-xs text-slate-400">
              Sistema de Consulta de Pasajes
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}