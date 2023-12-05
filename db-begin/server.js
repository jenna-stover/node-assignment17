const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://jennastover810:vigmMrzL5iGkqDeU@clusterassignment17.ydj7558.mongodb.net/?retryWrites=true&w=majority")
    .then(()=>console.log("Connected to mongodb"))
    .catch(error => console.log("Couldn't connect to mongodb", error));


const breedSchema = new mongoose.Schema({
    name: String,
    origin: String,
    lifespan: String,
    personality: [String],
    appearance: [String],
});

const Breed = mongoose.model("Breed", breedSchema);

const createBreed = async () => {
    const breed = new Breed({
        name: "Russian Blue",
        origin: "Arkhangelsk, Russia",
        lifespan: "15-20 years",
        personality: ["Sweet", " Loyal", " Shy"],
        appearance: ["Short-haired", " light-dark grey coat"],
    });

    const result = await breed.save();
    console.log(result);
}

createBreed();