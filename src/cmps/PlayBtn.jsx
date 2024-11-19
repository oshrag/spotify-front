import React, { useRef } from "react";

import { useSelector } from "react-redux";
// import YouTube from "react-youtube";

import { SvgIcon } from "./SvgIcon";
import { setCurrentSong, setPlayPause } from "../store/actions/station.actions";

export function PlayBtn({ song }) {
  const currentSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  );

  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  );

  function playSong() {
    if (currentSong !== song) {
      setCurrentSong(song);
    }
    setPlayPause(true);
  }

  function pauseSong() {
    setPlayPause(false);
  }

  const pauseDisplay = currentSong.id === song.id && isPlaying ? true : false;

  return (
    <>
      {pauseDisplay == true ? (
        <span onClick={pauseSong}>
          <SvgIcon iconName="pause" />
        </span>
      ) : (
        <span onClick={playSong}>
          <SvgIcon iconName="play" />
        </span>
      )}
    </>
  );
}
