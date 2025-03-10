const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modles/listing.js");

mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_Url);
}

async function init() {
  await Listing.deleteMany({});
  initData.data = initData.data.map((x) => ({
    ...x,
    owner: "65e9fb233d7a57992ba66c91",
  }));
  await Listing.insertMany(initData.data);
  console.log("data initialized successfully");
}

init();
