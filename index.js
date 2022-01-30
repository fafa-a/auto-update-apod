import dotenv from "dotenv"
import { fetchNasa } from "./services/useNasa.js"
import {
  uploadCloudinary,
  deleteOdlPictures,
} from "./services/useCloudinary.js"
import { insertDatabase, deleteOldItems } from "./services/useSupabase.js"

dotenv.config()
console.log("🚀  Script started")
// setInterval(async () => {
//   const newDate = new Date().toLocaleDateString("us-Us")
//   const [hour, minute] = new Date().toLocaleTimeString("fr-FR").split(/: /)
//   const time = hour + ":" + minute

//   const day = newDate.slice(0, 2)
//   const month = newDate.slice(3, 5)
//   const year = newDate.slice(6, 11)

//   // const { data } = await fetchNasa()

//   if (time >= "04:10" && time < "04:15") {
//     updateDatabase(time)
//   }
// }, 60000 * 5)

const updateDatabase = async (time) => {
  try {
    const {
      copyright,
      date,
      explanation,
      hdurl,
      media_type,
      url,
      service_version,
      title,
    } = await fetchNasa()
    const URlS = [url, hdurl]

    const uploadMultipleUrl = async (args) => {
      const arr = []
      try {
        if (media_type == "video") {
          arr.push(args[0])
        } else {
          for (const url of args) {
            const data = await uploadCloudinary(url)
            const { secure_url } = data
            arr.push(secure_url)
          }
        }
      } catch (error) {
        console.error(error)
      }
      return arr
    }

    const arr = await uploadMultipleUrl(URlS)
    const [Url, hdUrl] = arr

    await insertDatabase({
      title,
      explanation,
      media_type,
      Url,
      hdUrl,
      service_version,
      date,
      copyright,
    })
    console.log("✔️ Element added", date, time)
    await deleteOldItems()
    deleteOdlPictures()
  } catch (error) {
    console.error("❌ ", error.message)
  }
}
