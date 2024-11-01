import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export const VideoJS = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady, setTimestamp1 } = props;

  // FIX DEZE SHIT
  
  useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add(
        "vjs-big-play-centered",
        "self-overwrite-size"
      );
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        player.on("waiting", () => {
          videojs.log("player is waiting");
        });

        player.on("dispose", () => {
          videojs.log("player will dispose");
        });
        player.on("timeupdate", function () {
          // setTimestamp1(player.currentTime());
        });
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, []);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div className="video-player" data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
