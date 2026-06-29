// End-to-end verification of the official Cloudinary signed-upload flow.
// Mirrors what src/actions/cloudinary/cloudinary.ts + src/lib/cloudinary.ts do.
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// Robust .env.local parser (handles CRLF and quoted values).
const env = fs.readFileSync(".env.local", "utf8")
for (const line of env.split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const idx = trimmed.indexOf("=")
  if (idx === -1) continue
  const key = trimmed.slice(0, idx).trim()
  let val = trimmed.slice(idx + 1).trim()
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1)
  }
  process.env[key] = val
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

const mask = (s) => (s ? `${s.slice(0, 4)}…${s.slice(-3)} (len ${s.length})` : "UNDEFINED")
console.log("CLOUD_NAME:", mask(CLOUD_NAME))
console.log("API_KEY:   ", mask(API_KEY))
console.log("API_SECRET:", mask(API_SECRET))

cloudinary.config({ cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET, secure: true })

// --- Replicate getCloudinarySignature() ---
const timestamp = Math.round(Date.now() / 1000)
const folder = "STOPRAG"
const paramsToSign = { folder, timestamp }
const signature = cloudinary.utils.api_sign_request(paramsToSign, API_SECRET)
console.log("\nSignature:", signature)
console.log("Params signed:", paramsToSign)

// --- Replicate uploadToCloudinary() client-side fetch ---
const formData = new FormData()
const pngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
formData.append("file", `data:image/png;base64,${pngBase64}`)
formData.append("api_key", API_KEY)
formData.append("timestamp", timestamp.toString())
formData.append("signature", signature)
formData.append("folder", folder)

const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
console.log("\nPOST ->", url)

const res = await fetch(url, { method: "POST", body: formData })
const text = await res.text()
console.log("Status:", res.status, res.ok ? "OK ✅" : "FAILED ❌")
console.log("Response:", text.slice(0, 600))

if (res.ok) {
  const data = JSON.parse(text)
  console.log("\n✅ Upload succeeded")
  console.log("   public_id:", data.public_id)
  console.log("   secure_url:", data.secure_url)
  console.log("   resource_type:", data.resource_type)
  try {
    const del = await cloudinary.uploader.destroy(data.public_id)
    console.log("   cleanup:", del.result === "ok" ? "deleted 🧹" : del.result)
  } catch (e) {
    console.log("   cleanup skipped:", e.message)
  }
} else {
  console.log("\n❌ Upload rejected — see response above")
  process.exit(1)
}
