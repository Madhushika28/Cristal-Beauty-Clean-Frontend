import { createClient } from "@supabase/supabase-js";

const anonkey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3b25tem1mcG1lZWh3Z2hxeXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTY4OTMsImV4cCI6MjA3NjM5Mjg5M30.OIrKXcVBZgF5ApC2kAdhe5y70UkLX4ZDUIf3HqEtBXk";
const supabaseUrl = "https://hwonmzmfpmeehwghqype.supabase.co";

const supabase = createClient(supabaseUrl, anonkey);

/*
supabase.storage.from("images").upload(file.name, file , {
        upsert : false,
        cacheControl: "3600",

    }).then(
        ()=>{
            const publicUrl= supabase.storage.from("images").getPublicUrl(file.name)
            console.log(publicUrl);
        }
    )
*/

export default function mediaUploade(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file selected");
    } else {
        const timestamp = new Date().getTime();

        const fileName = `${timestamp}_${file.name}`;

      supabase.storage
        .from("images")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        })
        .then(() => {
          const publicUrl = supabase.storage
            .from("images")
            .getPublicUrl(fileName).data.publicUrl;
          resolve(publicUrl);
        }).catch(
            ()=>{
                reject("An error occured")
            }
        )
    }
  });
}
