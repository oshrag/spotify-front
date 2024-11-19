import { useEffect, useState } from "react";
import { SvgIcon } from "./SvgIcon";
import { useLocation, useNavigate } from "react-router";
import { getSongsFromYoutube } from "../store/actions/station.actions";
import { SongList } from "./SongList";

export const AppSearch = ({ onAddToStation, isSongSavedAtStation }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserAtStation, setIsUserAtStation] = useState(false);
  const [userInput, setUserInput] = useState(null);
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    getLocation();
  }, [location]);

  useEffect(() => {
    if (!userInput) return;
    if (isUserAtStation) {
      loadSongs()
    } else {
      navigate(`/search/${userInput}`);
    }
  }, [userInput]);

  async function loadSongs() {
    const songs = await getSongsFromYoutube(userInput, 'search-at-station')
    setSongs(songs)
  }

  function getLocation() {
    if (location.pathname.includes("station")) {
      setIsUserAtStation(true);
    } else {
      setIsUserAtStation(false);
    }
  }

  async function onSearch(ev) {
    ev.preventDefault();
    setUserInput(ev.target.txt.value);
  }

  return (
    <div className="app-search">
      <form className="search-form" onSubmit={onSearch}>
        <span className="icon-search">
          <SvgIcon iconName={"search"} />
        </span>
        <input
          type="text"
          name="txt"
          placeholder={
            isUserAtStation ? "Search for songs" : "What do you want to play?"
          }
        />
      </form>
      {isUserAtStation && userInput && songs &&
        <SongList
          songs={songs}
          onAddToStation={onAddToStation}
          isSongSavedAtStation={isSongSavedAtStation}
          isUserStation={true}
          type='search-at-station' />}
    </div>
  );
};
