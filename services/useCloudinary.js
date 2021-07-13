import dotenv from "dotenv"
import cloudinary from "cloudinary"

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
// const cloudy = async () => {
//   const res = await cloudinary.v2.api.resources("image")
//   const resources = await res
//   console.log(resources)
// }

// cloudy()
// cloudinary.v2.api.resource("image", function (error, result) {
//   console.log(result)
// })
const uploadCloudinary = async (oldUrl) => {
  const data = await cloudinary.v2.uploader.upload(
    oldUrl,
    {
      format: "webp",
    },
    function (error, result) {
      if (error) {
        console.log("❌", error)
      } else {
        console.log("✔️ Cloudinary upload done")
        return result
      }
    }
  )
  return data
}
export { uploadCloudinary }
