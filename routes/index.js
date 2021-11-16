var express = require('express');
var router = express.Router();
const { MongoClient, ObjectID } = require("mongodb");
var debug = require('debug')('trabajocluster:index');


const uri = `mongodb+srv://${MYMONGOCONFIG}/airlines_on_time/?maxPoolSize=20&w=majority&readPreference=secondaryPreferred`;
// {_id: ObjectId('6192f5dca376e6bb1edea9ec')}
const client = new MongoClient(uri);
// run();

const run = async () => {
  try {
    // Connect the client to the server
    const db = await client.connect();
    
    const database = client.db("airlines_on_time");
    
    const flights = database.collection("flights");
  
    return {database, flights, db};
  } catch(error) {
    // Ensures that the client will close when you finish/error
    debug(error);
  }
}



/* GET home page. */
router.get('/', function(req, res, next) {
  run().catch(console.dir);
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/flights', async  function(req, res, next) {
  try{
    debug(req.params);
    
    const {year, flightNum} = req.query;
    debug({year, flightNum});

    const {flights, db} = await run();

    const year2 = parseInt(year);
    const flightNum2 = parseInt(flightNum);
    flights.find({Year: year2, FlightNum: flightNum2}).toArray(function(err, result) {
      if (err) throw err;
      debug(result)
      db.close();
      res.send(result);
    });


  }catch(error){
    debug(error);
    res.status(400).send('Error trying to read flights');
  } 
});

/* GET home page. */
router.post('/flights', async  function(req, res) {
  try{
    debug(req.body);

    const {database, flights, db} = await run();

    const {year, month, dayofMonth, depTime, arrTime, flightNum,  uniqueCarrier, origin, dest} = req.body;
  
    const Year = parseInt(year); 
    const Month = parseInt(month); 
    const DayofMonth = parseInt(dayofMonth); 
    const DepTime = parseInt(depTime); 
    const ArrTime = parseInt(arrTime); 
    const FlightNum = parseInt(flightNum); 

    const object = {Year, Month, DayofMonth, DepTime, ArrTime, FlightNum, Origin: origin, Dest: dest, UniqueCarrier: uniqueCarrier};

    flights.insertOne(object, function(err, response){
      if (err) throw err;
      debug("1 document inserted");
      db.close();
      res.status(200).send('Flight inserted');
    });
    
  }catch(error){
    debug(error);
    res.status(400).send('Error trying to insert flight');
  } 
});

router.put('/flights', async  function(req, res) {
  try{
    debug(req.body);

    const {database, flights, db} = await run();

    const {id, year, month, dayofMonth, depTime, arrTime, flightNum,  uniqueCarrier, origin, dest} = req.body;
  
    const Year = parseInt(year); 
    const Month = parseInt(month); 
    const DayofMonth = parseInt(dayofMonth); 
    const DepTime = parseInt(depTime); 
    const ArrTime = parseInt(arrTime); 
    const FlightNum = parseInt(flightNum); 

    const newValues = { $set: {Year, Month, DayofMonth, DepTime, ArrTime, FlightNum, Origin: origin, Dest: dest, UniqueCarrier: uniqueCarrier}};
    debug(newValues);

    flights.updateOne({"_id": new ObjectID(id)}, newValues, function(err, response) {
      if (err) throw err;
      debug(response)
      debug("1 document updated");
      db.close();
      res.status(200).send('Flight updated');
    });
    
  }catch(error){
    debug(error);
    res.status(400).send('Error trying to update flight');
  } 
});

router.delete('/flights', async  function(req, res) {
  try{
    debug(req.body);

    const {database, flights, db} = await run();

    const {id} = req.body;

    flights.deleteOne({"_id": new ObjectID(id)}, function(err, obj) {
      if (err) throw err;
      debug(obj)
      debug("1 document deleted");
      db.close();
      res.status(200).send('Flight deleted');
    });
    
  }catch(error){
    debug(error);
    res.status(400).send('Error trying to delete flight');
  } 
});


router.get('/flights/specific', async  function(req, res, next) {
  try{
    debug(req.params);
    
    const {id} = req.query;
    debug({id});

    const {flights, db} = await run();


    flights.findOne({"_id": new ObjectID(id)}, function(err, result) {
      if (err) throw err;
      debug(result)
      db.close();
      res.send(result);
    });

  }catch(error){
    debug(error);
    res.status(400).send('Error trying to read specific flight');
  } 
});

module.exports = router;
