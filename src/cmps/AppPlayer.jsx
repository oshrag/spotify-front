import { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";

import { SvgIcon } from "./SvgIcon.jsx";
import { utilService } from "../services/util.service.js";

import { useSelector } from "react-redux";
import {
  setCurrentSong,
  setPlayPause,
  setIsShuffle,
  setDisplayHideCard,
} from "../store/actions/station.actions";
import { useScreenCategory } from "../customHooks/useBreakpoint.js";

// const origin = process.env.NODE_ENV === 'production' ?
//  window.location.origin : "https://localhost:5173"

export const AppPlayer = () => {
  const playerRef = useRef(null);

  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(0);

  const [isSongLoaded, setIsSongLoaded] = useState(false);
  // const [isShuffleLocal, setIsShuffleLocal] = useState(false);

  const stationModul = useSelector((storeState) => storeState.stationModule);

  const { currentSong, isPlaying, station, isShuffle, displayCard } =
    stationModul;

  const screenCategory = useScreenCategory();

  useEffect(() => {
    if (isSongLoaded) {
      if (isPlaying == true) {
        playVideo();
      }
      if (isPlaying == false) {
        pauseVideo();
      }
    }
  }, [isPlaying, isSongLoaded]);

  useEffect(() => {
    setIsSongLoaded(false);
  }, [currentSong]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTimeInSeconds(
          parseInt(playerRef.current.getCurrentTime(), 10)
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const handleNextSong = () => {
  //   onNext
  // };

  const onReady = (event) => {
    // שומר את רפרנס ה-Player instance
    playerRef.current = event.target;
    playerRef.current.setPlaybackQuality("small"); // מגדיר איכות נמוכה כדי להפחית את הצריכה
    // setIsPlayerReady(true);
  };

  const playVideo = () => {
    //console.log("playVideo");
    if (playerRef.current && currentSong.id) {
      playerRef.current.playVideo();
      if (isPlaying == false) {
        setPlayPause(true);
      }
    }
  };

  const pauseVideo = () => {
    //console.log("pauseVideo");
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      if (isPlaying == true) {
        setPlayPause(false);
      }
    }
  };

  const onStateChange = (event) => {
    setCurrentTimeInSeconds(parseInt(playerRef.current.getCurrentTime(), 10));
    if (event.data === window.YT.PlayerState.CUED) {
      setIsSongLoaded(true);
    }
  };

  const handleRangeChange = (event) => {
    // const time = parseFloat(event.target.value);
    const timeInSeconds = parseInt(event.target.value, 10);
    setCurrentTimeInSeconds(timeInSeconds);
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const onNext = () => {
    let nextIndex;
    const currentIndex = station.songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (isShuffle) {
      nextIndex = utilService.getRandomExcludingY(
        station.songs.length - 1,
        currentIndex
      );
      console.log("onNext Shuffle nextIndex:", nextIndex);
    } else {
      if (currentIndex === -1) {
        console.log("error onNext");
        return null;
      }
      nextIndex = (currentIndex + 1) % station.songs.length;
    }

    setCurrentSong(station.songs[nextIndex]);
    setIsSongLoaded(false);
  };

  const onPrev = () => {
    let prevIndex;
    const currentIndex = station.songs.findIndex(
      (song) => song.id === currentSong.id
    );

    if (isShuffle) {
      prevIndex = utilService.getRandomExcludingY(
        station.songs.length - 1,
        currentIndex
      );
    } else {
      if (currentIndex === -1) {
        console.log("error onPrev");
        return null;
      }

      prevIndex =
        currentIndex == 0 ? station.songs.length - 1 : currentIndex - 1;
    }
    setCurrentSong(station.songs[prevIndex]);
    setIsSongLoaded(false);
  };

  const onShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const onDisplayCard = () => {
    if (currentSong.id) {
      setDisplayHideCard(!displayCard);
    }
  };

  const opts = {
    height: "0", // גובה ורוחב אפס כדי להסתיר את הוידאו
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      origin: window.location.origin, // מגדיר את המקור ל-URL הנוכחי של הדפדפן
    },
  };

  return (
    <div className="app-player">
      <YouTube
        videoId={currentSong.id}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onEnd={onNext}
      />

      <section className="current-song-details">
        {currentSong.id && (
          <div className="square-ratio">
            {" "}
            <img src={currentSong.imgUrl} />
          </div>
        )}

        <span>{currentSong.title}</span>
      </section>

      <section
        className={`control-pannel ${screenCategory !== "mobile" ? "center-item" : ""
          } `}
      >
        <section className="controls">
          <span onClick={onShuffle} className="icon-type-2">
            {" "}
            <SvgIcon
              iconName="shuffle"
              style={`${isShuffle ? "active" : null}`}
            />
          </span>

          <span onClick={onPrev} className="icon-type-2">
            {" "}
            <SvgIcon iconName="skipback" />
          </span>

          {isPlaying ? (
            <span onClick={pauseVideo} className="icon-type-3">
              {" "}
              <SvgIcon iconName="pause" />
            </span>
          ) : (
            <span onClick={playVideo} className="icon-type-3">
              {" "}
              <SvgIcon iconName="play" />
            </span>
          )}

          <span onClick={onNext} className="icon-type-2">
            {" "}
            <SvgIcon iconName="skipforward" />
          </span>

          <span className="icon-type-2">
            {" "}
            <SvgIcon iconName="repeat" />
          </span>
        </section>
        <div className="trace-wrapper">
          {currentSong.id && (
            <span>{utilService.formatTime(currentTimeInSeconds)}</span>
          )}
          <section className="trace">
            <input
              type="range"
              min="0"
              max={
                currentSong.id
                  ? utilService.convertFormattedTimeToSeconds(
                    currentSong.duration
                  )
                  : "120"
              }
              value={currentTimeInSeconds || 0}
              onChange={handleRangeChange}
            // step="0.1"
            // max={playerRef.current ? playerRef.current.getDuration() : 100}
            />
          </section>
          {currentSong.id && <span>{currentSong.duration}</span>}
        </div>
      </section>

      <section className="extra-controls">
        {/* <span onClick={onDisplayCard} className="icon-type-2">
          <SvgIcon iconName="nowPlaying" />
        </span> */}
      </section>
    </div>
  );
};

export default AppPlayer;
