# Mongo DB cheat sheet.
This document helps to learn and remember basic mongo db concepts and querying. 

## Features
- Mongodb is schemaless.
- Saves data in database as **collection**. Collection can be related to tables in a sql database.
- Collection will have documents (data). Can be related to each entry/row in a sql table.
- Data in a collection doesnt need to have same schema/structure.

## Mongo Shell
Basic shell commands.
```sh
show dbs: Display the available databases
use <database_name>: connect to a database and can query the database.
```
## Data in MongoDB
- Data in mongo db will be saved in bson format.
  - Bson is similar to json but support extra data types than json(json usually have string and numbers.)
  - Its more efficient to save data in Bson than json.
  - ObjectId is a special datatype. Every document created in a collection will have an ObjectId created by default (saved as _id).
- Document in a collection doesnt need to have same schema.

## Data Types in mongo.
Following datatypes are supported by mongodb.
- Text (string)
- Boolean
- Numbers
   - Integer (32)
   - Long (int 64)
   - Decimal
- ObjectId ( eg: `ObjectId('kishor')` )
- IsoDate -> `2018-09-21`
- Timestamp -> `11451328`
- Embedded Document (document embedded in another document.)
- Arrays

## CRUD Operations
### Create
Creates a new document to a collection.
`insertOne(data, options)`: Insert One document to a collection.
`insertMany(data, options)`: Insert Multiple documents to a collection.
### Read
Helps to read/find a document from a collection.
`find(filter, options)`: Finds all the matching document from a collection.
`findOne(filter, options)`: Finds the first matching document from a collection.
### Update
`updateOne(filter, data, options)`: Updates the first document which is mached by the filter criteria.
`updateMany(filter, data, options)`: Updates all the document matched by the filter criteria.
`replaceOne(filter, data, options)`: Replaces the entire document with data (one document matched by the filter criteria).

### Delete
`deleteOne(filter, options)`: Delete the first document matching the filter condition
`deleteMany(filter, options)`: Deletes all the document matching byt the filter condition.

## Create
We can inserts single document or multiple doucment to mongo db.
`insertOne(data, options)`
```sh
db.user.insert({
  firstName: 'Kishor',
  lastName: 'Jagadeesan',
  email: 'kishorjagadeesan@hotmail.com'
})
```
`insertMany(data, options)`
```sh
db.user.insert([
  { firstName: 'Kishor', lastName: 'Jagadeesan', email: 'kishor@test.com' },
  { firstName: 'Harry', lastName: 'Potter', email: 'harry@test.com' },
])
```
**Note:** When we insert a document to a collection, mongo db will add a *unique id* to each document with field name as `_id`. We can also specify an id while inserting with field as `{_id: '<unique_id>'}`. If we are passing an id, then we need to make sure the id is always unique.

### Find
- Find is used to get/search document in a collection.
- We can use `find` or `findOne` to get the document.
- Find will not send the entire document but instead it will send the cursor. This is because the collection may have many matching document, sending all willl be in efficient. cursor can be iterated to get each document.
- In shell we can use `cursor.toArray` to get all the document of a cursor as an array

**Sample user Document**
```js
{
  firstName: 'Kishor',
  lastName: 'Jagadeesan',
  middleName: '',
  email: 'kishorjagadeesan@hotmail.com',
  sex: 'male',
  phone: 9999999999,
  address: {
    building: '#123, 3rd floor',
    area: 'HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pin: '560107'
  }
}
```
Find all the male users.
```js
db.user.find({sex: 'male'})
- Returns the all the documents matching the criteria.
```
Find a user with email id.
```js
db.user.findOne({email: 'kishor@test.com'})
- Returns the first doucument matching the criteria (even if there are multiple document, it returns the first mathcing document.).
```
We can search with embedded document properties.
```js
db.user.find({'address.pincode': '560107'})
- address is an embedded document and pincode is one of the attribute in that document. We can search using attributes of embedded document using '.'
```

## Projection
Find will return all the matching document and the document will have all the attributes. In case we want only some **specific fields** from a document, then we can use projection. To use projection we need to pass the second argument to find with the fields that we need to retrieve.
This will allow filtering the required fields from the mongo db itself so that we dont have to restructure the data on backend.
```js
projection to return only firstName, and lastName from the user document.
db.user.findOne({ email: 'kishor@test.com' }, { firstName: 1, lastName:1 })
```
The second argument is passed as `{ firstName: 1, lastName:1 }`. This will return only firstName and lastName.
* <field_name>: 1 => will return the field
* <field_name>: 0 => will not return the field (by default )

By default in a projection all the field names are 0, so we just need to set 1 for the fields that we want.
**Note:** `_id` is returned always. If want to excude the _id field from the projection, then we need to explicityl specify that with `{_id: 0}` 

