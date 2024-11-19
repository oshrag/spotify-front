import React from "react";
import { useSelector } from "react-redux";
import { SvgIcon } from "../cmps/SvgIcon";

import { setDisplayHideCard } from "../store/actions/station.actions";

export const CurrentSongDetails = () => {
  const stationModul = useSelector((storeState) => storeState.stationModule);

  const { currentSong, station, displayCard } = stationModul;

  const onDisplayCard = () => {
    setDisplayHideCard(!displayCard);
  };

  return (
    <div className="current-song-card">
      <header>
        <span>{station.name} </span>
        <span onClick={onDisplayCard}>
          <SvgIcon iconName="close" />
        </span>
      </header>

      <img src={currentSong.imgUrl} />
      <span>{currentSong.title}</span>
    </div>
  );
};
