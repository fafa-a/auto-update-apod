'use strict';

var dotenv = require('dotenv');
var axios = require('axios');
var cloudinary = require('cloudinary');
var supabaseJs = require('@supabase/supabase-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);
var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var cloudinary__default = /*#__PURE__*/_interopDefaultLegacy(cloudinary);

dotenv__default['default'].config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

const fetchNasa = async () => {
  const res = axios__default['default'].get(process.env.NASA_URL);
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

dotenv__default['default'].config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

cloudinary__default['default'].config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (oldUrl) => {
  const data = await cloudinary__default['default'].v2.uploader.upload(
    oldUrl,
    {
      format: "webp",
    },
    function (error, result) {
      if (error) {
        console.log("❌", error);
      } else {
        console.log("✔️ Cloudinary upload done");
        return result
      }
    }
  );
  return data
};

dotenv__default['default'].config({ path: "D:/WorkSpace/Side project/auto-update-apod/.env" });

const supabaseUrl = "https://pkonpcjzjjefublfunli.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey);

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

dotenv__default['default'].config();
setInterval(async () => {
  const newDate = new Date().toLocaleDateString("us-Us");
  const [hour, minute] = new Date().toLocaleTimeString("us-US").split(/:| /);
  const time = hour + ":" + minute;

  const day = newDate.slice(0, 2);
  const month = newDate.slice(3, 5);
  const year = newDate.slice(6, 11);
  const tomorrow = year + "-" + month + "-" + day;

  const { date } = await fetchNasa();

  if (date === tomorrow && time >= "06:10" && time <= "06:15") {
    updateDatabase();
  }
}, 60000 * 5);

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
      const arr = [];
      try {
        if (media_type == "video") {
          arr.push(args[0]);
        } else {
          for (const url of args) {
            const data = await uploadCloudinary(url);
            const { secure_url } = data;
            arr.push(secure_url);
          }
        }
      } catch (error) {
        console.error(error);
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
    console.log("✔️ Element added", date, time);
  } catch (error) {
    console.error("❌ ", error.message);
  }
};
// updateDatabase()