## Update
Update is used to update the document.
`$set` is a special attribure which will tell mongodb to set the values for the fields. it will take a dictonay as value where we can specify the field name and the value that need to be updated. If a field is not exist, then mongo will add that field.

*updateOne*
```sh
db.user.updateOne({sex: 'male'}, {$set: {middleName: 'Middle'}})
updates middlename to 'Middle' for the first male users.
```

*updateMany*
```sh
db.user.updateMany({sex: 'female'}, {$set: {middleName: 'Middle', 'address.city': 'Delhi'}})
updates middleName, city for all the female users.
```

*replaceOne*
```sh
db.user.replaceOne({emaIl: 'kishor@test.com'}, {middleName: 'Middle', 'address.city': 'Delhi'})
Entire document will be replaced with the given data except _id
```
*update:* update can be used with or without `$set`. If called without set, then it will replace the entire document with the given **data**. with `$set`, it will work the same way as updateMany.

**Note:** It is recommended to use replaceOne instead of update.

## Delete.
Used to delete document from a collection.

*deleteOne*
```js
db.user.deleteOne({email: 'kishor@test.com'})
Delete one deletes the fist matching document.
```

*deleteMany
```js
db.user.deleteMany({'address.city': 'Delhi'})
Deletes all the users from city Delhi.
```

## Mongo db shell
Some of the mongo db shell APIs.
### createCollection.
We can create a collection in mongodb with a validator. By default mongo document is schemaless. If we want to follow a schema we can add this validator, and if any document doesnt satisfy this validation, then mongo will reject the document or insert it with a warning based on the configuration.

*sample validator*
```sh
db.createSchema('post', {
  vaildator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [ "title", "text", "description" ],
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
  validationAction: 'warn'
})
```
* In **required** section we can specify which are all the fields are required for this document.
* Under **properties** section, we can define the data types for each of the field and an error message. This is optional, if not given mongo will give a default error message.
* **validationAction** is *error* by default, in case of *error*, if any validator property is not satisfied, mongo will reject the document insertion. If set to *warn*, then mongo will insert the data with a warning.


### Drop a database/collection.
```js
db.dropDatabase():  Drops the database.
db.<collection>.drop(): Drops the collection from a database.
```

### db.runCommand
To modify a validator, use **runCommand**.
```js
db.runCommand({
    collMod: "posts",
    validator: {<new validator schema}
});
- collMod -> collectionModifier 
```

## Data Modelling.
Mongo is schemaless by default but we keep some schema/structure while saving the data so that it can be used properly in the backend. Complete schemaless approach will be difficlut to handle/structure the data on backend.
While modelling our collection/document, we can consider the following points.
* Consider how we should fetch the data for our application, desing the model suitable for that so that it will be easy to fetch/insert data.
* We can use embedded document or we can create another collection and keep a reference on the document. This is depends on our need. If the data doesnt change so freequently, thenw we can keep embedded document, else we can add a separate document and keep a reference.
* Single document in mongo has a size limit of `16MB` including the embedded document. When we keep embdedded document, make sure that the document will not grow to hit this limit. In those cases, create a separate collection and keep the reference in this document.

## Inserting Data.
### OrderedInsert
When performing bulk insert, in case of any error in one of the entry, then already inserted documents will be in the db, but mongo will skip the remaning documents from the error document. This can be controlled with the `ordered` property while inserting. set ordered to false, then mongo will **only skip the error document** and continue inserting the remaining.

```js
db.user.insertMany([<data>], {ordered: false})
```
### write concern
While writing to db, mongo by default writes to memory then later writes to the disk. We can set writeConcern, so that mongo will  write the data to a **journal** (another text file), before writing to the disk. In case mongo restarts, data wont be lost and can be recovered from the journal.
```js
{ w:1, j:undefined } // default with no journal
{ w: 1, j:true } // with journal
{ w: 1, withtimeout: <ms>, j: true }. //journal with timeout, responds back to client(backend) within the timeout
```

### Atomicity
Mongodb will provide automicity for individual document level (insertOne). If any embedded document insertion fails, mongo will rollback that insert.

### Import/Export data
we can import data to mongo from json and export as json.

*import data as json*
```sh
mongoimport <json_file> -d <database_name> -c <collection_name> --jsonArray
```

*export data from mongo*
```sh

```
## Select (find) operation
* `$gt`: Greater than
* `$lt`: Less than.
* `$eq`: Equal to
* `$ne`: Not equal to
* `$lte`, `$gte`: less than/greater than or equal to

*example*
```js
db.user.find({ salary: 10000 }) // salary = 10000
db.user.find({ salary: { $eq: 10000 }}) // salary = 10000
db.user.find({ salary: { $gt: 10000 } }) // salary > 10000
db.user.find({ salary: { $lt: 10000 } }) // salary < 10000
```

