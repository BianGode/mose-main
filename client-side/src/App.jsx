// TESTTTTTTTTTTTTTT
import { useEffect, useState, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./assets/styles/App.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function App() {
  const [init, setInit] = useState(false);

  const particlesLoaded = (container) => {
    // console.log(container);
  };
  
  const [theme, setTheme] = useState("original");
  const [logo, setLogo] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 910 ? true : false
  );

  const location = useLocation();

  // https://www.robinwieruch.de/react-hook-detect-click-outside-component/
  const useOutsideClick = (callback) => {
    const reference = useRef();

    useEffect(() => {
      const handleClick = (event) => {
        if (reference.current && !reference.current.contains(event.target)) {
          console.log(reference.current);
          console.log(event.target);
          console.log(reference.current.contains(event.target));
          callback();
        } else {
          console.log("clicked inside!");
        }
      };

      document.addEventListener("click", handleClick, true);

      return () => {
        document.removeEventListener("click", handleClick, true);
      };
    }, [reference]);

    return reference;
  };

  //searchBar component
  const HeaderSearch = ({ screenWidth }) => {
    // const ref = useOutsideClick(test);

    function checkInput(event) {
      if (event.keyCode !== 13) {
        setSearch(event.target.value);
      }
    }

    if (location.pathname !== "/") {
      // if (screenWidth == "mobile") {
      return (
        <div id="search-header" className="search-header mob">
          <FontAwesomeIcon
            className="search-icon"
            id="search-icon"
            icon={faSearch}
            onClick={() => toggleSearchInput()}
          />
          <input
            id="search-input"
            className={searchActive ? "search-input active" : "search-input"}
            type="text"
            value={search}
            onKeyDown={(e) => checkInput(e)}
            onChange={(e) => setSearch(e.target.value)}
            // ref={searchInputRef}
            // onClick={() => searchReqClientSide()}
            placeholder="Search..."
          />
          <button></button>
        </div>
      );
      // }
    } else {
      return null;
    }
  };

  // method to change theme
  function changeTheme(color) {
    setTheme(color);
    console.log(color);
  }

  const toggleShowSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  // const videoOverlayColorSwitch = () => {
  //   const yellow = "rgba(232, 245, 39, 0.9)";
  //   const red = "rgba(245, 39, 39, 0.9)";
  //   const green = "rgba(22, 255, 22, 0.9)";
  //   const blue = "rgba(0, 89, 190, 0.9)";
  //   const black = "rgba(0, 0, 0, 1)";
  //   const colorArray = [
  //     { color: yellow },
  //     { color: red },
  //     { color: green },
  //     { color: blue },
  //   ];
  //   colorArray.forEach((color, i) => {
  //     setTimeout(() => {
  //       document.getElementById(
  //         "video-overlay"
  //       ).style.background = `linear-gradient(45deg, ${black} ,${color.color}, ${black}, ${color.color}, ${black})`;
  //       document.getElementById("video-overlay").style.backgroundSize =
  //         "400% 400%";
  //       document.getElementById("video-overlay").style.transition =
  //         "background 1s ease";
  //     }, i * 5000);
  //   });
  //   // setInterval(() => {
  //   //   document.getElementById('video-overlay').style.backgroundImage = `linear-gradient(45deg, ${black} ,${red}, ${black}, ${red}, ${black})`;
  //   // }, 5000);
  // };
  // videoOverlayColorSwitch()

  const toggleSearchInput = () => {
    console.log("valueOf = " + searchActive);

    console.log(searchActive + " ToggleSearchInputFunction");

    setSearchActive(!searchActive);
  };
  const backgroundOverlay = document.getElementById("video-overlay");

  // method to pause and play homescreenbackground animation
  

  // select theme component
  const SelectTheme = () => {
    const [playState, setPlayState] = useState('running');

    const toggleAnimation = (pausePlayState) => {
    
      if (pausePlayState == "running") {
        backgroundOverlay.style.animationPlayState = "paused";
        setPlayState("paused");
      } else {
        backgroundOverlay.style.animationPlayState = "running";
        setPlayState("running");
      }
    };

    let computedOverlay;
    useEffect(() => {
      if (document.getElementById("video-overlay")) {
        computedOverlay = window.getComputedStyle(
          document.getElementById("video-overlay")
        );
        // setPlayState(
        //   window.getComputedStyle(document.getElementById("video-overlay"))
        //     .animationPlayState == "running"
        //     ? "running"
        //     : "paused"
        // );
      }
    });

    return (
      <div className="selectTheme">
        <div
          className="box original"
          onClick={() => changeTheme("original")}
        ></div>
        <div className="box black" onClick={() => changeTheme("black")}></div>
        <div className="box white" onClick={() => changeTheme("white")}></div>
        {/* ternry for the homepage animation pause/play toggle */}
        {location.pathname == "/" ? (
          playState == "paused" ? (
            <p
              onClick={() =>
                toggleAnimation(computedOverlay.animationPlayState)
              }
            >
              Play
            </p>
          ) : (
            <p
              onClick={() =>
                toggleAnimation(computedOverlay.animationPlayState)
              }
            >
              Pause
            </p>
          )
        ) : null}
      </div>
    );
  };

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.classList.contains("active")) {
      toggleShowSidebar();
    }
  }, [location.pathname]);

  // onClickOutside()
  return (
    // NOTE: I know that the css classnames have bad naming-conventions but I'm gonna do better on my next project
    <div className="particle-content-container">{init && (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={{
          background: {
            // color: {
            //   value: "#000000",
            // },
            // opacity: 0.4,
          },
          fullScreen: false,
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 50,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: { min: 0.9, max: 1 },
            },
            shape: {
              type: "circle",
              // fill: false,
            },
            size: {
              value: { min: 1, max: 2 },
            },
          },
          detectRetina: true,
        }}
      />
    )}
    <div className={theme}>
      <SelectTheme />
      <header className="desktop">
        <img src={logo} alt="logo" />
        <div className="headerLinks">
          <Link to="/about">About</Link>
          <Link to="/">Home</Link>
        </div>
        {
          // if the homepage active then not show the search component in the header
          // else do show

          isMobile ? null : <HeaderSearch screenWidth="desk" />
        }
      </header>
      <header className="mobile">
        <FontAwesomeIcon
          icon={faBars}
          id="sidebar-open-icon"
          onClick={() => toggleShowSidebar()}
          size="lg"
          // style={{ display: "flex" }}
        />
        <div
          id="sideBar"
          className={sidebarActive ? "sidebar active" : "sidebar"}
        >
          <FontAwesomeIcon
            icon={faClose}
            id="sidebar-close-icon"
            onClick={() => toggleShowSidebar()}
            size="lg"
          />
          <div id="sideBarLinks">
            <div className="sidebar-link-singlewrap">
              <Link to="/">Home</Link>
              {location.pathname === "/" ? (
                <p className="upside-down-p">Home</p>
              ) : null}
            </div>
            <div className="sidebar-link-singlewrap">
              <Link to="/about">About</Link>
              {location.pathname === "/about" ? (
                <p className="upside-down-p">About</p>
              ) : null}
            </div>

            {/* {isMobile ? <HeaderSearch screenWidth="mobile" /> : null} */}
          </div>
        </div>
      </header>
      <div className="outlet-wrapper">
        <Outlet />
      </div>
      {/* <button onClick={() => searchReqClientSide()}>button</button> */}
      <footer></footer>
      {/* <useOutsideAlerter/> */}
    </div>
    </div>
  );
}

export default App;
