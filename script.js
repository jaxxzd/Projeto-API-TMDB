const apiKey = "87141172db639081ec325c466c4c1f87"; // chave da API
const apiUrl = "https://api.themoviedb.org/3"; // url base
const inputResult = document.querySelector("#input-field-tmdb"); // Seletor do input de busca armazenado  em uma variável 
const btnResult = document.querySelector("#btn-search") // Seletor do botão "buscar" armazenado na variável btn Result

async function structureApiTMDB(endpoint) { // função assíncrona que faz a requisição dos endpoints que são recebidos de funções que fazem cada ação
    try { // tenta fazer a requisição do endpoint
        const separator = endpoint.includes("?") ? "&" : "?"; // separação do endpoint entre "?" ou "&"
        const url = `${apiUrl}${endpoint}${separator}api_key=${apiKey}`; // url formada com a url base da api, endpoint, separação e a chave da API
        const resp = await fetch(url); // requisição da url com fetch armzenada na variável "resp" de resposta
        const data = await resp.json(); // resposta da requisição convertida em json e armazenada na variável "data" de dados
        return data; // retorna os dados da resposta convertida em json usando a variável "data"

    } catch (err) { // Vai em busca de pegar o erro, se pegar, coloca um console.log informando no console que ocorreu um erro
        console.log("Erro na busca da API TMDB:", err)
    }
}

async function searchMovieName(name) { // função assíncrona para buscar o nome do filme
    const data = await structureApiTMDB(`/search/movie?query=${name}`); // espera da função "structureApiTMDB" carregar o endpoint que pega o nome do filme
    return data.results; // retorna o "data" com a palavra chave do json da API, chamada "results"
}

async function getGenre() { // função assíncrona que busca o gênero do filme
    const data = await structureApiTMDB(`/genre/movie/list?language=pt-BR`); // espera da função "structureApiTMDB" carregar o endpoint que pega a lista de gênero do filme em português
    return data.genres; // retorna o "data" com a palavra chave "genres" do json da API
}

async function SearchGenre(genreId) { // função assíncrona pra receber como parâmetro o id do gênero
    const data = await structureApiTMDB(`/discover/movie?with_genres=${genreId}`); // o id do gênero é colocado no endpoint pra receber o nome do gênero

    return data.results; // retorna a lista de filmes final
}

async function getSectionHero() { // função assíncrona para criar a seção de destaque de filmes e séries
    const data = await structureApiTMDB(`/trending/all/week?language=pt-BR`); // espera da função "structureApiTMDB" que carrega filmes populares da semana com linguagem em português

    return data.results.filter(item => // filtragem da lista de filmes com parâmetro "item", buscando imagem vertical, imagem horizontal e sinopse do filme
        item.poster_path &&
        item.backdrop_path &&
        item.overview
    );
}

async function getTop10() { // função para buscar filmes e séries populares do dia
    const data = await structureApiTMDB(`/trending/all/day`); // espera da função "structureApiTMDB" para carregar o endpoint que recebe as tendências do dia
    return data.results.slice(0, 10); // retorna lista de filmes que estão em tendências, criando um limite de 10 filmes no array de 0 a 10
}

async function getPopular() {// função para buscar filmes populares
    const data = await structureApiTMDB(`/movie/popular`); // espera da função "structureApiTMDB" para carregar o endpoint que pega os filmes populares
    return data.results.slice(0, 15); // retorna lista de filmes que estão entre os mais populares, com limite de 15 filmes no array, de 0 a 15
}

async function getMovies() { // função para pegar filmes para conhecer
    const data = await structureApiTMDB(`/discover/movie?sort_by=popularity.desc`); // espera da função "structureApiTMDB" para carregar o endpoint que pega os filmes com nível de popularidade, aparecendo em ordem decrescente, aparecendo os filmes mais bem avaliados primeiro
    return data.results.slice(0, 20); // retorna lista de filmes para descoberta, com limite de 20 filmes no array, de 0 a 20
}

