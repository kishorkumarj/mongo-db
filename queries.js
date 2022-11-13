//aggregate function group by state and get the count
db.persons.aggregate([
  { $match: { gender: "female" }},
  { $sort: { "name.title": 1 }},
  { $group: { _id: { state: "$location.state" }, totalPerson: { $sum: 1 }}},
  { $sort: { "_id.state": 1 }}
])

// All the user whose age is greater than 45 and group by gender and find the count and avg age.
db.persons.aggregate([
  {$match: {'dob.age': {$gt: 45}}},
  { $group: { _id: { gender: "$gender" }, count: { $sum: 1 }, averageAge: { $avg: '$dob.age' }}}
])

// project: concatinating the existing users first name and lastname.
db.persons.aggregate([
  { $project: {
      _id: 0,
      gender: 1,
      fullName: { $concat: [ {$toUpper: "$name.first"}, " ", {$toUpper: "$name.last"}] },
      dob: { $convert: {input: "$dob.date", to: "date", onError: "", onNull: "" }}
    }
  },
  { $sort: {fullName: 1}}
])

// from list of hobbies array filter only the hobbies with cricket
db.user.aggregate([
  { $match: {"hobbies.title": "Cricket"} },
  { $unwind: "$hobbies" },
  { $match: { "hobbies.title": "Cricket" }},
  { $group: { _id: { _id: "$_id", name: "$name" }, hobbies: { $push: "$hobbies" }}} 
])

db.accounts.aggregate([
  { $match: {_id: ObjectId('6244951a73d4f16268e36773')} },
  { $unwind: "$transactions" },
  { $match: { "transactions.name": { $in: [ "Petrol", "Diesel" ]}}},
  { $group: { _id: {_id: "$_id" }, count: {$sum: 1},  transactions: {$push: "$transactions"}}}
])

// createSchema

db.createSchema('post', {
  vaildator: {
    $jsonSchema: { // tells schema is in json.
      bsonType: 'object', // tells document is an object.
      required: [ "title", "text", "description" ], // these fields in the doucment are required.
      properties: {
        title: {
          bsonType: 'string',
          description: 'Title is required and should be a string.'
        },
        text: {
          bsonType: 'string',
          description: 'text is required and should be a string.'
        }
      }
    }
  },
  validationAction: 'warn' // default is "error".
})