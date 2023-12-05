const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({dest: __dirname + "/public/images"});

mongoose
    .connect("mongodb://localhost/breeds")
    .then(()=>{
        console.log("Connected to mongodb");
    })
    .catch((error) => {
        console.log("Couldn't connect to mongodb", error);
    });

const breedSchema = new mongoose.Schema({
    name: String,
    origin: String,
    lifespan: String,
    img: String,
    personality: [String],
    appearance: [String],
});

const Breed = mongoose.model("Breed", breedSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/breeds", (req, res) => {
    getBreeds(res);
});

const getBreeds = async (res) => {
    const breeds = await Breed.find();
    res.send(breeds);
};

app.get("/api/breeds/:id", (req, res) => {
    getBreed(res, req.params.id);
});

const getBreed = async (res, id) => {
    const breed = await Breed.findOne({ _id: id});
    res.send(breed);
};

app.post("/api/breeds", upload.single("img"), (req, res) => {
    const result = validateBreed(req.body);
    console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const breed = new Breed({
        name: req.body.name,
        origin: req.body.origin,
        lifespan: req.body.lifespan,
        personality: req.body.personality.split(","),
        appearance: req.body.appearance.split(","),
    });

    if(req.file) {
        breed.img = "images/" + req.file.filename;
    }

    createBreed(res, breed);
});

const createBreed = async (res, breed) => {
    const result = await breed.save();
    res.send(breed);
};

app.put("/api/breeds/:id", upload.single("img"), (req, res) => {
    const result = validateBreed(req.body);
    console.log(result);
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateBreed(req,res);
});

const updateBreed = async (req,res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        origin: req.body.origin,
        lifespan: req.body.lifespan,
        personality: req.body.personality.split(","),
        appearance: req.body.appearance.split(","),
    };

    if(req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Breed.updateOne({ _id: req.params.id}, fieldsToUpdate);
    res.send(result);
};

app.delete("/api/breeds/:id", (req,res) => {
    removeBreed(res, req.params.id);
});

const removeBreed = async (res, id) => {
    const breed = await Breed.findByIdAndDelete(id);
    res.send(breed);
};

function validateBreed(breed) {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        personality: Joi.string().min(3).required(),
        appearance: Joi.string().min(3).required(),
        origin: Joi.allow(""),
        lifespan: Joi.allow(""),
        img: Joi.allow(""),
    });

    return schema.validate(breed);
}

app.listen(3005, () => {
    console.log("listening");
});