function conteudoSectionHero(movie) { // função para criar  o conteúdo da seção Hero com seletores
    const sectionHero = document.querySelector("#section-hero");
    const poster = document.querySelector(".img-poster-film");
    const title = document.querySelector(".title-film");
    const description = document.querySelector(".description-film");

    // variável "sectionHero" é recebida com background-image do filme e linear-gradient para ficar mais escuro

    sectionHero.style.backgroundImage = `
        linear-gradient(
        to right, 
        rgba(31, 31, 31, 1),
        rgba(31, 31, 31, 0.70) 50%, 
        rgba(31, 31, 31, 0.50) 100%
        ),
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
    `;

    poster.src = `https://image.tmdb.org/t/p/w300_and_h450_face${movie.poster_path}`; // imagem vertical para a seção hero
    poster.alt = movie.title || movie.name; // alt da imagem vertical para a seção hero

    title.textContent = movie.title || movie.name; // título do filme
    description.textContent = movie.overview; // sinopse do filme
}

async function loadSectionHero() { // função pra renderizar o filme na seção hero
    const movies = await getSectionHero(); // espera dados da função "getSectionHero" e coloca na variável "movies"

    if (!movies.length) return; // verificação para ver se não tem nenhum filme

    const randomIndex = Math.floor(Math.random() * movies.length); // gera índice aleatório pra fica aparecendo filmes aleatórios quando atualiza a página
    conteudoSectionHero(movies[randomIndex]); // chama a função "conteudoSectionHero" e coloca valores para o seu parâmetro
}

function showTop10(listTop10) { // função pra criar HTML dinâmico pra seção de top 10 da semana
    const titleTop10 = document.querySelector("#title-container-top10").textContent = "Top 10 da Semana"; // título do seção top 10

    let cards = ""; // reseta cards

    listTop10.forEach((item, i) => { // metodo forEach, com parâmetro do item atual e oque está percorrendo, fazendo a criação do card do top 10 da semana
        cards += `
            <div class="list-top10"
                data-id="${item.id}"
                data-type="${item.media_type || "movie"}">

                <img src="https://image.tmdb.org/t/p/w300${item.poster_path}" class="img-slide-bottom">

                <span class="classRank">
                    ${i + 1}
                </span>
            </div>
        `;
    })

    carouselNavigation("#container-top10", cards); // coloca valor no parâmetro da função "carouselNavigation"
}


function showPopular(listPopular) { // função pra mostrar na tela a lista de filmes populares
    const titlePopular = document.querySelector("#title-container-popular").textContent = "Filmes Populares"; // título da seção popular

    let cards = ""; // limpeza do card

    listPopular.forEach(moviePopular => { // Percorre com o parâmetro "moviePopular", os arrays com os detalhes dos filmes, fazendo a criação dos cards
        cards += `
        <div class="list-popular"
            data-id="${moviePopular.id}"
            data-type="movie">
            
            <img src="https://image.tmdb.org/t/p/w300${moviePopular.poster_path}" class="img-slide-bottom">
        </div>
        `
    })

    carouselNavigation("#container-popular", cards); // coloca valor no parâmetro da função "carouselNavigation"
}