**Sample movie Document**
```js
{
    "_id": ObjectId("62c6ee5cb11e4d749332b3c1"),
    "url":"http://www.tvmaze.com/shows/5/true-detective",
    "name":"True Detective",
    "type":"Scripted",
    "language":"English",
    "genres":["Drama","Crime","Thriller"],
    "status":"Running",
    "runtime":60,
    "premiered":"2014-01-12",
    "officialSite":"http://www.hbo.com/true-detective",
    "rating":{
        "average":8.3
    },
    "network":{
        "id":8,
        "name":"HBO",
        "country":{
            "name":"United States",
            "code":"US",
            "timezone":"America/New_York"
        }
    },
    "image":{
        "medium":"http://static.tvmaze.com/uploads/images/medium_portrait/0/61.jpg",
        "original":"http://static.tvmaze.com/uploads/images/original_untouched/0/61.jpg"
    },
    "summary":"<p>Touch darkness and darkness touches you back. <b>True Detective</b> centers on troubled cops and the investigations that drive them to the edge. Each season features a new cast and a new case.</p>",
    "updated":1536053668
}
```

### Querying Array
*get movie with genres as Drama*
```js
db.movies.find({ genres: 'Drama' }) // get all movie with Drama
This will return all the document which has Drama.
```

*exact match for array*
```js
db.movies.find({ genres: ['Drama', 'Action'] }) // exact match even the order.
```
**Note**: In above example, the genres order also matters. If we dont want to check order(that will the actual scenario.) we can use `$all`.
```js
db.movies.find({ genres: { $all: ['Drama', 'Action'] }}) // exact match even the order.
```

*in/not in operator*
```js
db.movies.find({ genres: { $in: ['Drama', 'Action'] }}) // All drama and action movies.
db.movies.find({ genres: { $nin: ['Drama', 'Action'] }}) // not Drama, action movies.
```
**Note**: 


*or operator*
```js
db.movies.find({ $or: [ 
                    { rating: {$gt: 9 }},
                    { rating: {$lt: 5 }}
            ]})
- All  the movies  with rating greater than 9 or less than 5.
```

*not/ne*
```js
db.movies.find({ runtime: { $not: { $eq: 60 } }}) // runtime not equal to 60.
- or -
db.movies.find({ runtime: { $ne: 60 }}) 
```
**Note:** There are also `$nor`, `$and` operators.

*$exists*
Checks any field exist in a document.
```js
db.user.find({ phone: { $exists: true }}) // returns all the document with phone. This will return even if phone is null

db.user.find({ phone: { $exists: true, $ne: null }}). // Document with phone exists and that is not null.
```

*$type*
Checks the type of a field.
```js
db.user.find({ phone: { $type: 'string' }}) // all document with phone as a string.
```

*regex*
```js
db.movies.find({ name: { $regex: '/The/' }}) // all movies having The (regex).
```

*expr (compare two field values)*
expr is used to compare two fields in a document and returns the matching result.
```js
db.sales.find({ $expr: { $gt: ["$volumen", "$target"] }})
```
Returns all the document where volume is greater than target. *$volume* and *$target* are fields from the document. 

*$size*
Can be used to check the size of an array.
```js
db.user.find({ hobbies: { $size: 3 }}) // return all the users with exactly 3 hobbies.
```
**Note**: we cant use `$gt` or `$lt`. It need to be exact match.

***$elemMatch***
This can be used to match condition on an array.
**Problem**: Consider following query.
```js
db.user.find({ $and: [ 
                { hobbies.title: 'Sports' },
                { hobbies.frequency: { $gt: 2 }},
            ]})
```
This will return all the document with hobbie as Sports or frequency greater than 2. It  will not ensure both this condition on a single document. ie. Say user has hobbies array and hobby has cricket and frequency as 1 and football frequency as 2. now both are sports and one of them has frequency 2. so this document will be picked. **It will not check the condition on a single array element** To overcome this we can use `$elemMatch`.

*elemMatch example*
```js
db.user.find({ hobbies: { $elemMatch: { title: 'Sports', frequency: { $gt: 2 }}}})
-  Checks this condition on each array element.
```

## Sorting
sort function can be appliend on cursor.
```js
db.movies.find({}).sort({ name: 1, rating: -1 })
```
Sorting options are:
* 1: ascending
* 2: descending

### Pagination
Following functions will be helpful for paginated results.
***skip***
```js
db.movies.find({}).skip(10)
- This will skip 10 records.
```
***limit***
```js
db.movies.find({}).limit(10)
- This will bring 10 records.
```
**Note**: When applying skip or limit, mongo will apply the sort then do this operations.

### Projection on Array
```js
db.movies.find({ genres: { $all: ["Drama", "Horror"] } }, { "genres.$": 1 })
- Will return document with genres as ["Horror"]
```
***$slice***
```js
db.movies.find({ ratings: { $gt: 5 }}, { genres: { $slice: 2 }})
- Will bring document but only first 2 elements from geners.
```

