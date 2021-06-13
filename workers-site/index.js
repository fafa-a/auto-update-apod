import dotenv from 'dotenv';
import axios from 'axios';
import cloudinary from 'cloudinary';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

const fetchNasa = async () => {
  const res = axios.get(process.env.NASA_URL);
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
  } = await res;

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
};

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (oldUrl) => {
  const data = await cloudinary.v2.uploader.upload(
    oldUrl,
    {
      format: "webp",
    },
    function (error, result) {
      if (error) {
        console.log("❌", error);
      } else {
        console.log("✔️ " + " Cloudinary upload done");
        return result
      }
    }
  );
  return data
};

dotenv.config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

const supabaseUrl = "https://pkonpcjzjjefublfunli.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  ]);
  if (error) {
    console.error(error);
    return
  }
  console.log("✔️ Supabase upload done");
};

dotenv.config();
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
    } = await fetchNasa();
    const URlS = [url, hdurl];

    const uploadMultipleUrl = async (args) => {
      let arr = [];
      try {
        for (const url of args) {
          const data = await uploadCloudinary(url);
          const { secure_url } = data;
          arr.push(secure_url);
        }
      } catch (error) {
        arr.push(args[1]);
      }
      return arr
    };

    const arr = await uploadMultipleUrl(URlS);
    const [Url, hdUrl] = arr;

    await insertDatabase({
      title: title,
      explanation: explanation,
      media_type: media_type,
      Url,
      hdUrl,
      service_version: service_version,
      date: date,
      copyright: copyright,
    });
    console.log("✔️ " + " Element added");
  } catch (error) {
    console.error("❌ ", error.message);
  }
};
updateDatabase();
