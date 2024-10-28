import express, { json, response } from "express";
import axios from "axios";
import e from "express";
import cors from 'cors';

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions))

app.use(express.json())
const port = process.env.PORT || 5000;
const apiKey = '07dd926cae4562f3f2879d47b2f5a863';

app.use((err, req, res, next) => {
  return res.json({ errorMessage: err.message });
});

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

app.get("/api", (req, res) => {
  res.json({ "tests": ['test1', 'test2', 'test3'] });
})


let titles = [];
// loop through the results and display the title, poster_path, release_date and vote_average
function quickSearch(arr) {
  titles = [];
  arr.forEach((el, inx) => {
    titles.push({
      id: el.id,
      title: el.title,
      poster_path: el.poster_path,
      release_date: el.release_date.split("-")[0],
      vote_average: el.vote_average,
      original_language: el.original_language,
      original_title: el.original_title,
      overview: el.overview
    });
  });
}


// IMPORTANT:
// https://api.themoviedb.org/3/discover/movie?api_key=272013ce8e3a006ee0055e8120e3d22f&
// is the query for a movie
// &language=nl-NL
// &with_title_translation=nl-NL
// &with_overview_translation=nl-NL
// &with_original_language= get language 
app.get("/search", (req, res) => {
  // search movie
  // 'https://api.themoviedb.org/3/search/movie?query=' + res.data +'&api_key=API_KEY'
  // if movie has more than 1 search result:
  // loop through the results and display the title, poster_path, release_date and vote_average
  const inputUser = req.url.split('&')[0].split('=')[1]
  let translateTo;
  let original_language;
  original_language = req.url.split('&')[1].split('=')[1]
  translateTo = req.url.split('&')[2].split('=')[1]
  // console.log(req);
  

  // console.log(inputUser, original_language, translateTo);

  // console.log(res);
  // Movie Details with id given from above query
  // 'https://api.themoviedb.org/3/movie/' + id + '?api_key=API_KEY'
  // WHAT STILL NEEDS TO BE DONE: add page counter with url &page=PAGENUMER
  async function searchReq() {
    try {
      // console.log(inputUser + " test");
      const result = await axios.get(
        // https://api.themoviedb.org/3/discover/movie?api_key=272013ce8e3a006ee0055e8120e3d22f&language=nl-NL&with_title_translation=nl-NL&with_overview_translation=nl-NL
        "https://api.themoviedb.org/3/discover/movie" +
        "?api_key=" + apiKey +
        '&with_text_query=' + inputUser +
        '&with_original_language=' + original_language +
        '&language=' + translateTo
        // with_text_query=alles&with_original_language=nl&language=nl-NL
        // '&with_title_translation=' + translateTo + '-' + translateTo.toUpperCase(),
        // '&with_overview_translation=' + translateTo + '-' + translateTo.toUpperCase()
      )
      // console.log(result);

      if (result.data.results.length > 1) {
        quickSearch(result.data.results);
      } else {
        // res.send(result.data.results);
      }
      res.send(titles);
    } catch (e) {
      console.log(e);

    }

  }
  searchReq();

});

// get singlemovie and send as response
// send another axios get request for the movie cast and send only the cast
app.get("/singleMovie", (req, res) => {
  let movieData = { movieDetails: "", cast: "", images: "" };
  const singleMovieId = req.url.split("=")[1].split('&')[0];
  const translateTo = req.url.split('=')[2]
  console.log(singleMovieId, translateTo);
  

  axios
    .get(
      "https://api.themoviedb.org/3/movie/" +
      singleMovieId +
      "?language=" + translateTo + "&api_key=" + apiKey
    )
    .then((movieDetails) => {
      movieData.movieDetails = movieDetails.data;
    }).then(() => {
      axios.get("https://api.themoviedb.org/3/movie/" + singleMovieId + "/images?api_key=" + apiKey)
      .then((res) => {
        console.log(res.data);
        movieData.images = res.data
      }).catch((err) => {
        console.log(err);     
      })
    })
    .finally(() => {
      axios
        .get(
          "http://api.themoviedb.org/3/movie/" +
          singleMovieId +
          "/casts?api_key=" + apiKey
        )
        .then((castRes) => {
          // this works
          // console.log(castRes.data.cast);

          movieData.cast = castRes.data.cast;
          // console.log(movieData);
          res.send(movieData);
        });
    });
});

// request to load the populair movies that day
app.get("/loadPopulair", (req, res) => {
  axios.get("https://api.themoviedb.org/3/trending/movie/day?language=en-US&api_key=" + apiKey)
    .then((popRes) => {
      // console.log(popRes.data);
      res.send(popRes.data)
    }).catch((err) => {
      console.log(err);
    })
});
// http://api.themoviedb.org/3/movie/14160/casts?api_key=f620c5baed1b777b7b50d6677ef5d5a1

app.get("/getPopulairAll", (req, res) => {
  axios.get("https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=" + apiKey)
    .then((popAllRes) => {
      res.send(popRes.data)
    }).catch((err) => {
      console.log(err)
    })
})

// get populair people
// https://api.themoviedb.org/3/person/popular?language=en-US&page=1&api_key=



const options = {
  method: 'GET',
  // url: 'https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=' + apiKey,
  url: 'http://localhost:5000/search',
  // headers: {
  //   accept: 'application/json',
  //   // Authorization: 'Bearer '
  // }
};

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
