import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface SessionPayload {
  idUsuario: number;
  login: string;
  trabajador: string;
  sucursal: string;
  idPerfil: number;
}

export async function crearTokenSesion(
  usuario: SessionPayload
): Promise<string> {
  return new SignJWT({
    login: usuario.login,
    trabajador: usuario.trabajador,
    sucursal: usuario.sucursal,
    idPerfil: usuario.idPerfil,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setSubject(usuario.idUsuario.toString())
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function verificarTokenSesion(token: string) {
  try {
    return await jwtVerify(token, secret);
  } catch {
    return null;
  }
}