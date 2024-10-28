import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "../assets/styles/SingleMovie.css";

function SingleMovie() {
  const [movieData, setMovieData] = useState("");
  const location = useLocation();
  // console.log(location.pathname.split('/')[2]);
  
  const id = location.state ? location.state.id : location.pathname.split('/')[2];
  const translateTo = location.state ? location.state.translateTo : 'en';


  useEffect(() => {
    getSingleMovie();
  }, []);

  function getSingleMovie() {
    axios
      .get("http://localhost:5000/singleMovie", {
        params: {
          id: id,
          translateTo: translateTo
        },
      })
      .then((result) => {
        setMovieData(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="single-movie-wrap">
      {movieData.length !== 0 ? (
        <>
          <div className="single-movie-content-wrap">
            {window.innerWidth > 900 ? (
              <>
                <p>{movieData.movieDetails.title}</p>
                <div className="single-movie">
                  <div className="single-movie-left">
                    <p>{movieData.movieDetails.overview}</p>
                    <div className="single-movie-genres">
                      {movieData.movieDetails.genres.map((genre) => {
                        return <p>{genre.name}</p>;
                      })}
                    </div>
                  </div>
                  <div className="single-movie-right">
                    <img
                      src={
                        "https://image.tmdb.org/t/p/original/" +
                        movieData.movieDetails.poster_path
                      }
                      alt=""
                      className="single-movie-poster"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="title">{movieData.movieDetails.title}</p>
                <p>{movieData.movieDetails.release_date}</p>

                <img
                  src={
                    "https://image.tmdb.org/t/p/original/" +
                    movieData.movieDetails.poster_path
                  }
                  alt=""
                  className="single-movie-poster"
                />
                <p>{movieData.movieDetails.overview}</p>

                <div className="single-movie-genres">
                  {movieData.movieDetails.genres.map((genre) => {
                    return <p>{genre.name}</p>;
                  })}
                </div>
              </>
            )}
          </div>
          <div className="custom-hr">
            <div className="ball left"></div>
            <div className="hr"></div>
            <div className="ball right"></div>
          </div>
          <div className="single-movie-cast-wrap">
            {movieData.cast.map((el) => {
              return (
                <div className="single-movie-single-cast">
                  {/* <p style={{ color: "white" }}>{el}</p> */}
                  {/* <p style={{ color: "white" }}>{el}</p> */}
                  <p>{el.name}</p>
                  <img
                    src={"https://image.tmdb.org/t/p/w500/" + el.profile_path}
                    alt="No image available"
                  />
                  <div className="cast-name-role-wrap">
                    <p>Character:</p>
                    <p>{el.character}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p style={{ color: "white" }}>NO DATA YET!</p>
      )}
    </div>
  );
  // movieData.length !== 0 ? <p>{movieData.cast[0]}</p> : <p>NO DATA YET</p>
}

export default SingleMovie;
