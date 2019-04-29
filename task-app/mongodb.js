const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-app';

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log('Error! Unable to connect to database');
    }
    const db = client.db(databaseName);

    db.collection('users')
      .deleteMany({ age: 22 })
      .then(result => console.log(result))
      .catch(error => console.log(error));

    // db.collection('tasks')
    //   .updateMany({ completed: false }, { $set: { completed: true } })
    //   .then(result => console.log(result))
    //   .catch(error => console.log(error));

    // db.collection('tasks')
    //   .find({ completed: false })
    //   .count((error, count) => {
    //     console.log(count);
    //   });

    // db.collection('users').findOne(
    //   { _id: new ObjectId('5cc5f43174f9bb37b0cb2f0d') },
    //   (error, user) => {
    //     if (error) {
    //       return console.log(error);
    //     } else if (!user) {
    //       return console.log('No user found!');
    //     }

    //     console.log(user);
    //   }
    // );

    // db.collection('users').insertOne(
    //   {
    //     name: 'Rob',
    //     age: 22
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert user.');
    //     }

    //     console.log(result);
    //   }
    // );

    // db.collection('tasks').insertMany(
    //   [
    //     {
    //       description: 'Buy water',
    //       completed: true
    //     },
    //     {
    //       description: 'Sleep',
    //       completed: true
    //     }
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert users.');
    //     }

    //     console.log(result.ops);
    //   }
    // );

    //   console.log('Connected to MongoDB database.');
  }
);
