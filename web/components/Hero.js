import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
//import * as Realm from "realm-web";
//import Link from "next/link";
import Modal from './Modal'; // Adjust the path according to your file structure
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import ImagePreview from "./ImagePreview";
import CustomFileSelector from "./CustomFileSelect";
//import process from "process";

const Hero=() =>
{
  const router=useRouter();
  //const [selectedImageId, setSelectedImageId] = useState("");
  //const [selectedImageSearchId, setSelectedImageSearchId] = useState("");
  //const [selectedImageLink, setSelectedImageLink] = useState("");
  //const [prompt, setPrompt] = useState("");
  //const [images, setImages] = useState([]);
  const [ image, setImage ]=useState("");
  const [ imageBase64, setImageBase64 ]=useState("");
  const [ engineProcessing, setEngineProcessing ]=useState(false);
  const [ number, setNumber ]=useState(1);
  const [ prompt, setPrompt ]=useState('');

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

  function convertFileToBase64(file)
  {
    return new Promise((resolve, reject) =>
    {
      const reader=new FileReader();
      reader.readAsDataURL(file);
      reader.onload=() => resolve(reader.result);
      // Typescript users: use following line
      // reader.onload = () => resolve(reader.result as string);
      reader.onerror=reject;
    });
  }

  /*
  useEffect(() => {
    getImagesFromDB()
  }, []);
  */

  const [ isModalOpen, setIsModalOpen ]=useState(false);
  const [ selectedImage, setSelectedImage ]=useState(null);

  const handleImageClick=(image) =>
  {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal=() =>
  {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleSubmit=async (event) =>
  {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
    console.log("form submitted");
    setEngineProcessing(false);

    //clear all intervals
    for (var i=1; i<99999; i++) {
      window.clearInterval(i);
    }

    window.owl_displayMessage("Here we go!");


    const data={
      prompt: event.target.prompt.value,
      image: imageBase64,
      //email: "jay.runkel@mongodb.com",
      //profile: profile
    }

    // Send the data to the server in JSON format.
    const JSONdata=JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint='/api/sendReqToAIEngine';

    // Form the request for sending data to the server.
    const options={
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      // Body of the request is the JSON data we created above.
      body: JSONdata
    }

    console.log("sending data: ", JSONdata);

    const intervalId=setInterval(callSearchProgress, 7000); // Call every 7 seconds



    try {
      // Make an API call to the route you created in step 2

      const response=await fetch(endpoint, options);
      /*
      const response = await axios({
          method: "post",
          url: "/api/saveProfileForm",
          data: formDataToSend,
          headers: { "Content-Type": "multipart/form-data" },
        });
      */

      const resBody=await response.json();
      console.log(resBody);

      //alert(`Presenting search ID data: ${resBody}`)
      setEngineProcessing(false);
      //alert(`[hack] Presenting search ID data: ${selectedImageSearchId}`)

      clearInterval(intervalId);
      setNumber(1);
      //clear all intervals
      for (var i=1; i<99999; i++) {
        window.clearInterval(i);
      }
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

  const handlePromptChange=(event) =>
  {
    setPrompt(event.target.value);
  };

  const callSearchProgress=async () =>
  {
    const customerId="65ab11d6f647fac4814d40df"
    const payload={
      prompt: prompt,
      customerId: customerId,
      search_Id: "2",
      number: number,
    };

    try {
      const progress_response=await fetch('/api/searchProgress', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload),
      });

      if (progress_response.ok) {
        const progress_data=await progress_response.json(); // Parse the JSON response
        console.log("progress_data: ", progress_data);
        window.owl_displayMessage(progress_data.message, 10);
        setNumber(number+1); // Increment the number
        console.log("number: ", number);
      } else {
        // Handle non-OK responses
        console.error('Non-OK response:', await progress_response.text());
      }



      console.log("Full progress_response:", progress_response);
    } catch (error) {
      console.error('Progress error:', error);
      window.owl_displayMessage(error);
    }
  };

  /*// useEffect hook to set up the interval
  useEffect(() =>
  {
    const intervalId=setInterval(callSearchProgress, 7000); // Call every 7 seconds

    return () => clearInterval(intervalId); // Cleanup function to clear interval
  }, [ number ]); // Dependency array includes number to update it in interval calls
*/

  const getAIStatus=() =>
  {

  }
  const handleImageChange=(e) =>
  {
    if (e.target.files) {
      //convert `FileList` to `File[]`
      const _files=Array.from(e.target.files);
      const filesCopy=_files.slice(0, 1);
      setImage(filesCopy[ 0 ]);

      convertFileToBase64(filesCopy[ 0 ])
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
      <div className="grid grid-container gap-4">
        <div className="h-300">
          <div className="owl_parentContainer" id="owl_container">
            <img class="owl_owlImage" src="./owl_speech_bubble/owl.jpeg" alt="Owl" />
            <div id="owl_bubble">
              <canvas id="owl_canvas1" width="300px" height="300px"></canvas>
              <div id="owl_speechText"></div>
            </div>
          </div>
        </div>
        <script src="./owl_speech_bubble/speech_bubble.js"></script>
        <div className="flex justify-end"> {/* This will push the child elements to the right */}
          <div className="max-w-xs">
            <form name="promptForm" onSubmit={handleSubmit} className="w-300">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prompt">
                Describe Your Dream Outfit
              </label>
              <textarea id="prompt" rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Describe your dream outfit..." onChange={handlePromptChange}></textarea>
              <div className="grid grid-cols-4 gap-4 mt-4"> {/* Adjusted grid for nested elements */}
                {/* File selector and submit button */}
                <div className="col-span-3 flex flex-col space-y-4"> {/* 75% width */}
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Provide Sample Outfit Picture
                  </label>
                  <CustomFileSelector accept="image/png, image/jpeg" onChange={handleImageChange} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                  <button className="flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm uppercase font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500 w-full" type="submit">
                    <span>Hoot @ Outfit Oracle</span>
                    <ArrowNarrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
                {/* Image preview */}
                {image&&(
                  <div className="col-span-1"> {/* 25% width */}
                    <ImagePreview
                      images={[ image ]}
                      className="w-full h-auto" /* Adjusted height for responsive behavior */
                      onClick={handleImageClick}
                    />
                  </div>
                )}
              </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <img src={selectedImage} alt="Selected" />
            </Modal>
          </div></div></div>
    </div>
  );
};

export default Hero;
