import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchMovies } from "./services/movieService";
import type { Movie } from "./types/movie";
import SearchBar from "./components/SearchBar/SearchBar";
import MovieGrid from "./components/MovieGrid/MovieGrid";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import MovieModal from "./components/MovieModal/MovieModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (!query) return;

    const searchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMovies(query);
        setMovies(data.results);
        if (data.results.length === 0) {
          toast.error("No movies found for your request");
        }
      } catch (err) {
        setError("Failed to fetch movies");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchMovies();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      <main>
        {isLoading && <Loader />}
        {error && <ErrorMessage />}
        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelectMovie} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
