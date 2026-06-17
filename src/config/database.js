const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anushkanemishte_db_user:lhDSbJVYGaxLlj7k@nodejspractice.3g4v8d8.mongodb.net/DevTinder",
  );
};




module.exports = connectDB