## Update Operations
We mainly use `updateOne` and `updateMany` to update the documents.

***$set***
Can be used to set/update one or more fields in a document. If any field is not there, then it will create that field.
```js
db.user.updateOne(
    { 'email': 'kishor@test.com' },
    { $set: { phone: '99999999', 'address.city': 'Bangalore' } }
)
```

***$inc***
Can be use to increment a number field.
```js
db.user.updateOne(
    { 'email': 'kishor@test.com' },
    { $inc: { age: 2 } }
)
- Increment age by 2.
```

* `$min`: Update only if the incoming value is less than then current value.
* `$max`: Update only if the incoming value is greater than then current value.
* `$mul`: Used to multiply the existing value by given value.

***Remove a field ($unset)***
We can use `$unset` to remove a field.
```js
{ $unset: { phone: '' } } // will remove a field.
```

***Rename a field ($rename)***
```js
{ $rename: { $age: "userAge" } } // Rename age field to userAge
```

***upsert***
updateOne will update if the document is not there. For **createOrUpdate**, we can pass a third argument `{ upsert: true }`

## Update Array.
We can use `$elemMatch` to match the element then update the array.
then set the data.
```js
{ $set: { "hobbies.$": { <newData> }}} //hobbies is the array
```

*To set a new field to array*
```js
{ $set: { hobbies.$.<new_field>: {<data>} }} // add new field to first matching element.
{ $set: { hobbies.$[].<new_field>: {<data>} }} // update all the matching element.
```
* `hobbies.$`: Updates only the first occurance.
* `hobbies.$[]`: Updates all array elements.

**All the above methods will update all the elements of an array. To update only the array element we can use `arrayFilter` as a third argument.
```js
{ <filter condition> }, // filter condition
{ $set: { "hobbies.$[el].<field>": <value> } }, // set fields
{ arrayFilter: [ { 'el.frequency': { $gt: 2 } }]} // third argument for filter (basically tells whats el is)
-- Apply the update for the array elements where the frequency is greater than 2.
```

### Adding/removing element
***$push***
```js
{ $push: { hobbies: <document/element> } }
```

**pusing multiple element.
```js
{ $push: { hobbies: { $each: [el1,  el2] } } }
-- we can specify the sort order while inserting. { $sort: { frequency: 1}} }
```

### Delete element from Array
***$pull***
`$pull` can be used to remove elements from array.
```js
{ $pull: { hobbies: {title: "sports" } }}
- delete all the elements from hobbies array with title as sports.
```

***$pop***
`$pop` can be used to delete first or last element from an array.
```js
{ $pop: { hobbies: 1 }} // 1 or -1
```
* 1 => delete last element from the array
* -1 => deletes the first element from the array.

***$addToSet***
`$addToSet` can be used instead of `$push`. push insert duplicate elements to an array but add to set will insert only unique elements.

## Aggregate
pipeline of steps to retrieve data/documents.
There are four steps usually applied to get the final result.
```
Document -> { $match } ->  { $sort } -> { $group } -> { $project } -> output
```
***$match***
First step of aggregation, this is similar to find where we can filter the document. The filtered data will be passed to next step.

***$group***
Second step, We can apply some aggregate function.
```
db.persons.aggregate[
    { $match: { gender: 'female' } }, // filter all females.
    { $group: {_id: {state: 'address.state' },  totalPerson: { $sum: 1 } } }
]
```
Applies a group by function based on state, and sums the total document and assignes to totalPerson key.

***$project***
Similar to project operation on find. Where we can include/exclude fields. Here we can derive new fields from existing. 
```js
db.persons.aggregate[
    { $match: { gender: 'female' } }, // filter all females.
    { $project: { gender: 1, fullName: { $concat: [ "$firstName", "", "$lastName" ] } } }
]
- fullName is a new field which is created by concatinating with existing fields.
```
*We can typecast field to new data types.*
```js
{ $convert: { input: "$<fieldName>", to: "double", onError: 0.0, onNull: 0.0 } }
```
There are shortcuts to convert to types like.
* `$toDate`: Converts to date
* `$toDouble`: Convert to double

### Combining arrays during grouping.
We can use `$unwind` to unwind array and then apply grouping get document for each entry.
unwind creates entire document for each element in an array.

```js
{ $unwind: "$hobbies" }
```
This will create  document for each hobbies and we can further filter them.

***slice***
`$slice` can be used to get specific number of elements from an array **during projection**.
```js
{ $project: { hobbies: { $slice: [ "$hobbies": 1 ] } } }
- Returns the first element from the array.
$slice [ <Array>, <index>, <number of elements> ]
```

## Aggregate examples.
```js
// Aggregate function group by state and get the count
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
```
