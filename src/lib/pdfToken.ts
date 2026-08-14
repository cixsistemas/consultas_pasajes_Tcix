import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

interface PdfTokenPayload {
  serie: string;
  numero: string;
  tipoDocumento: string;
  exp: number;
}

/**
 * Obtiene la llave utilizada para cifrar y descifrar
 * los parámetros necesarios para generar el PDF.
 */
function getKey(): Buffer {
  const secret = process.env.PDF_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "PDF_TOKEN_SECRET no está configurado."
    );
  }

  return createHash("sha256")
    .update(secret, "utf8")
    .digest();
}

/**
 * Genera un token cifrado que contiene:
 *
 * - Serie
 * - Número
 * - Tipo de documento
 * - Fecha de expiración
 *
 * El token puede utilizarse directamente dentro de una URL.
 */
export function crearPdfToken(data: {
  serie: string;
  numero: string;
  tipoDocumento: string;
}): string {

  const key = getKey();

  // AES-GCM utiliza un IV de 12 bytes.
  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  const payload: PdfTokenPayload = {
    serie: data.serie,
    numero: data.numero,
    tipoDocumento: data.tipoDocumento,

    // Vigencia del enlace: 30 minutos.
    exp: Date.now() + 30 * 60 * 1000,
  };

  const encrypted = Buffer.concat([
    cipher.update(
      JSON.stringify(payload),
      "utf8"
    ),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  /*
      Estructura interna:

      12 bytes  -> IV
      16 bytes  -> Authentication Tag
      resto     -> Información cifrada

      Todo se convierte posteriormente a un único Base64URL.
  */

  const tokenBuffer = Buffer.concat([
    iv,
    authTag,
    encrypted,
  ]);

  return tokenBuffer.toString("base64url");
}

/**
 * Descifra y valida el token recibido desde la URL.
 */
export function leerPdfToken(
  token: string
): PdfTokenPayload {

  if (!token) {
    throw new Error("Token vacío.");
  }

  const tokenBuffer = Buffer.from(
    token,
    "base64url"
  );

  // Debe contener como mínimo:
  // 12 bytes IV + 16 bytes AuthTag + datos
  if (tokenBuffer.length <= 28) {
    throw new Error(
      "El token tiene una longitud inválida."
    );
  }

  // ---------------------------------------------------------
  // EXTRAER PARTES
  // ---------------------------------------------------------

  const iv = tokenBuffer.subarray(
    0,
    12
  );

  const authTag = tokenBuffer.subarray(
    12,
    28
  );

  const encrypted =
    tokenBuffer.subarray(28);

  // ---------------------------------------------------------
  // DESCIFRAR
  // ---------------------------------------------------------

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getKey(),
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  const payload = JSON.parse(
    decrypted.toString("utf8")
  ) as PdfTokenPayload;

  // ---------------------------------------------------------
  // VALIDACIONES
  // ---------------------------------------------------------

  if (!payload.exp) {
    throw new Error(
      "El token no contiene fecha de expiración."
    );
  }

  if (Date.now() > payload.exp) {
    throw new Error(
      "El token ha expirado."
    );
  }

  if (!payload.serie) {
    throw new Error(
      "El token no contiene la serie."
    );
  }

  if (!payload.numero) {
    throw new Error(
      "El token no contiene el número."
    );
  }

  if (!payload.tipoDocumento) {
    throw new Error(
      "El token no contiene el tipo de documento."
    );
  }

  return payload;
}