import dotenv from "dotenv"
import axios from "axios"

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" })

const fetchNasa = async () => {
  const res = axios.get(process.env.NASA_URL)
  const {
    data: {
      copyright,
      date,
      explanation,
      hdurl,
      media_type,
      service_version,
      title,
      url,
    },
  } = await res

  return {
    copyright,
    date,
    explanation,
    hdurl,
    media_type,
    url,
    service_version,
    title,
  }
}
const searchNasa = async (startDate, endDate) => {
  const res = axios.get(
    process.env.NASA_URL + "&start_date=" + startDate + "&end_date=" + endDate
  )
  const { data } = await res
  return { data }
}

export { fetchNasa, searchNasa }
