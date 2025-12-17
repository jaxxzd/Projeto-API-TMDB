const apiKey = "87141172db639081ec325c466c4c1f87";
const apiUrl = "https://api.themoviedb.org/3";
const inputResult = document.querySelector("#input-field-tmdb");
const btnResult = document.querySelector("#btn-search")

async function structureApiTMDB(endpoint) {
    try {
        const separator = endpoint.includes("?") ? "&" : "?";
        const url = `${apiUrl}${endpoint}${separator}api_key=${apiKey}`;
        const resp = await fetch(url);
        const data = await resp.json();
        return data;

    } catch (err) {
        console.log("Erro na busca da API TMDB:", err)
    }
}

async function searchMovieName(name) {
    const data = await structureApiTMDB(`/search/movie?query=${name}`);
    return data.results;
}

async function getGenre() {
    const data = await structureApiTMDB(`/genre/movie/list?language=pt-BR`);
    return data.genres;
}

async function SearchGenre(genreId) {
    const data = await structureApiTMDB(`/discover/movie?with_genres=${genreId}`);
    return data.results;
}

async function getSectionHero() {
    const data = await structureApiTMDB(`/trending/all/week?language=pt-BR`);

    return data.results.filter(item =>
        item.poster_path &&
        item.backdrop_path &&
        item.overview
    );
}

async function getTop10() {
    const data = await structureApiTMDB(`/trending/all/day`);
    return data.results.slice(0, 10);
}

async function getPopular() {
    const data = await structureApiTMDB(`/movie/popular`);
    return data.results.slice(0, 15);
}

async function getMovies() {
    const data = await structureApiTMDB(`/discover/movie?sort_by=popularity.desc`);
    return data.results.slice(0, 20);
}

function conteudoSectionHero(movie) {
    const sectionHero = document.querySelector("#section-hero");
    const poster = document.querySelector(".img-poster-film");
    const title = document.querySelector(".title-film");
    const description = document.querySelector(".description-film");

    sectionHero.style.backgroundImage = `
        linear-gradient(
        to right, 
        rgba(31, 31, 31, 1),
        rgba(31, 31, 31, 0.70) 50%, 
        rgba(31, 31, 31, 0.50) 100%
        ),
        url(https://image.tmdb.org/t/p/original${movie.backdrop_path})
    `;

    poster.src = `https://image.tmdb.org/t/p/w300_and_h450_face${movie.poster_path}`;
    poster.alt = movie.title || movie.name;

    title.textContent = movie.title || movie.name;
    description.textContent = movie.overview;
}

async function loadSectionHero() {
    const movies = await getSectionHero();

    if (!movies.length) return;

    const randomIndex = Math.floor(Math.random() * movies.length);
    conteudoSectionHero(movies[randomIndex]);
}

function showTop10(listTop10) {
    const titleTop10 = document.querySelector("#title-container-top10").textContent = "Top 10 da Semana";

    let cards = "";

    listTop10.forEach((item, i) => {
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

    carouselNavigation("#container-top10", cards);
}


function showPopular(listPopular) {
    const titlePopular = document.querySelector("#title-container-popular").textContent = "Filmes da Semana";


    let cards = "";

    listPopular.forEach(moviePopular => {
        cards += `
        <div class="list-popular"
            data-id="${moviePopular.id}"
            data-type="movie">
            
            <img src="https://image.tmdb.org/t/p/w300${moviePopular.poster_path}" class="img-slide-bottom">
        </div>
        `
    })

    carouselNavigation("#container-popular", cards);
}

function showExtensiveMovies(extensive) {
    const container = document.querySelector("#container-extensive");

    container.innerHTML = "";

    const containerGrid = document.createElement("div");
    containerGrid.id = "container-content-extensive";


    extensive.forEach(movies => {
        if (!movies.poster_path) return;

        const card = document.createElement("div");
        card.classList.add("list-extensive");

        card.dataset.id = movies.id;
        card.dataset.type = "movie";

        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w300${movies.poster_path}" class="img-slide-bottom">
        `

        containerGrid.appendChild(card);
    });

    container.appendChild(containerGrid);
}

function carouselNavigation(containerId, cardHTML) {
    const container = document.querySelector(containerId);

    container.innerHTML = `
    <button class="arrow left"><i class="fa-solid fa-chevron-left"></i></button>
    <div class="container-navigation">${cardHTML}</div>
    <button class="arrow right"><i class="fa-solid fa-chevron-right"></i></button>
    `

    const navigation = container.querySelector(".container-navigation");
    const leftNav = container.querySelector(".left");
    const rightNav = container.querySelector(".right");

    leftNav.addEventListener("click", () => {
        navigation.scrollLeft -= 700;
    });

    rightNav.addEventListener("click", () => {
        navigation.scrollLeft += 700;
    });
}

function searchToResult() {
    const target = document.querySelector("#container-extensive");

    if (!target) return;

    target.scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
}

let timeout;

inputResult.addEventListener("input", () => {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
        const value = inputResult.value.trim();
        const genreId = genreIdSelected;

        if (value.length < 3) return;

        if (value === "") return;

        const result = await searchMovieName(value);
        const filtragem = genreId
            ? filterGenre(result, genreId)
            : result;

        searchToResult();

        searchInputResult(filtragem);
    }, 500);
});

function searchInputResult(movie) {
    const container = document.querySelector("#container-extensive");
    container.innerHTML = "";

    if (movie.length === 0) {
        container.innerHTML = `<p class="no-movie">Nenhum resultado encontrado.</p>`;
        return;
    }

    const resultsSearch = document.createElement("h2");
    resultsSearch.id = "results-search";
    resultsSearch.textContent = "Resultados de Pesquisa";

    const containerGrid = document.createElement("div");
    containerGrid.id = "container-content-extensive";


    movie.forEach(movies => {
        if (!movies.poster_path) return;

        const card = document.createElement("div");
        card.classList.add("list-extensive");

        card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movies.poster_path}" class="img-slide-bottom">
        `

        containerGrid.appendChild(card);
    });

    container.appendChild(resultsSearch);
    container.appendChild(containerGrid);
}

async function searchDropGenre() {
    const genres = await getGenre();
    const genreDropDown = document.querySelector("#genre-menu");

    genres.forEach(genre => {
        const option = document.createElement("li");
        option.classList.add("genre-option");
        option.dataset.genreId = genre.id;
        option.textContent = genre.name;

        genreDropDown.appendChild(option);
    })
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

    searchInputResult(result);
    searchToResult();
});

const dropdown = document.querySelector("#genre-dropdown");
const genreLabel = document.querySelector("#genre-label");
const btnGenreOpen = document.querySelector("#genre-title");
const menuGenreOpen = document.querySelector("#genre-menu");

btnGenreOpen.addEventListener("click", () => {
    menuGenreOpen.classList.toggle("active");
    dropdown.classList.toggle("open");
})

let genreIdSelected = null;

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