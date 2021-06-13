import dotenv from "dotenv"
import { fetchNasa } from "./services/useNasa.js"
import { uploadCloudinary } from "./services/useCloudinary.js"
import { insertDatabase } from "./services/useSupabase.js"

dotenv.config()
// setInterval(() => {
//   const [hour, minute] = new Date().toLocaleTimeString("fr-FR").split(/:| /)
//   const time = hour + ":" + minute
//   if (time == "06:30") {
//     updateDatabase()
//   }
// }, 60000)

const updateDatabase = async () => {
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
      title: title,
      explanation: explanation,
      media_type: media_type,
      Url,
      hdUrl,
      service_version: service_version,
      date: date,
      copyright: copyright,
    })
    console.log("✔️ " + " Element added")
  } catch (error) {
    console.error("❌ ", error.message)
  }
}
updateDatabase()
