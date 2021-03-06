import "dotenv/config"
import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const [date, month, year] = new Date().toLocaleDateString("fr-FR").split("/")
const lastMonth = month - 1
const numMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth
const last31Days = `${year}-${numMonth}-${date}`

const findRessource = async () =>
  cloudinary.v2.api.resources({
    type: "upload",
    max_results: 200,
  })

const { resources } = await findRessource()

const deleteOdlPictures = () => {
  for (const item of resources) {
    if (item.created_at < last31Days) {
      cloudinary.v2.api.delete_resources(
        item.public_id,
        function (error, result) {
          if (result) {
            console.log("✔️  Old picture deleted", result.deleted)
          }
          if (error) {
            console.error("❌ Problem on deleted", error)
          }
        }
      )
    }
  }
}

const uploadCloudinary = async (oldUrl) =>
  cloudinary.v2.uploader.upload(
    oldUrl,
    {
      format: "webp",
    },
    function (error, result) {
      if (error) {
        console.log("❌ cloudinary upload error", error)
      } else {
        console.log("✔️ Cloudinary upload done")
        return result
      }
    }
  )

export { uploadCloudinary, deleteOdlPictures }
