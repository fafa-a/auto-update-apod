import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

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
  const { error } = await supabase.from("apod").insert([
    {
      title,
      explanation,
      date,
      media_type,
      media: {
        url: Url,
        hdurl: hdUrl,
      },
      copyright,
      service_version,
    },
  ])
  if (error) {
    console.error(error)
    return
  }
  console.log("✔️ Supabase upload done")
}

let [date, month, year] = new Date().toLocaleDateString("fr-FR").split("/")
let lastMonth = month - 1
if (lastMonth === 0) {
  lastMonth = 12
  year -= 1
}
const numMonth = lastMonth < 10 ? `0${lastMonth}` : lastMonth
const last31Days = `${year}-${numMonth}-${date}`

const deleteOldItems = async () => {
  const { data: apod, error } = await supabase
    .from("apod")
    .delete("*")
    .lt("date", last31Days)
  if (apod) {
    console.log(
      "✔️ Element ",
      `${apod.id} ${apod.date}`,
      " deleted in supabase"
    )
  }
  if (error) {
    console.error("❌ Problem on deleted in supabase", error)
  }
}
// const { data, error } = await supabase.from("apod").delete().eq("id", 120)

export { insertDatabase, deleteOldItems }
