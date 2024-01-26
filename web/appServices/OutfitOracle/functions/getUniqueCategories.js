exports = async function(arg){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "GucciGang";
  var collName = "styles";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  /*
  function getUniqueCategories() {
  const client = await clientPromise;
  const db = client.db("store");
  const collection = db.collection("products");
  const uniqueCategories = await collection.distinct("category").toArray();

  return uniqueCategories;
}`;

  */
  

  var findResult;
  try {

    const uniqueCategories = await collection.distinct("masterCategory");
    return uniqueCategories;
  } catch(err) {
    console.log("Error while building category list", err.message);

    return { error: err.message };
  }
};