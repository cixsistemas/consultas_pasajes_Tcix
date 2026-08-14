import crypto from "crypto";

const encryptionKey =
  process.env.ENCRYPTION_KEY ??
  "ABCDEFG51234567890PQRSTUVWXYZabcdef1234567890opqrstuvwxyz";

/**
 * Replica el método DecryptKey de la aplicación C#.
 *
 * C#:
 * - UTF8 de la llave
 * - MD5
 * - TripleDES
 * - ECB
 * - PKCS7
 * - Entrada Base64
 */
export function decryptKey(encryptedText: string): string {
  try {
    // Equivalente a:
    // Encoding.UTF8.GetBytes(key)
    // MD5.ComputeHash(...)
    const keyHash = crypto
      .createHash("md5")
      .update(encryptionKey, "utf8")
      .digest();

    // El código C# utiliza una llave MD5 de 16 bytes.
    // En TripleDES esto corresponde a 2-key Triple DES.
    const decipher = crypto.createDecipheriv(
      "des-ede",
      keyHash,
      null
    );

    // Node utiliza PKCS padding por defecto.
    decipher.setAutoPadding(true);

    let decrypted = decipher.update(
      encryptedText,
      "base64",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error(
      "Error al desencriptar la contraseña:",
      error
    );

    throw new Error(
      "No se pudo desencriptar la contraseña."
    );
  }
}