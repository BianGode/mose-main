import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/styles/Home.css";
import { faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import VideoJS from "../components/VideoJS";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import data from "../languages.json";
import Select from "react-select"

function Home() {
  const [search, setSearch] = useState("");
  const [searchRes, setSearchRes] = useState("");
  
  // state for react-selected
  const [selectedOptionCountry, setSelectedOptionCountry] = useState('en');
  const [selectedOptionTranslate, setSelectedOptionTranslate] = useState('en');

  // const playerRef = useRef(null);
  // const [timestamp1, setTimestamp1] = useState(null);
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [translateTo, setTranslateTo] = useState("");

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 910 ? true : false
  );

  const navigate = useNavigate();

  const videoJsOptions = {
    autoplay: true,
    controls: false,
    muted: true,
    loop: true,
    // responsive: true,
    fluid: false,
    sources: [
      {
        src: "../../public/header-movie.mp4",
        type: "video/mp4",
      },
    ],
  };
  
  const [isSearchFocused, setIsSearchFocus] = useState(false);

  // const useOutsideClick = (callback) => {
  //   const reference = useRef();

  //   useEffect(() => {
  //     const handleClick = (event) => {
  //       if (reference.current && !reference.current.contains(event.target)) {
  //         console.log(reference.current);
  //         console.log(event.target);
  //         console.log(reference.current.contains(event.target));
  //         callback();
  //       } else {
  //         console.log("clicked inside!");
  //         console.log(isSearchFocused);
  //         setIsSearchFocus(true);
  //       }
  //     };

  //     document.addEventListener("click", handleClick, true);

  //     return () => {
  //       document.removeEventListener("click", handleClick, true);
  //     };
  //   }, [reference]);

  //   return reference;
  // };

  const removeActive = () => {
    console.log(isSearchFocused);

    setIsSearchFocus(false);

    // document.querySelector(".search-home").classList.contains("active")
    //   ? document.querySelector(".search-home").classList.remove("active")
    //   : null;
  };

  // const ref = useOutsideClick(removeActive);

  function switchSearchBackground() {
    if (!isSearchFocused) {
      setIsSearchFocus(true);
    }
  }
  console.log('test');
  

  // call to node back-end
  async function searchReqClientSide(searchParam) {
    try {
      const response = await axios.get("http://localhost:5000/search", {
        params: {
          search: searchParam,
          original_language: selectedOptionCountry,
          translateTo: selectedOptionTranslate,
        },
      });

      setSearchRes(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  //setup before functions
  let typingTimer; //timer identifier
  let doneTypingInterval = 1000; //time in ms, 5 seconds for example
  let input = document.getElementById("search-input-home");

  function addTimerEvent() {
    //on keydown, clear the countdown
    clearTimeout(typingTimer);
  }

  const PopulairMovies = () => {
    return <>{searchRes ? <div></div> : <div></div>}</>;
  };

  function searchCall(e) {
    if (search && e.target.value == "") {
      clearTimeout(typingTimer);
    } else {
      setSearch(e.target.value);
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        searchReqClientSide(e.target.value);
      }, doneTypingInterval);
    }
  }

  function navigateMovie(id) {
    navigate("/singlemovie/" + id, {
      state: { id: id, translateTo: translateTo },
    });
  }

  useEffect(() => {
    if (search) {
      searchReqClientSide(search);
    }
  }, [selectedOptionCountry, selectedOptionTranslate]);

  console.log(selectedOptionCountry);
  
  function handleCountryOfOrigin(e) {
    console.log(e.value);
    
    setSelectedOptionCountry(e.value);
    // console.log(search);
    // if (search) {
    //   searchReqClientSide(search);
    // }
  }

  
  function handleTranslateTo(e) {
    setSelectedOptionTranslate(e.value);
    console.log(e.target.value);

    // console.log(search);

    // if (search) {
    //   searchReqClientSide(search);
    //   // console.log(document.getElementById('search-input-home').innerText);
    // }
  }

  // configuration for react-select
  const options = [];
  data.forEach((lang) => {
    options.push({value: lang.iso_639_1, label: lang.english_name})
  })
  
  // custom styling component to style react-select
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: "#000",
      backgroundColor: state.isSelected ? "#FDD8D6" : "#FDD8D6",
    }),
    control: (defaultStyles) => ({
      display: "flex",
      // Notice how these are all CSS properties
      backgroundColor: "#94ACBF",
      padding: "5px",
      border: "none",
      boxShadow: "none",
      height: "2.4rem",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles,  color: "white"}),
    placeholder: (styles) => ({ 
      ...styles,
      color: '#FDD8D6',
    })
  }
  // Add search input where select language, country and translation

  return (
    <div className="home-wrapper">
      <div className="video-wrapper">
        <VideoJS options={videoJsOptions} />
        <div className="video-overlay" id="video-overlay"></div>
      </div>
      <div className="search-home-wrapper">
        <div className={isSearchFocused ? "search-home active" : "search-home"}>
          <h1>Search the movie you want</h1>
          {!isMobile ? (
            <div className="search-input-wrap">
              <FontAwesomeIcon icon={faSearch} className="search-icon-home" />
              <input
                // ref={ref}
                // onClick={() => switchSearchBackground()}
                type="text"
                className="search-input"
                id="search-input-home"
                // value={search}
                onKeyDown={() => addTimerEvent()}
                onChange={(e) => searchCall(e)}
              />
              <Select defaultValue={"en"}
              onChange={(e) => handleCountryOfOrigin(e)}
              options={options}
              styles={customStyles}
              className="country"
              placeholder="English"
              />

              <Select defaultValue={"en"}
              onChange={(e) => handleTranslateTo(e)}
              options={options}
              styles={customStyles}
              className="translate"
              placeholder="English"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "black",
                }
              })}
              />
              {/* <select
                id="country-of-origin-select"
                onChange={(e) => handleCountryOfOrigin(e)}
              >
                {data.map((lang, inx) => {
                  return inx == 0 ? (
                    <option key={inx}>Original language</option>
                  ) : (
                    <option key={inx} value={lang.iso_639_1}>
                      {lang.english_name}
                    </option>
                  );
                })}
              </select> */}
              {/* <select
                id="translate-to-select"
                onChange={(e) => handleTranslateTo(e)}
              >
                {data.map((lang, inx) => {
                  return inx == 0 ? (
                    <option key={inx}>Translate to</option>
                  ) : (
                    <option key={inx} value={lang.iso_639_1}>
                      {lang.english_name}
                    </option>
                  );
                })}
              </select> */}
            </div>
          ) : (
            // ELSE
            <div className="search-input-wrap">
              <div className="search-select-wrap">
                <select
                  id="country-of-origin-select"
                  onChange={(e) => handleCountryOfOrigin(e)}
                >
                  {data.map((lang, inx) => {
                    return inx == 0 ? (
                      <option key={inx}>Original language</option>
                    ) : (
                      <option key={inx} value={lang.iso_639_1}>
                        {lang.english_name}
                      </option>
                    );
                  })}
                </select>
                <select
                  id="translate-to-select"
                  onChange={(e) => handleTranslateTo(e)}
                >
                  {data.map((lang, inx) => {
                    return inx == 0 ? (
                      <option key={inx}>Translate to</option>
                    ) : (
                      <option key={inx} value={lang.iso_639_1}>
                        {lang.english_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="search-icon-wrap">
                <FontAwesomeIcon icon={faSearch} className="search-icon-home" />
                <input
                  // ref={ref}
                  // onClick={() => switchSearchBackground()}
                  type="text"
                  className="search-input"
                  id="search-input-home"
                  // value={search}
                  onKeyDown={() => addTimerEvent()}
                  onChange={(e) => searchCall(e)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {searchRes.length !== 0 ? (
        <div className="result-wrapper">
          {searchRes.map((el, index) => {
            return (
              <div
                className="result-card"
                key={index}
                onClick={() => navigateMovie(el.id)}
              >
                <p>{el.overview}</p>
                {!isMobile ? (
                  <>
                    <p className="result-home-p" style={{ color: "white" }}>
                      {el.title}
                    </p>
                    <div className="result-image-wrap">
                      <img
                        src={
                          "https://image.tmdb.org/t/p/original/" +
                          el.poster_path
                        }
                        alt={el.title}
                      />
                      <div className="result-overlay">
                        {Math.round(el.vote_average * 10) / 10}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      className="result-image-mob"
                      src={
                        "https://image.tmdb.org/t/p/original/" + el.poster_path
                      }
                      alt={"No image available"}
                    />
                    <div className="year-title-wrap">
                      <p className="result-home-p" style={{ color: "white" }}>
                        {el.title}
                      </p>
                      <p>{el.release_date}</p>
                    </div>
                    <div className="vote-wrapper">
                      <p className="vote-p">
                        {Math.round(el.vote_average * 10) / 10}
                      </p>
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                    <p>{el.original_language}</p>
                  </>
                )}
                {/* WHAT I SHOULD FIX TONIGHT = background gradient for desktop home result
                  singlemovie layout
                */}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Home;
