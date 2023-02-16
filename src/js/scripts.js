const searchInput = document.querySelector("#input");
const pokemon = document.querySelector("#pokemon");
// Removes focus after pressing enter on mobile keyboard

searchInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 13 || event.code === 'Enter') {
        searchInput.blur();
    }
});

//Triggers "Search" button press if "Enter" key is pressed
document.querySelector("#input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.querySelector("#submit").click();
    }
});
//Listening for "Search" button press
document.querySelector("#submit").addEventListener("click", (e) => {
    e.preventDefault();
    //Looks for blank input and only whitespace and displays error
    if (!searchInput.value.trim()) {
        //Clears the #pokemon screen of all messages
        while (pokemon.hasChildNodes()) {
            pokemon.removeChild(pokemon.firstChild);
        }
        const messageContainer = document.createElement("ul");
        const message = document.createElement("li");
        messageContainer.appendChild(message);
        message.innerText = `Pokédex Error!\n\nField Cannot be blank!\n\n\n\n\n`;
        document.querySelector("#pokemon").appendChild(messageContainer);
        //clears input if only white space
        searchInput.value = "";
    }
    //Text in input field is true
    else if (searchInput.value) {
        //Clears the #pokemon screen of all messages
        while (pokemon.hasChildNodes()) {
            pokemon.removeChild(pokemon.firstChild);
        }
        //API needs lowercase for url, trim removes leading and trailing whitespace
        const searchQuery = searchInput.value.toLowerCase().trim();
        const apiUrl = "https://pokeapi.co/api/v2/pokemon/" + searchQuery;
        fetch(apiUrl)
            .then(response => {
                //For mispelled pokemon names, give a nicer error message
                if (response.status === 404) {
                    const messageContainer = document.createElement("ul");
                    const message = document.createElement("li");
                    messageContainer.appendChild(message);
                    message.innerText = `Pokédex Error!\n\nPokemon not found.\nPlease check spelling!\n\n\n\n`;
                    document.querySelector("#pokemon").appendChild(messageContainer);
                }
                //For all other odd API returns
                else if (!response.ok) {
                    const messageContainer = document.createElement("ul");
                    const message = document.createElement("li");
                    messageContainer.appendChild(message);
                    message.innerText = `A error has occurred.\nPlease try again!`;
                    document.querySelector("#pokemon").appendChild(messageContainer);
                }
                else {
                    return response;
                }
            })
            .then(response => response.json())
            .then(json => {
                if (json.species.name) {
                    const pokemonContainer = document.createElement("ul");
                    const id = document.createElement("li");
                    id.id = "ordernumber";
                    const speciesName = document.createElement("li");
                    const sprite = document.createElement("li");
                    const spriteImg = document.createElement("img");
                    const types = document.createElement("li");
                    const weight = document.createElement("li");
                    const height = document.createElement("li");
                    const baseExperience = document.createElement("li");

                    sprite.appendChild(spriteImg);
                    pokemonContainer.appendChild(id);
                    pokemonContainer.appendChild(speciesName);
                    pokemonContainer.appendChild(sprite);
                    pokemonContainer.appendChild(types);
                    pokemonContainer.appendChild(weight);
                    pokemonContainer.appendChild(height);
                    pokemonContainer.appendChild(baseExperience);

                    //Pokemon ID Number
                    id.innerText = json.id;
                    //Pokemon Species Name
                    speciesName.innerText = `Species Name: ${json.species.name.toUpperCase()}`;
                    //Pokemon Sprite - Puts the json image url of sprite inside the img element
                    spriteImg.src = json.sprites.front_default;

                    //Grabs if there is multiple types associated with pokemon and puts into array
                    const typesArray = json.types;
                    //The resulting text block from the loop to go through the array
                    let typesDisplayed = "";
                    //Loops through typesArray and adds each type.name to typesDisplayed
                    for (let i = 0; i < typesArray.length; i++) {
                        typesDisplayed += typesArray[i].type.name;
                        if (i < typesArray.length - 1) {
                            typesDisplayed += ", ";
                        }
                    }

                    //Pokemon Type - Displays type or types
                    types.innerText = `Type(s): ${typesDisplayed.toUpperCase()}`;

                    //Pokemon Weight - Divide by 10 to get the result in kg
                    weight.innerText = `Weight: ${(json.weight / 10)}kg`;

                    //Pokemon Height - Multiply by 10 to get the result in cm
                    height.innerText = `Height: ${(json.height * 10)}cm`;

                    //Pokemon Base Experience
                    baseExperience.innerText = `Base Experience: ${json.base_experience}`;

                    //Apend the completed info block to page
                    document.querySelector("#pokemon").appendChild(pokemonContainer);
                }
                //If other error handling misses
                else {
                    const messageContainer = document.createElement("ul");
                    const message = document.createElement("li");
                    messageContainer.appendChild(message);
                    message.innerText = `Error in searching name`;
                    document.querySelector("#pokemon").appendChild(messageContainer);
                }
            })
            .catch(error => {
                console.error(error);
            });
        //Clears input field after valid API run
        searchInput.value = "";
    }
});