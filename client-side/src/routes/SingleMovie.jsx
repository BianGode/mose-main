import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "../assets/styles/SingleMovie.css";

function SingleMovie() {
  const [movieData, setMovieData] = useState("");
  const location = useLocation();
  // console.log(location.pathname.split('/')[2]);

  const id = location.state
    ? location.state.id
    : location.pathname.split("/")[2];
  const translateTo = location.state ? location.state.translateTo : "en";

  useEffect(() => {
    getSingleMovie();
  }, []);

  function getSingleMovie() {
    axios
      .get("http://localhost:5000/singleMovie", {
        params: {
          id: id,
          translateTo: translateTo,
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
                      {movieData.movieDetails.genres.map((genre, inx) => {
                        return <p key={inx}>{genre.name}</p>;
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
                  {movieData.movieDetails.genres.map((genre, inx) => {
                    return <p key={inx}>{genre.name}</p>;
                  })}
                </div>
              </>
            )}
          </div>
          <div className="single-movie-images">
            {movieData.images ? (
              <>
              {/* replace all the singlemovieimages map with a filter and splice to load only 1 image */}
              { movieData.images.backdrops ?
                <div className="single-movie-images-backdrops">
                  {movieData.images.backdrops.slice(0,1).map((backdrop, inx) => {
                    return (
                      <img key={inx}
                        src={
                          "https://image.tmdb.org/t/p/w500/" +
                          backdrop.file_path
                        }
                      />
                    );
                  })}
                </div> : null}
                {movieData.images.logos.length > 0 ?
                <div className="single-movie-images-logos">
                  {movieData.images.logos.slice(0,1).map((logo, inx) => {
                    return (
                      <img
                        key={inx}
                        src={
                          "https://image.tmdb.org/t/p/w500/" +
                          logo.file_path
                        }
                      />
                    );
                  })}
                </div> : <p>No Logos</p>}
                {movieData.images.posters ?
                <div className="single-movie-images-posters">
                  {movieData.images.posters.slice(0,1).map((poster, inx) => {
                    return (
                      <img
                      key={inx}
                        src={
                          "https://image.tmdb.org/t/p/w500/" +
                          poster.file_path
                        }
                      />
                    );
                  })}
                </div> : <p> No posters</p>}
              </>
            ) : null}
          </div>

          <div className="custom-hr">
            <div className="ball left"></div>
            <div className="hr"></div>
            <div className="ball right"></div>
          </div>
          <div className="single-movie-cast-wrap">
            {movieData.cast.map((el, inx) => {
              return (
                <div key={inx} className="single-movie-single-cast">
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
