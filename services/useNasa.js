import "dotenv/config"
import axios from "axios"
import got from "got"
const fetchNasa = async () => {
  try {
    const res = await got(process.env.NASA_URL).json()
    console.log("res nasa", res)
    const {
      date,
      explanation,
      hdurl,
      media_type,
      service_version,
      title,
      url,
    } = res

    return {
      date,
      explanation,
      hdurl,
      media_type,
      url,
      service_version,
      title,
    }
  } catch (error) {
    console.error("❌ Problem on fetching nasa", error)
  }
}
const searchNasa = async (startDate, endDate) => {
  const res = axios.get(
    `${process.env.NASA_URL}&start_date=${startDate}&end_date=${endDate}`
  )
  const { data } = await res
  return { data }
}

export { fetchNasa, searchNasa }
