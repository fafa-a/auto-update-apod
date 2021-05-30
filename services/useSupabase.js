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
}

export { insertDatabase }
