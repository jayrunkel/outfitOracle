//import * as Realm from "realm-web";
//import process from "process";
import fs from "fs";
//import { NextRequest, NextResponse } from "next/server";
import Buffer from "buffer";
import formidable from "formidable";

//set bodyparser
export const config = {
  api: {
    bodyParser: false
  }
}


//export default async function handler(req, res) {
export default async function handler(req, res) {  

  //console.log("processing form: ", req);
    // Get data submitted in request's body.
    //const body = req.body
    
    const form = formidable({});
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(req);
    }
    catch (error) {
      console.error(error);
    }

    console.log(fields);

    try {
      for (const file in files.images) {
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(`public/${file.name}`, buffer);
        }

      res.status(200).json({success: true});
    }
    catch(error) {
      console.error(error);
      //return NextResponse.rewrite(url).status(400).json(error);
      res.status(400).json(error);
    }
    
    
  }
/*  
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();


    // Optional logging to see the responses
    // in the command line where next.js app is running.
    //console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    let formSaveResult;
    try {
      const user = await app.logIn(credentials);
      formSaveResult = await user.functions.saveProfile(body.email, body);
      res.status(200).json({formSaveResult: formSaveResult});

    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  }
*/
