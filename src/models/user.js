const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 100,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: 18,
    },
    gender: {
      type: String,
      default: "male",
      //customvalidation
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender can be male , female or other");
        }
      },
    },
    photo_url: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1451587807/it/vettoriale/vettore-dellicona-del-profilo-utente-avatar-o-icona-della-persona-immagine-del-profilo.jpg?b=1&s=170x170&k=20&c=xNUdw9AFqAr9co18eDQPoahFxSlTr7VX5qwGPHPXtIc=",
    },
    about: {
      type: String,
      default: "Hello! I am using DevTinder.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
