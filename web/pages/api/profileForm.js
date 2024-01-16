import * as Realm from "realm-web";


export default async function handler(req, res) {

    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();

    // Get data submitted in request's body.
    const body = req.body
  
    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)
  
    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.first || !body.last) {
      // Sends a HTTP bad request error code
      return res.status(400).json({ data: 'First or last name not found' })
    }
  
    let formSaveResult;
    try {
      const user = await app.logIn(credentials);
      formSaveResult = await user.functions.saveProfile(body);
      res.status(200).json({ data: `${body.first} ${body.last}` });

    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  };

