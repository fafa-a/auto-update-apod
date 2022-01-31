import dotenv from "dotenv"
import { fetchNasa } from "./services/useNasa.js"
import {
  uploadCloudinary,
  deleteOdlPictures,
} from "./services/useCloudinary.js"
import { insertDatabase, deleteOldItems } from "./services/useSupabase.js"

dotenv.config()
console.log("🚀  Script started")
setInterval(async () => {
  const newDate = new Date().toLocaleDateString("us-Us")
  const [hour, minute] = new Date().toLocaleTimeString("fr-FR").split(/: /)
  const time = `${hour}:${minute}`

  const day = newDate.slice(0, 2)
  const month = newDate.slice(3, 5)
  const year = newDate.slice(6, 11)

  // const { data } = await fetchNasa()

  if (time >= "05:10" && time < "05:15") {
    updateDatabase(time)
  }
}, 60000 * 5)

const updateDatabase = async (time) => {
  try {
    const res = await fetchNasa()
    const {
      date,
      explanation,
      hdurl,
      media_type,
      url,
      service_version,
      title,
    } = res

    const URLS = [url, hdurl]
    console.log({ URLS })

    const uploadMultipleUrl = async (args) => {
      const tmp = []
      try {
        if (media_type == "video") {
          tmp.push(args[0])
        } else {
          for (const items of args) {
            const data = await uploadCloudinary(items)
            const { secure_url } = data
            tmp.push(secure_url)
          }
        }
      } catch (error) {
        console.error(error)
      }
      return tmp
    }

    const arr = await uploadMultipleUrl(URLS)
    const [Url, hdUrl] = arr
    console.log({ arr })
    await insertDatabase({
      title,
      explanation,
      media_type,
      Url,
      hdUrl,
      service_version,
      date,
    })
    console.log("✔️ Element added", date, time)
    await deleteOldItems()
    deleteOdlPictures()
  } catch (error) {
    console.error("❌ from index ", error.message)
  }
}