function showExtensiveMovies(extensive) { // função para mostrar filmes para descobrir
    const container = document.querySelector("#container-extensive"); // seletor do container extenso de filmes para descobrir, sendo armazenado na variável "container"

    container.innerHTML = ""; // limpeza do container a cada chamada

    // container para receber os cards e colocar grid pra organização
    const containerGrid = document.createElement("div");
    containerGrid.id = "container-content-extensive";

    extensive.forEach(movies => { // forEach percorre com parãmetro "movies", fazendo a criação dos cards com base no array de filmes que recebeu do parâmetro "extensive"
        if (!movies.poster_path) return; // verificar se o filme tem pôster

        // criação do card com classe
        const card = document.createElement("div");
        card.classList.add("list-extensive");

        // informar ao HTML o id e tipo do filme, além de saber qual filme foi clicado
        card.dataset.id = movies.id;
        card.dataset.type = "movie";

        // transformação do HTML colocando a imagem do tipo pôster na tela
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movies.poster_path}" class="img-slide-bottom">
        `

        // coloca o card como filho do container que vai ter grid
        containerGrid.appendChild(card);
    });

    // coloca o container que vai ter grid como filho do container extenso que aparece filmes para descoberta
    container.appendChild(containerGrid);
}

function carouselNavigation(containerId, cardHTML) { // função para criação o carrosel
    const container = document.querySelector(containerId); // variável "container", recebe como seletor os containers top 10 de filmes e séries da semana, filmes populares e filmes para descobrir, atráves de valores passados para o parâmetro "containerId"

    // cria HTML para carrosel com o card de cada container (top10, popular, extensive), através de valores passados para o parâmetro "cardHTML"
    container.innerHTML = `
    <button class="arrow left"><i class="fa-solid fa-chevron-left"></i></button>
    <div class="container-navigation">${cardHTML}</div>
    <button class="arrow right"><i class="fa-solid fa-chevron-right"></i></button>
    `

    // seletores para fazer as setas de navegação
    const navigation = container.querySelector(".container-navigation");
    const leftNav = container.querySelector(".left");
    const rightNav = container.querySelector(".right");

    // criação de evento para a seta da esquerda
    leftNav.addEventListener("click", () => {
        navigation.scrollLeft -= 700;
    });

    // criação de evento para a seta da direita
    rightNav.addEventListener("click", () => {
        navigation.scrollLeft += 700;
    });
}

function searchToResult() { // função pra levar o usuário ate o "#container-extensive" ao buscar, onde apareci o resultado da pesquisa
    const target = document.querySelector("#container-extensive");

    if (!target) return; // verificar se o alvo não foi "#container-extensive", se não, a verificação retorna, impedindo o resto do código

    // seletor com metodo para rolar até o resultado
    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

let genreIdSelected = null; // variável de estado para pegar o gênero selecionado

let timeout; // guarda Id do setTimeout pra fazer debouncer

inputResult.addEventListener("input", () => { // adição de evento para pesquisa parcial
    clearTimeout(timeout); // cancela o setTimeout anterior pra não fazer várias chamadas enquanto digita

    timeout = setTimeout(async () => { // só faz a ação se o usuário parar de digitar por 2 segundos

        // coloca valor digitado na variável "value"
        const value = inputResult.value.trim();

        // pega o gênero selecionado
        const genreId = genreIdSelected;

        // verificação se o valor digitado é menor que 3 letras, se sim, retorna e impede de coninuar o código
        if (value.length < 3) return;

        const result = await searchMovieName(value); // colocar o valor digitado na função "searchMovieName" como parâmetro, aguardando até a requisição ser feita e então armazena na variável "result"
        const filtragem = genreId // se tiver um gênero selecionado então faz a filtragem, se não, usa o resultado digitado
            ? filterGenre(result, genreId)
            : result;

        searchToResult(); // chamada da função pra levar a usuário até os resultados da pesquisa

        searchInputResult(filtragem); // carrega os filmes filtrados na tela
    }, 2000);
});

function searchInputResult(movie) { // função pra mostrar na tela os resultados buscaods no input
    const container = document.querySelector("#container-extensive"); 
    container.innerHTML = ""; // limpa a cada chamada, pra não acumular

    if (movie.length === 0) { // se a busca não tiver nenhum filme, mostra na tela que não foi encontrado e retorna
        container.innerHTML = `<p class="no-movie">Nenhum resultado encontrado.</p>`;
        return;
    }

    // cria apenas um título para o usuário ter noção dos resultados que ele pesquisou
    const resultsSearch = document.createElement("h2");
    resultsSearch.id = "results-search";
    resultsSearch.textContent = "Resultados de Pesquisa";

    // container que tem grid pra armazenar os cards buscaoos no input
    const containerGrid = document.createElement("div");
    containerGrid.id = "container-content-extensive";


    movie.forEach(movies => { // percorre com forEach, a criação do card com o filme que foi pesquisado
        if (!movies.poster_path) return; // verifica se o filme não tem pôster, se não tiver, retorna

        // criação do card pra receber a pôster do filme pesquisado
        const card = document.createElement("div");
        card.classList.add("list-extensive");

        // coloca na tela o card com a imagem do pôster
        card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movies.poster_path}" class="img-slide-bottom">
        `

        // coloca card como filho do container que tem grid
        containerGrid.appendChild(card);
    });

    // container extensivo recebe como filho o título de "Resultados de Pesquisa" na tela
    container.appendChild(resultsSearch);
    // container extenivo recebe como filho o container que tem grid
    container.appendChild(containerGrid);
}

