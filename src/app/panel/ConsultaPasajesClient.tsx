"use client";

import {
  FormEvent,
  useState,
} from "react";

import type {
  PasajeConsulta,
} from "@/types/pasaje";

interface Props {
  login: string;
}



export default function ConsultaPasajesClient({
  login,
}: Props) {

  const [dni, setDni] =
    useState("");

  const [pasajes, setPasajes] =
    useState<PasajeConsulta[]>([]);

  const [cargando, setCargando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  const [consultado, setConsultado] =
    useState(false);

  const [cerrandoSesion, setCerrandoSesion] =
    useState(false);

    // ===========================================================
    // CERRAR SESIÓN
    // ===========================================================

    async function cerrarSesion() {
    try {
        setCerrandoSesion(true);
        setMensaje("");

        const response = await fetch(
        "/api/auth/logout",
        {
            method: "POST",
        }
        );

        if (!response.ok) {
        setMensaje(
            "No se pudo cerrar la sesión."
        );

        return;
        }

        // Regresa al login sin conservar
        // el panel en el historial.
        window.location.replace("/login");

    } catch (error) {

        console.error(
        "Error cerrando sesión:",
        error
        );

        setMensaje(
        "No se pudo cerrar la sesión."
        );

    } finally {

        setCerrandoSesion(false);

    }
    }

  // ===========================================================
  // CONSULTAR
  // ===========================================================

  async function consultar(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMensaje("");
    setConsultado(false);

    if (!/^[A-Za-z0-9]{8,20}$/.test(dni)) {
    setMensaje(
        "Ingrese un número de documento válido de al menos 8 caracteres."
      );

      return;
    }

    try {
      setCargando(true);

      const response = await fetch(
        `/api/pasajes?dni=${encodeURIComponent(
          dni
        )}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setMensaje(
          data.mensaje ??
            "No se pudo realizar la consulta."
        );

        setPasajes([]);

        return;
      }

      setPasajes(data.data ?? []);
      setConsultado(true);

    } catch {
      setMensaje(
        "No se pudo conectar con el servidor."
      );

      setPasajes([]);

    } finally {
      setCargando(false);
    }
  }

  // ===========================================================
  // FECHAS
  // ===========================================================

  function formatearFecha(
    fecha: string | null
  ) {
    if (!fecha) {
      return "-";
    }

    const value = new Date(fecha);

    if (Number.isNaN(value.getTime())) {
      return fecha;
    }

    return new Intl.DateTimeFormat(
      "es-PE",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).format(value);
  }

function formatearHora(hora: string) {
  if (!hora) {
    return "-";
  }

  return hora.trim();
}

  function formatearPrecio(
    precio: number
  ) {
    return new Intl.NumberFormat(
      "es-PE",
      {
        style: "currency",
        currency: "PEN",
      }
    ).format(precio);
  }

  // ===========================================================
  // INTERFAZ
  // ===========================================================

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          CABECERA
          ===================================================== */}
        <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">

            {/* TÍTULO */}
            <div className="min-w-0">

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-300">
                Transportes Chiclayo
            </p>

            <h1 className="mt-1 text-xl font-semibold sm:text-2xl">
                Consulta de pasajes
            </h1>

            </div>

            {/* USUARIO + CERRAR SESIÓN */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-5">

            {login && (
                <div className="hidden text-right sm:block">

                <p className="text-xs text-slate-400">
                    Usuario
                </p>

                <p className="max-w-[220px] truncate text-sm font-medium">
                    {login}
                </p>

                </div>
            )}

            <button
                type="button"
                onClick={cerrarSesion}
                disabled={cerrandoSesion}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="
                inline-flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-700
                bg-slate-900
                px-3
                text-sm
                font-medium
                text-slate-200
                transition
                hover:border-slate-600
                hover:bg-slate-800
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:px-4
                "
            >

                {/* ICONO CERRAR SESIÓN */}
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
                aria-hidden="true"
                >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

                <polyline
                    points="16 17 21 12 16 7"
                />

                <line
                    x1="21"
                    x2="9"
                    y1="12"
                    y2="12"
                />
                </svg>

                <span className="hidden sm:inline">
                {cerrandoSesion
                    ? "Cerrando..."
                    : "Cerrar sesión"}
                </span>

            </button>

            </div>

        </div>
        </header>

      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* ===================================================
            BUSCADOR
            =================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">

            <h2 className="text-lg font-semibold text-slate-900">
              Buscar pasajero
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ingrese el número de documento para consultar sus próximos viajes.
            </p>

          </div>

          <form
            onSubmit={consultar}
            className="p-5 sm:p-7"
          >

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

              <div className="flex-1">

                <label
                  htmlFor="dni"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Número de documento
                </label>

                <input
                  id="dni"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={20}
                  value={dni}

                  onChange={(event) => {

                    const value = event.target.value
                      .replace(/[^a-zA-Z0-9]/g, "")
                      .toUpperCase();

                    setDni(value);
                  }}

                  placeholder="Ej. 45048544 o CE12345678"

                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    text-base
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-100
                  "
                />

              </div>

              <button
                type="submit"
                disabled={
                  cargando ||
                  dni.length < 8
                }

                className="
                  h-12
                  rounded-xl
                  bg-blue-600
                  px-7
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-blue-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-blue-200
                  disabled:cursor-not-allowed
                  disabled:bg-slate-300
                  sm:min-w-32
                "
              >
                {cargando
                  ? "Buscando..."
                  : "Buscar"}
              </button>

            </div>

            {mensaje && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {mensaje}
              </div>
            )}

          </form>
        </section>

        {/* ===================================================
            RESULTADOS
            =================================================== */}

        <section className="mt-6">

          {pasajes.length > 0 && (
            <div className="mb-3 flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Pasajes encontrados
                </h2>

                <p className="text-sm text-slate-500">
                  {pasajes.length} resultado
                  {pasajes.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

            </div>
          )}

          {/* =================================================
              TABLA - DESKTOP / TABLET
              ================================================= */}

          {pasajes.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1150px]">

                  <thead className="bg-slate-50">

                    <tr className="border-b border-slate-200">

                    {[
                        "Asiento",
                        "Serie",
                        "Número",
                        "Emisión",
                        "Pasajero",
                        "Origen",
                        "Destino",
                        "Precio",
                        "Fecha viaje",
                        "Turno",
                        "PDF",
                        ].map((titulo) => (
                        <th
                          key={titulo}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                          {titulo}
                        </th>
                      ))}

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {pasajes.map(
                      (pasaje, index) => (

                        <tr
                          key={`${pasaje.serie}-${pasaje.numero}-${index}`}
                          className="transition hover:bg-blue-50/40"
                        >

                          <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                            {pasaje.asiento}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {pasaje.serie}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {pasaje.numero}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {formatearFecha(
                              pasaje.emision
                            )}
                          </td>

                          <td className="px-4 py-4 text-sm font-medium text-slate-900">
                            {pasaje.pasajero}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {pasaje.origen}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-600">
                            {pasaje.destino}
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                            {formatearPrecio(
                              pasaje.precio
                            )}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {formatearFecha(
                              pasaje.fechaViaje
                            )}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {formatearHora(
                              pasaje.turno
                            )}
                          </td>

                          <td className="px-4 py-4">

                            <a
                              href={pasaje.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"

                              className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-lg
                                bg-red-50
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-red-700
                                transition
                                hover:bg-red-100
                              "
                            >
                              Ver PDF ↗
                            </a>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

          {/* =================================================
              TARJETAS - CELULAR
              ================================================= */}

          {pasajes.length > 0 && (
            <div className="space-y-4 md:hidden">

              {pasajes.map(
                (pasaje, index) => (

                  <article
                    key={`${pasaje.serie}-${pasaje.numero}-${index}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >

                    <div className="border-b border-slate-100 p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {pasaje.serie} - {pasaje.numero}
                          </p>

                          <h3 className="mt-1 font-semibold text-slate-900">
                            {pasaje.pasajero}
                          </h3>

                        </div>

                        <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">

                          <p className="text-[10px] uppercase text-slate-500">
                            Asiento
                          </p>

                          <p className="font-bold text-slate-900">
                            {pasaje.asiento}
                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex-1">

                          <p className="text-xs text-slate-400">
                            Origen
                          </p>

                          <p className="font-medium text-slate-800">
                            {pasaje.origen}
                          </p>

                        </div>

                        <span className="text-slate-300">
                          →
                        </span>

                        <div className="flex-1">

                          <p className="text-xs text-slate-400">
                            Destino
                          </p>

                          <p className="font-medium text-slate-800">
                            {pasaje.destino}
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">

                        <div>

                          <p className="text-xs text-slate-400">
                            Fecha de viaje
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatearFecha(
                              pasaje.fechaViaje
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Turno
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatearHora(
                              pasaje.turno
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Emisión
                          </p>

                          <p className="mt-1 text-sm font-medium text-slate-800">
                            {formatearFecha(
                              pasaje.emision
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-400">
                            Precio
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {formatearPrecio(
                              pasaje.precio
                            )}
                          </p>

                        </div>

                      </div>

                      <a
                        href={pasaje.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"

                        className="
                          mt-5
                          flex
                          h-11
                          w-full
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-900
                          font-semibold
                          text-white
                          transition
                          active:scale-[0.99]
                        "
                      >
                        Ver documento PDF
                      </a>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

          {/* =================================================
              SIN RESULTADOS
              ================================================= */}

          {consultado &&
            pasajes.length === 0 &&
            !cargando && (

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                  🔎
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  No se encontraron pasajes
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  No existen viajes disponibles para el documento ingresado.
                </p>

              </div>

            )}

        </section>

      </div>

    </main>
  );
}