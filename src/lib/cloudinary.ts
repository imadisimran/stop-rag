import { getCloudinarySignature } from "@/actions/cloudinary/cloudinary"

export interface CloudinaryUploadResult {
  type: string
  public_id: string
  secureUrl: string
}

/**
 * Uploads a file directly to Cloudinary using a server-generated signed
 * signature (official `cloudinary.utils.api_sign_request` flow).
 *
 * The server action returns { signature, timestamp, apiKey, cloudName, folder };
 * these exact params (the ones that were signed) must be forwarded to
 * Cloudinary's upload API untouched.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const sigRes = await getCloudinarySignature()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", sigRes.apiKey)
  // Cloudinary expects the timestamp as a string in the request body.
  formData.append("timestamp", sigRes.timestamp.toString())
  formData.append("signature", sigRes.signature)
  formData.append("folder", sigRes.folder)

  const url = `https://api.cloudinary.com/v1_1/${sigRes.cloudName}/auto/upload`
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Cloudinary upload failed: ${errText}`)
  }

  const data = await response.json()

  return {
    type: data.resource_type,
    public_id: data.public_id,
    secureUrl: data.secure_url,
  }
}
