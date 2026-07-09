"use server"

import { v2 as cloudinary } from "cloudinary"

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "STOPRAG"

// Configure the SDK once with credentials. Done at module load so every
// `api_sign_request` call uses the configured secret.
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

export interface SignatureResponse {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

export async function getCloudinarySignature(): Promise<SignatureResponse> {
  // Fail fast with a clear error if credentials are missing, instead of
  // letting Cloudinary reject the upload later with a cryptic message.
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    )
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = CLOUDINARY_FOLDER

  // Only params that are part of the upload request AND sent to the client
  // should be included in the signature. Everything we sign must be sent back
  // to Cloudinary unchanged, otherwise signature validation fails.
  const paramsToSign = {
    folder,
    timestamp,
  }

  // Official SDK call — the single source of truth for signature generation.
  const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET)

  return {
    signature,
    timestamp,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    folder,
  }
}

export async function deleteFromCloudinary(publicId: string, resourceType: string = "image"): Promise<any> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    )
  }
  return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
