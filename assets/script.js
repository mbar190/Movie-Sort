const API_KEY = "e15797e3";
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const movieGrid = document.querySelector("#moviesGrid");
const resultsInfo = document.querySelector("#resultsInfo");
const sortSelect = document.querySelector("#sortSelect");

let currentMovies = [];

// Event listener for form submission
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMovies(searchTerm);
  }
});

// Show skeleton loaders while fetching data
function showSkeleton() {
  const skeleton = Array(10)
    .fill()
    .map(
      () => `
    <div class='movie-card movie-card--skeleton'>
      <div class='movie-card__img movie-card__img--skeleton'></div>
      <div class='movie-card__title movie-card__title--skeleton'></div>
      <div class='movie-card__year movie-card__year--skeleton'></div>
    </div>
  `,
    );
  movieGrid.innerHTML = skeleton.join("");
}

// Fetch movies from the API
async function fetchMovies(searchTerm) {
  showSkeleton();

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`,
  );
  const data = await res.json();

  if (data.Response === "True") {
    currentMovies = data.Search;
    resultsInfo.textContent = `Showing:'${searchTerm}'`;
    sortSelect.value = "default"; // Reset sort select to default
    displayMovies(currentMovies);
  } else {
    resultsInfo.textContent = `Showing:'${searchTerm}'`;
    movieGrid.innerHTML = `<p>Movie Not Found. Please search again.</p>`;
    currentMovies = [];
  }
}

// Display movies in the grid
function displayMovies(movies) {
  const movieResults = movies
    .map((movie) => {
      const poster = movie.Poster !== "N/A" ? movie.Poster : "";

      return `
      <div class='movie-card'>
        ${poster ? `<img src='${poster}' alt='${movie.Title} Poster' />` : '<div class="no-poster">No Poster Available</div>'}
        <h2 class='movie-card__title'>${movie.Title}</h2>
        <p class='movie-card__year'>${movie.Year}</p>
      </div>
    `;
    })
    .join("");

  movieGrid.innerHTML = movieResults;

  // Add error listeners after DOM insertion
  movieGrid.querySelectorAll(".movie-card img").forEach((img) => {
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "movie-card__poster-placeholder";
      placeholder.innerHTML = "Movie Poster<br>Not Available";
      img.replaceWith(placeholder);
    });
  });
}

// Sort movies based on the selected option
sortSelect.addEventListener("change", (e) => {
  sortMovies(e.target.value);
});

function sortMovies(sortType) {
  let sortedMovies = [...currentMovies];

  if (sortType === "a-z") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortType === "z-a") {
    sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortType === "newest") {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortType === "oldest") {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }

  displayMovies(sortedMovies);
}
