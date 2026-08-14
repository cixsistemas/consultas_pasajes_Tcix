import { NextRequest, NextResponse } from "next/server";
import { getConnection, sql } from "@/lib/db";
import { decryptKey } from "@/lib/encryption";
import { crearTokenSesion } from "@/lib/session";
import type { UsuarioLogin } from "@/types/usuario";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const login = body.login?.trim();
    const password = body.password;

    if (!login || !password) {
      return NextResponse.json(
        {
          ok: false,
          mensaje: "Ingrese usuario y contraseña.",
        },
        {
          status: 400,
        }
      );
    }

    const pool = await getConnection();

    // =========================================================
    // 1. BUSCAR USUARIO
    // =========================================================

    const resultado = await pool
      .request()
      .input(
        "login",
        sql.VarChar(250),
        login
      )
      .execute(
        "__Pr_VerificaAccesoSistemaUsuario"
      );

    if (
      !resultado.recordset ||
      resultado.recordset.length === 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Usuario o contraseña incorrectos.",
        },
        {
          status: 401,
        }
      );
    }

    const usuario =
      resultado.recordset[0] as UsuarioLogin;

    // =========================================================
    // 2. DESENCRIPTAR CONTRASEÑA DE SQL SERVER
    // =========================================================

    let decryptedPassword: string;

    try {
      decryptedPassword = decryptKey(
        usuario.password
      );
    } catch {
      console.error(
        `No se pudo desencriptar la contraseña del usuario ${usuario.login}`
      );

      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "No se pudo validar el acceso.",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // 3. COMPARAR CONTRASEÑAS
    // =========================================================

    if (decryptedPassword !== password) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Usuario o contraseña incorrectos.",
        },
        {
          status: 401,
        }
      );
    }

    // =========================================================
    // 4. OBTENER IP
    // =========================================================

    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "DESCONOCIDO";

    // =========================================================
    // 5. REGISTRAR BITÁCORA
    // =========================================================

    const bitacora = await pool
      .request()

      .input(
        "Usuario",
        sql.VarChar(50),
        usuario.login
      )

      .input(
        "Sucursal",
        sql.VarChar(50),
        usuario.Sucursal
      )

      .input(
        "Accion",
        sql.VarChar(100),
        "INGRESO A SISTEMA"
      )

      .input(
        "Formulario",
        sql.VarChar(100),
        "ACCESO"
      )

      .input(
        "ModoIngreso",
        sql.VarChar(200),
        "Web"
      )

      .input(
        "NombrePagina",
        sql.VarChar(20),
        "Index"
      )

      .input(
        "Host_Ip",
        sql.VarChar(200),
        ip
      )

      .input(
        "Opcion",
        sql.Char(1),
        "N"
      )

      .output(
        "pRpta",
        sql.Int
      )

      .output(
        "pMensaje",
        sql.VarChar(100)
      )

      .execute(
        "pa_mantenimiento_Bitacora"
      );

    // No mostramos pMensaje.
    if (bitacora.output.pRpta !== 1) {
      console.warn(
        "No se pudo registrar la bitácora."
      );
    }

    // =========================================================
    // 6. CREAR SESIÓN
    // =========================================================

    const token = await crearTokenSesion({
      idUsuario: usuario.Id_Usuario,
      login: usuario.login,
      trabajador: usuario.Trabajador,
      sucursal: usuario.Sucursal,
      idPerfil: usuario.IdPerfil,
    });

    // =========================================================
    // 7. RESPONDER
    // =========================================================

    const response = NextResponse.json({
      ok: true,

      usuario: {
        idUsuario: usuario.Id_Usuario,
        login: usuario.login,
        trabajador: usuario.Trabajador,
        sucursal: usuario.Sucursal,
        idPerfil: usuario.IdPerfil,
      },
    });

    response.cookies.set(
      "session",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Error iniciando sesión:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Ocurrió un error al iniciar sesión.",
      },
      {
        status: 500,
      }
    );
  }
}