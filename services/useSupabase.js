import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" })

const supabaseUrl = "https://pkonpcjzjjefublfunli.supabase.co"
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const insertDatabase = async ({
  title,
  explanation,
  media_type,
  Url,
  hdUrl,
  service_version,
  date,
  copyright,
}) => {
  const { data, error } = await supabase.from("apod").insert([
    {
      title: title,
      explanation: explanation,
      date: date,
      media_type: media_type,
      media: {
        url: Url,
        hdurl: hdUrl,
      },
      copyright: copyright,
      service_version: service_version,
    },
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log("✔️ Supabase upload done")
  deleteOldItems()
}

const [date, month, year] = new Date().toLocaleDateString("fr-FR").split("/")
const lastMonth = month - 1
const numMonth = lastMonth < 10 ? "0" + lastMonth : lastMonth
const last31Days = `${year + "-" + numMonth + "-" + date}`

const deleteOldItems = async () => {
  const { data: apod, error } = await supabase
    .from("apod")
    .delete("*")
    .lt("date", last31Days)
  if (apod) {
    console.log(
      "✔️ Element ",
      apod.id + " " + apod.date,
      " deleted in supabase"
    )
  }
  if (error) {
    console.error("❌ Problem on deleted in supabase", error)
  }
}
// const { data, error } = await supabase.from("apod").delete().eq("id", 120)

export { insertDatabase }
