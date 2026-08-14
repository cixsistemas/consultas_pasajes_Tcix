import { NextRequest } from "next/server";
import { cookies } from "next/headers";

import { verificarTokenSesion } from "@/lib/session";
import { leerPdfToken } from "@/lib/pdfToken";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      token: string;
    }>;
  }
) {
  try {
    // =========================================================
    // 1. VALIDAR SESIÓN
    // =========================================================

    const cookieStore = await cookies();

    const sessionCookie =
      cookieStore.get("session");

    if (!sessionCookie) {
      return new Response(
        "Sesión no válida.",
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
      return new Response(
        "La sesión ha expirado.",
        {
          status: 401,
        }
      );
    }

    // =========================================================
    // 2. OBTENER TOKEN
    // =========================================================

    const { token } = await params;

    let datos;

try {

  datos = leerPdfToken(token);

} catch (error) {

  console.error(
    "ERROR AL LEER TOKEN PDF:",
    error
  );

  const mensaje =
    error instanceof Error
      ? error.message
      : "Error desconocido";

  console.error(
    "DETALLE TOKEN PDF:",
    mensaje
  );

  return new Response(
    "El enlace del documento no es válido o ha expirado.",
    {
      status: 403,
    }
  );
}

    // =========================================================
    // 3. CONSTRUIR URL DEL SISTEMA ANTIGUO
    // =========================================================

    const pdfServiceUrl =
      process.env.PDF_SERVICE_URL;

    if (!pdfServiceUrl) {
      console.error(
        "PDF_SERVICE_URL no está configurado."
      );

      return new Response(
        "El servicio de documentos no está configurado.",
        {
          status: 500,
        }
      );
    }

    const url = new URL(pdfServiceUrl);

    url.searchParams.set(
      "Opcion",
      "1"
    );

    url.searchParams.set(
      "Origen",
      ""
    );

    url.searchParams.set(
      "Destino",
      ""
    );

    url.searchParams.set(
      "Fecha",
      ""
    );

    url.searchParams.set(
      "FechaFinal",
      ""
    );

    url.searchParams.set(
      "Serie",
      datos.serie
    );

    url.searchParams.set(
      "Numero",
      datos.numero
    );

    url.searchParams.set(
      "TipoDocumento",
      datos.tipoDocumento
    );

    url.searchParams.set(
      "Tipo",
      "1"
    );

    url.searchParams.set(
      "ImpresionDesde",
      "FACTURACION"
    );

    url.searchParams.set(
      "mostrarMarcaAgua",
      "NO"
    );

    url.searchParams.set(
      "mostrarMensajeReimpresion",
      "NO"
    );

    // =========================================================
    // 4. SOLICITAR PDF
    // =========================================================

    const respuestaPdf = await fetch(
      url.toString(),
      {
        method: "GET",

        cache: "no-store",

        redirect: "follow",
      }
    );

    if (!respuestaPdf.ok) {
      console.error(
        "Error del servidor de PDF:",
        respuestaPdf.status
      );

      return new Response(
        "No se pudo generar el documento.",
        {
          status: 502,
        }
      );
    }

    if (!respuestaPdf.body) {
      return new Response(
        "El documento se encuentra vacío.",
        {
          status: 502,
        }
      );
    }

    // =========================================================
    // 5. DEVOLVER PDF
    // =========================================================

    const serieSegura =
      datos.serie.replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      );

    const numeroSeguro =
      datos.numero.replace(
        /[^a-zA-Z0-9_-]/g,
        ""
      );

    return new Response(
      respuestaPdf.body,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `inline; filename="pasaje_${serieSegura}_${numeroSeguro}.pdf"`,

          "Cache-Control":
            "private, no-store",
        },
      }
    );

  } catch (error) {

    console.error(
      "Error cargando PDF:",
      error
    );

    return new Response(
      "No se pudo cargar el documento.",
      {
        status: 500,
      }
    );
  }
}