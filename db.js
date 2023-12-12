const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");


async function connet() {
    

const uri = "mongodb://0.0.0.0:27017/";
const client = new MongoClient(uri);
 
    try {
        await client.connect();
        //await client.db("firstTest");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

module.exports={connet};