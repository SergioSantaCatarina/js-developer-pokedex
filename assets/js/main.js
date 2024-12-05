const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')


const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id = "${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function addPokemonClick() {
    const pokemonItens = pokemonList.querySelectorAll('li.pokemon');

    pokemonItens.forEach((item) => {
        item.addEventListener("click", () => {
            const pokemonId = item.getAttribute("data-id");

            pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}` })
                .then((itemDetail) => {
                    showMoreItemDetails(itemDetail);
                });
        });
    });
}


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        addPokemonClick()
    })
}

function showMoreItemDetails(itemDetails) {
    console.log(itemDetails);
    const itemDetailsId = document.getElementById('itemDetailsId')

    const newDetailsHtml = `
        <span class="itemDetailsName ${itemDetails.type}"> ${itemDetails.name}</span>
        <img src="${itemDetails.photo}" class="itemDetailsPhoto ${itemDetails.type}" alt="${itemDetails.name}">
        <div class="itemDetailsData ${itemDetails.type}">
            <span class="itemDetailsNumber">id: #${itemDetails.number}</span>
            <span class="itemDetailsHeight">Altura: ${itemDetails.height} m</span>
            <span class="itemDetailsWeight">Peso: ${itemDetails.weight} kg</span>
        </div>
    `
    itemDetailsId.innerHTML = newDetailsHtml;
}


loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})