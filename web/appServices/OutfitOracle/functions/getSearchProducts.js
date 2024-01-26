

exports = async function(arg){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  console.log(JSON.stringify({arg: arg}));
  let ProductResultsSearchId = arg;
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "GucciGang";
  var collName = "ProductResults";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  let findResult = null;
  try {

    // Execute a FindOne in MongoDB 
    findResult = await collection.aggregate(
      [
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        searchID: ProductResultsSearchId,
      },
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        docs: 1,
        _id: 0,
      },
  },
  {
    $unwind:
      /**
       * path: Path to the array field.
       * includeArrayIndex: Optional name for index.
       * preserveNullAndEmptyArrays: Optional
       *   toggle to unwind null and empty values.
       */
      {
        path: "$docs",
      },
  },
  {
    $replaceRoot:
      /**
       * replacementDocument: A document or string.
       */
      {
        newRoot: "$docs",
      },
  },
]
    ).toArray();

  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);
  console.log(JSON.stringify({result: findResult}));
  return findResult;
};