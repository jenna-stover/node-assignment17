const getBreeds = async () => {
    try {
        return (await fetch("/api/breeds")).json();
    } catch(error) {
        console.log(error);
    };
}

const showBreeds = async () => {
    let breeds = await getBreeds();
    let breedsDiv = document.getElementById("breed-list");
    breedsDiv.innerHTML = "";
    breeds.forEach((breed)=>{
        const section = document.createElement("section");
        section.classList.add("breed");
        breedsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = breed.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(breed);
        };
    });
};

const displayDetails = (breed) => {
    const breedDetails = document.getElementById("breed-details");
    breedDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = breed.name;
    breedDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "&#x2715;";
    breedDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    breedDetails.append(eLink);
    eLink.id = "edit-link";

    const ul = document.createElement("ul");
    breedDetails.append(ul);
    ul.append(getLi(`Breed: ${breed.name}`));
    ul.append(getLi(`Personality: ${breed.personality}`));
    ul.append(getLi(`Appearance: ${breed.appearance}`));
    ul.append(getLi(`Origin: ${breed.origin}`));
    ul.append(getLi(`Average Lifespan: ${breed.lifespan}`));

    let img = document.createElement("img");
    img.src = breed.img;
    breedDetails.append(img);
    
    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Breed";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteBreed(breed);
    };

    populateEditForm(breed);
};

const deleteBreed = async (breed) => {
    const confirmed = window.confirm(`Are you sure you want to delete the breed ${breed.name}?`);

    if (confirmed) {
        let response = await fetch(`/api/breeds/${breed._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
        });

        if (response.status !== 200) {
            console.log("Error deleting");
            return;
        }

        let result = await response.json();
        showBreeds();
        document.getElementById("breed-details").innerHTML = "";
        resetForm();
    } else {
        console.log("Deletion canceled");
    }
};


const getLi = data => {
    const li = document.createElement("li");
    li.textContent = data;

    return li;
};

const populateEditForm = (breed) => {
    const form = document.getElementById("add-edit-breed-form");
    form._id.value = breed._id;
    form.name.value = breed.name;
    form.origin.value = breed.origin;
    form.lifespan.value = breed.lifespan;

    populatePersonality(breed.personality);
    populateAppearance(breed.appearance);
};

const populatePersonality = (personality) => {
    const section = document.getElementById("personality-boxes");

    personality.forEach((trait) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = trait;
        section.append(input);
    });
};

const populateAppearance = (appearance) => {
    const section = document.getElementById("appearance-boxes");
    
    appearance.forEach((trait) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = trait;
        section.append(input);
    });
};

const addEditBreed = async (e) => {
    e.preventDefault();

    const form = document.getElementById("add-edit-breed-form");
    const formData = new FormData(form);
    formData.append("personality", getPersonalityTraits());
    formData.append("appearance", getAppearanceTraits());
    
    let response;
    if(form._id.value == -1) {
        formData.delete("_id");

        response = await fetch("/api/breeds", {
            method: "POST",
            body: formData,
        });
    }else {
        response = await fetch(`/api/breeds/${form._id.value}`, {
            method: "PUT",
            body: formData,
          });
    }

    if(response.status != 200) {
        console.log("error posting data");
        return;
    }
    breed = await response.json();

    if (form._id.value != -1) {
        displayDetails(breed);
      }

    document.querySelector(".dialog").classList.add("transparent");
    resetForm();
    showBreeds();
};

const getPersonalityTraits = () => {
    const inputs = document.querySelectorAll("#personality-boxes input");
    const personalityTraits = [];

    inputs.forEach((input)=>{
        personalityTraits.push(input.value);
    });
    return personalityTraits;
};

const getAppearanceTraits = () => {
    const inputs = document.querySelectorAll("#appearance-boxes input");
    const appearanceTraits = [];

    inputs.forEach((input)=>{
        appearanceTraits.push(input.value);
    });
    return appearanceTraits;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-breed-form");
    form.reset();
    form._id = "-1";
    document.getElementById("personality-boxes").innerHTML = "";
    document.getElementById("appearance-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Breed";
    resetForm();
};

const addPersonality = (e) => {
    e.preventDefault();
    console.log("adding personality trait");
    const personalityBoxes = document.getElementById("personality-boxes");
    const input = document.createElement("input");
    input.type = "text";
    personalityBoxes.append(input);
};

const addAppearance = (e) => {
    e.preventDefault();
    const appearanceBoxes = document.getElementById("appearance-boxes");
    const input = document.createElement("input");
    input.type = "text";
    appearanceBoxes.append(input);
};

window.onload = () => {
    showBreeds();
    document.getElementById("add-edit-breed-form").onsubmit = addEditBreed;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick =() => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-personality").onclick = addPersonality;
    document.getElementById("add-appearance").onclick = addAppearance;
};