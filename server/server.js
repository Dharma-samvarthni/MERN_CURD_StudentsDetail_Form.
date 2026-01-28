require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ------------------ DATABASE ------------------ */

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* ------------------ MODEL ------------------ */

const Person = mongoose.model(
  "Person",
  {
    name: String,
    regNo: String,
    age: Number,
    dob: String,
    department: String,
    email: String,
    year: Number,
    phnNo: String,
    skills: String,
    address: String
  },
  "person"
);

/* ------------------ ROUTES ------------------ */

// READ
app.get("/", async (req, res) => {
  const people = await Person.find();
  res.json(people);
});

// CREATE
app.post("/", async (req, res) => {
  const newPerson = await Person.create(req.body);
  res.json(newPerson);
});

// UPDATE
app.put("/:id", async (req, res) => {
  const updated = await Person.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE
app.delete("/:id", async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.json({ message: "Person deleted" });
});

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:5000");
});
