import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getConnection, sql } from "@/lib/db";
import { verificarTokenSesion } from "@/lib/session";
import { crearPdfToken } from "@/lib/pdfToken";

import type { PasajeConsulta } from "@/types/pasaje";

/**
 * Convierte un valor retornado por SQL Server
 * a una fecha que pueda enviarse mediante JSON.
 */
function convertirFecha(
  value: unknown
): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

/**
 * Normaliza valores de hora provenientes de SQL Server.
 */
function convertirHora(value: unknown): string {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

export async function GET(
  request: NextRequest
) {
  try {
    // =========================================================
    // 1. VALIDAR SESIÓN
    // =========================================================

    const cookieStore = await cookies();

    const sessionCookie =
      cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Sesión no válida.",
        },
        {
          status: 401,
        }
      );
    }

    const session =
      await verificarTokenSesion(
        sessionCookie.value
      );

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "La sesión ha expirado.",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================================
    // 2. OBTENER DNI
    // =========================================================

    const dni =
      request.nextUrl.searchParams
        .get("dni")
        ?.trim() ?? "";

    // El DNI/documento solo puede contener números
    // y debe tener entre 8 y 20 caracteres.
    if (!/^\d{8,20}$/.test(dni)) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Ingrese un número de documento válido de al menos 8 dígitos.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 3. CONSULTAR SQL SERVER
    // =========================================================

    const pool = await getConnection();

    const resultado = await pool
      .request()

      // La sucursal NO viene de la interfaz.
      // Siempre será 903.
      .input(
        "CodigoSucursal",
        sql.VarChar(10),
        "903"
      )

      .input(
        "DNI",
        sql.VarChar(20),
        dni
      )

      .execute(
        "BD_Pje_ConsultaPasajes"
      );

    // =========================================================
    // 4. PREPARAR RESULTADOS
    // =========================================================

    const pasajes: PasajeConsulta[] =
      resultado.recordset.map((row) => {

        // TIPO_DOC solo se utiliza internamente.
        const tipoDocumento =
          String(row.TIPO_DOC ?? "").trim();

        const serie =
          String(row.SERIE ?? "").trim();

        const numero =
          String(row.NUMERO ?? "").trim();

          console.log("PDF:", {
                serie,
                numero,
                tipoDocumento,
                });

        // Creamos una URL interna cifrada.
        const pdfToken = crearPdfToken({
          serie,
          numero,
          tipoDocumento,
        });

        return {
          asiento:
            String(row.ASIENTO ?? ""),

          serie,

          numero,

          pasajero:
            String(row.PASAJERO ?? ""),

          origen:
            String(row.ORIGEN ?? ""),

          destino:
            String(row.DESTINO ?? ""),

          emision:
            convertirFecha(row.EMISION),

          precio:
            Number(row.PRECIO ?? 0),

          fechaViaje:
            convertirFecha(
              row.FECHA_VIAJE
            ),

          turno:
            convertirHora(
              row.TURNO
            ),

          pdfUrl:
            `/documento/${encodeURIComponent(pdfToken)}`,
        };
      });

    // =========================================================
    // 5. RESPUESTA
    // =========================================================

    return NextResponse.json({
      ok: true,
      cantidad: pasajes.length,
      data: pasajes,
    });

  } catch (error) {

    console.error(
      "Error consultando pasajes:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "No se pudo realizar la consulta de pasajes.",
      },
      {
        status: 500,
      }
    );
  }
}