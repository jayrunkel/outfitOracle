import * as Realm from "realm-web";
import process from "process";
//import fs from "fs";
//import { NextRequest, NextResponse } from "next/server";
//import Buffer from "buffer";
//import { IncomingForm } from "formidable";

//set bodyparser

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    }
  }
}

//let fileDir = '/Users/jay.runkel/github/outfitOracle/web/uploads';

//export default async function handler(req, res) {

/*
const upload = async (req, res) => {
  try {
      console.log("starting...");
      const uploadDir = fileDir; //fs.path.join(fs.__dirname + '/uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, '0777', true);
    
    console.log(req);

      const customOptions = { uploadDir: uploadDir, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: false };
      const form = new IncomingForm(customOptions);

      console.log("parsing form...");
      form.parse(req, (err, field, file) => {
        console.log(file);
        if (err) throw err;

        if (!file.images) return res.status(400).json({ message: 'No file Selected' });
        file.images.forEach((file) => {
          const newFilepath = `${uploadDir}/${file.originalFilename}`;
          fs.rename(file.filepath, newFilepath, err => err);
      });
      return res.status(200).json({ message: ' File Uploaded ' });
    });

  }
  catch (err) {
      res.status(400).json({ message: 'Error occurred', error: err });
  }

  }
*/

export default async function handler(req, res) {  

  //await upload(req, res);

  //console.log("processing form: ", req);
    // Get data submitted in request's body.
    //const body = req.body
    
    //const form = formidable({});
/*  
    var form = new IncomingForm({uploadDir: fileDir, maxFileSize: 1024^3}); //.IncomingForm();

    console.log("form", form);
    //console.log("after formidable", req);
    //var dbDocPath = '';
    try {
      console.log("starting parse");
      const [fields, files] = await form.parse(req);
      console.log("parse complete");
        
      files.forEach(file => {
        console.log('file name: ', file.name);
        fs.rename(file.path, fs.path.join(form.uploadDir, file.name));
      });
      res.status(200).json({'success': true});
    } catch (err) {
      console.log(err);
      res.status(400).json({'success': false, error: err});
    }
  }
*/  
 
  const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
  const app = new Realm.App({ id: REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();

  const body = JSON.parse(req.body);
  console.log("body: ", body);
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    //console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    
    try {
      const user = await app.logIn(credentials);
      const formSaveResult = await user.functions.saveProfile(body.email, body);
      res.status(200).json({formSaveResult: formSaveResult});

    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  }