async function searchDropGenre() { // função pra pegar gêneros de filme e colocar no dropdown
    const genres = await getGenre(); // aguarda a requisição com o nome dos gêneros em um array
    const genreDropDown = document.querySelector("#genre-menu"); // seletor que receberá os nomes dos gêneros

    genres.forEach(genre => { // o array de gêneros percorre com forEach, usando o parâmetro "genre", para criar tag "li", colocar uma classe, definir um dataset para saber o id do gênero e colocar o nome do gênero na tela
        const option = document.createElement("li");
        option.classList.add("genre-option");
        option.dataset.genreId = genre.id;
        option.textContent = genre.name;

        // menu de gêneros recebe como filho todos os gêneros disponíveis na API
        genreDropDown.appendChild(option);
    });
}

function filterGenre(movieNames, genreId) { 
    return movieNames.filter(movieName => movieName.genre_ids.includes(Number(genreId))
    );
}


btnResult.addEventListener("click", async () => {
    const name = inputResult.value.trim();
    const genreId = genreIdSelected;

    let result = [];

    if (name && genreId) {
        const search = await searchMovieName(name);
        result = await filterGenre(search, genreId);
    } else if (name) {
        result = await searchMovieName(name);
    } else if (genreId) {
        result = await SearchGenre(genreId);
    } else {
        return;
    }

    searchToResult();

    searchInputResult(result);
});

const dropdown = document.querySelector("#genre-dropdown");
const genreLabel = document.querySelector("#genre-label");
const btnGenreOpen = document.querySelector("#genre-title");
const menuGenreOpen = document.querySelector("#genre-menu");

btnGenreOpen.addEventListener("click", () => {
    menuGenreOpen.classList.toggle("active");
    dropdown.classList.toggle("open");
})

menuGenreOpen.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        genreIdSelected = e.target.dataset.genreId;

        genreLabel.textContent = e.target.textContent;

        menuGenreOpen.classList.remove("active");
        dropdown.classList.remove("open");
    }
});

document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
        menuGenreOpen.classList.remove("active");
        dropdown.classList.remove("open");
    }
});

async function getTrailerFilm(movieId, type = "movie") {
    const data = await structureApiTMDB(`/${type}/${movieId}/videos?language=pt-BR`);

    return data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
}

async function getInformationFilm(movieId, type = "movie") {
    return await structureApiTMDB(`/${type}/${movieId}?language=pt-BR`);
}

async function openModal(movie) {
    const modal = document.querySelector("#modal-trailer");
    const trailerModal = document.querySelector("#trailer");

    const titleModal = document.querySelector(".modal-title");
    const genreModal = document.querySelector(".modal-genre");
    const sinopseModal = document.querySelector(".modal-overview");

    const type = movie.media_type || "movie";

    const trailer = await getTrailerFilm(movie.id, type);
    const information = await getInformationFilm(movie.id, type);

    if (trailer) {
        trailerModal.src = `https://www.youtube.com/embed/${trailer.key}`;
    } else {
        trailerModal.src = "";
    }

    titleModal.textContent = information.title || information.name;
    genreModal.textContent = information.genres.map(g => g.name).join(", ");
    sinopseModal.textContent = information.overview;

    modal.classList.add("active");
}

document.querySelector("#fechar-modal").addEventListener("click", () => {
    const modal = document.querySelector("#modal-trailer");
    const trailerModal = document.querySelector("#trailer");

    trailerModal.src = "";
    modal.classList.remove("active");
})

document.addEventListener("click", async (e) => {
    const card = e.target.closest(
        ".list-top10, .list-popular, .list-extensive"
    );

    if (!card) return;

    const movieId = card.dataset.id;
    const type = card.dataset.type;

    openModal({
        id: movieId,
        media_type: type
    });
});

async function LoadPage() {

    await loadSectionHero();

    const top10 = await getTop10();
    showTop10(top10);

    const popular = await getPopular();
    showPopular(popular);

    const extensive = await getMovies();
    showExtensiveMovies(extensive);

    searchDropGenre();
}

LoadPage();