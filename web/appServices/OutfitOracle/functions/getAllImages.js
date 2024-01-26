//import clientPromise from "../lib/mongodb";

exports = async function(arg){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "GucciGang";
  var collName = "userUploads";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);


/*
function getAllProducts() {
  const client = await clientPromise;
  const db = client.db("store");
  const collection = db.collection("products");
  const products = await collection.find({}).toArray();

  return products;
}
*/

 
  try {
 
    const images = await collection.find({}).limit(100).toArray();
    return images;

  } catch(err) {
    console.log("Error occurred while finding all images", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  
};