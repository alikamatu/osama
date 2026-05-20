import "server-only";
import { createHash } from "node:crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD || !KEY || !SECRET) {
  throw new Error("CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET must be set");
}

export type SignedUpload = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  uploadUrl: string;
};

/**
 * Generate a signed Cloudinary upload payload. Clients POST a multipart form
 * to `uploadUrl` with these fields + their file. No raw API secret leaves the server.
 *
 * Docs: https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
 */
export function signUpload(folder: string): SignedUpload {
  const timestamp = Math.floor(Date.now() / 1000);
  // Cloudinary signature: SHA1 of alphabetically-sorted params + api_secret.
  const toSign = `folder=${folder}&timestamp=${timestamp}${SECRET}`;
  const signature = createHash("sha1").update(toSign).digest("hex");
  return {
    cloudName: CLOUD!,
    apiKey: KEY!,
    timestamp,
    signature,
    folder,
    uploadUrl: `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,
  };
}
