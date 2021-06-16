import dotenv from "dotenv"
import { fetchNasa } from "./services/useNasa.js"
import { uploadCloudinary } from "./services/useCloudinary.js"
import { insertDatabase } from "./services/useSupabase.js"

dotenv.config()
const updateAtTime = setInterval(async () => {
  const newDate = new Date().toLocaleDateString("us-Us")
  const [hour, minute] = new Date().toLocaleTimeString("us-US").split(/:| /)
  const time = hour + ":" + minute

  const day = newDate.slice(0, 2)
  const month = newDate.slice(3, 5)
  const year = newDate.slice(6, 11)
  const tomorrow = year + "-" + month + "-" + day

  const { date } = await fetchNasa()

  if (date === tomorrow && time >= "06:10" && time <= "06:15") {
    updateDatabase()
  }
}, 60000 * 5)

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
    console.log("✔️ Element added", date, time)
  } catch (error) {
    console.error("❌ ", error.message)
  }
}
// updateDatabase()
