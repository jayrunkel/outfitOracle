//import fs from "fs";
//import { NextResponse } from "next/server";
//import React from "react"

/*
export async function POST(req) {
  const formData = await req.formData();
  const formDataEntryValues = Array.from(formData.values());
  for (const formDataEntryValue of formDataEntryValues) {
    if (typeof formDataEntryValue === "object" && "arrayBuffer" in formDataEntryValue) {
      const file = formDataEntryValue //as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`public/${file.name}`, buffer);
    }
  }
  return NextResponse.json({ success: true });
}
*/

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    }
  }
}

export default async function handler(req, res) {  
  
  //const body = JSON.parse(req.body);
  
  const payload = {
    prompt: req.body.prompt,
    image: req.body.image,
  }
// Send the data to the server in JSON format.
//const JSONdata = JSON.stringify(data)

// API endpoint where we send form data.
const endpoint = 'http://127.0.0.1:5000/prompt'

// Form the request for sending data to the server.
const options = {
  // The method is POST because we are sending data.
  method: 'POST',
  // Tell the server we're sending JSON.
  headers: new Headers ({
    'Content-Type': 'application/json'
        }),
  // Body of the request is the JSON data we created above.
  body: JSON.stringify(payload)
}

console.log("AIEnginePayload: ", payload);
try {
    // Make an API call to the route you created in step 2

    const response = await fetch(endpoint, options);

    
    let body = await response.json();
    console.log(body);

    res.status(200).json(body);
    //alert(`Presenting search ID data: ${response.data}`)
    //alert(`[hack] Presenting search ID data: ${selectedImageSearchId}`)
}
catch (error) {
    console.error('Error sending request to Outfit Oracle Engine:', error);
    res.status(400).json(error);
}
}
