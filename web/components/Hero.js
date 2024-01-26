import React, { useState} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
//import * as Realm from "realm-web";
//import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import ImagePreview from "./ImagePreview";
import CustomFileSelector from "./CustomFileSelect";
//import process from "process";

const Hero = () => {
  const router = useRouter();
  //const [selectedImageId, setSelectedImageId] = useState("");
  //const [selectedImageSearchId, setSelectedImageSearchId] = useState("");
  //const [selectedImageLink, setSelectedImageLink] = useState("");
  //const [prompt, setPrompt] = useState("");
  //const [images, setImages] = useState([]);
  const [image, setImage] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [engineProcessing, setEngineProcessing] = useState(false);

  /*
  async function getImagesFromDB() {
    // add your Realm App Id to the .env.local file
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const allImages = await user.functions.getAllImages();
      setImages(() => allImages);
    } catch (error) {
      console.error(error);
    }
  }
  */

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      // Typescript users: use following line
      // reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  /*
  useEffect(() => {
    getImagesFromDB()
  }, []);
  */

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
    console.log("form submitted");
    setEngineProcessing(false);

    const data = {
      prompt: event.target.prompt.value,
      image: imageBase64,
      //email: "jay.runkel@mongodb.com",
      //profile: profile
      }
      
      

          
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/sendReqToAIEngine';

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: new Headers ({
        'Content-Type': 'application/json'
        }),
      // Body of the request is the JSON data we created above.
      body: JSONdata
    }
    
    console.log("sending data: ", JSONdata);
    try {
        // Make an API call to the route you created in step 2

        const response = await fetch(endpoint, options);
        /*
        const response = await axios({
            method: "post",
            url: "/api/saveProfileForm",
            data: formDataToSend,
            headers: { "Content-Type": "multipart/form-data" },
          });
        */

        const resBody = await response.json();
        console.log(resBody);
        setEngineProcessing(false);
        //alert(`Presenting search ID data: ${resBody}`)
        //alert(`[hack] Presenting search ID data: ${selectedImageSearchId}`)
      

    router.push({
      pathname: `/products/aiEngine/${resBody.searchID}`
      //pathname: `/products/aiEngine/${selectedImageSearchId}`
      //pathname: `/products/aiEngine/20240117145550948214`
      });
    }
    catch (error) {
        console.error('Error sending request to Outfit Oracle Engine:', error);
    }
  }

  const getAIStatus = () => {

  }

  const handleImageChange = (e) => {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      const filesCopy = _files.slice(0,1);
      setImage(filesCopy[0]);
      
      convertFileToBase64(filesCopy[0])
         .then(result => setImageBase64(result))
         .catch(error => console.error(error));
    }



    // console.log(JSON.stringify(e.target.value));
    // const [image, link, searchId] = e.target.value.split("|");
    // console.log(image);
    // console.log(link);
    // console.log(searchId);
    // setSelectedImageId(image);
    // setSelectedImageLink(link);
    // setSelectedImageSearchId(searchId);
  };

  return ( // overflow-hidden bg-cover bg-center relative
    <div>
      <div className="grid grid-cols-2 gap-4">  
        <Image
          src="https://outfitoracle-mtfxc.mongodbstitch.com/images/owl.png"
          alt="Owl Image"
          width="300"
          height="500"
          //layout="fill"
          //objectFit="cover"
          //className="absolute z-0"
        />
        <div className="grid grid-cols-2 gap-4">
          <form name="promptForm" onSubmit={handleSubmit}>
            <div className="w-300 h-300">
            
             <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="prompt">
               Describe Your Dream Outfit
             </label>    
             <textarea id="prompt" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe your dream outfit..."></textarea>
             <label className="block text-gray-700 text-sm font-bold mt-4 mb-0" htmlFor="image">
               Provide Sample Outfit Picture
             </label>
             <CustomFileSelector accept="image/png, image/jpeg" onChange={handleImageChange}/>
          <div className="">
        <div className="px-10 max-w-xl">
          
            <button className="flex items-center mt-4 px-3 py-2 bg-green-600 text-white text-sm uppercase font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500"
                    type="submit">
              <span>Hoot @Outfit Oracle</span>
              <ArrowNarrowRightIcon className="w-5 h-5" />
            </button>
        
        </div>
        
      </div>
        </div>
        </form>
        <div>   
           <ImagePreview images={[image ? image : null]} className="w-300 h-300"/>

            {
              engineProcessing ?
              <div className="">
                <div id="statusBox">
                  <span id="statusMessage">We are working on your outfit recommendation</span>
                </div>
                <button className={"flex items-center mt-4 px-3 py-2 bg-green-600 text-white text-sm uppercase font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500"} 
                  id="engineProcessing" 
                  type="button"
                  onClick={getAIStatus}>
                  status
                </button>
                </div>
              : null
            }
        </div>
      </div>
    </div>  
  </div>
  );
}; 
   
export default Hero;
