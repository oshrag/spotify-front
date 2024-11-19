import { useState } from "react";
import { useOutletContext, useParams } from "react-router";
import { getSongsFromYoutube } from "../store/actions/station.actions";
import { useEffectUpdate } from "../customHooks/useEffectUpdate";
import { SongList } from "./SongList";
import { StationList } from "./StationList";
// import { stationService } from "../services/station";
import { showErrorMsg } from "../services/event-bus.service";
import { useSelector } from "react-redux";
import { useScreenCategory } from "../customHooks/useBreakpoint";

export const SearchResult = () => {
  const params = useParams();
  const [songs, setSongs] = useState(null);
  const {
    onAddToLikedSongs,
    isSongSavedAtSomeUserStation,
    onCreateEmptyStation,
  } = useOutletContext();
  const homeStations = useSelector(
    (storeState) => storeState.stationModule.homeStations
  );
  // const [stationsByUserInput, setStationsByUserInput] = useState([]);
  const screenCategory = useScreenCategory();
  useEffectUpdate(() => {
    loadSongs();
    // loadStationsByUserInput()
  }, [params]);

  async function loadSongs() {
    try {
      const songs = await getSongsFromYoutube(params.userInput);
      setSongs(songs);
    } catch (error) {
      console.log("Cannot load songs", error);
      showErrorMsg("Failed to find songs");
    }
  }

  // async function loadStationsByUserInput() {
  //   try {
  //     const stationsByUserInput = await stationService.query({
  //       location: "search",
  //       userInput: params.userInput
  //     })

  //     setStationsByUserInput(stationsByUserInput)
  //   } catch (error) {
  //     console.log("Cannot load stations by user input", error);
  //   }
  // }

  function filterStationsByUserInput() {
    let stations = [];
    if (params.userInput) {
      stations = homeStations.filter((station) =>
        station.tags.some(
          (tag) => tag.toLowerCase() === params.userInput.toLowerCase()
        )
      );
    }

    return stations;
  }

  const stations = filterStationsByUserInput();
  const firstSongImg = songs ? songs[0].imgUrl : null;
  const firstSongName = songs ? songs[0].title : "";
  const firstSongArtist = songs ? songs[0].channelTitle : "";

  return (
    <div className="search-result">
      {/* <RecentSearches/> */}
      {params.userInput && songs && (
        <>
          <div className="btns-container">
            <button className="btn-type-1">All</button>
            <button className="btn-type-1">Playlists</button>
            <button className="btn-type-1">Songs</button>
            <button className="btn-type-1">Artists</button>
            <button className="btn-type-1">Genres</button>
          </div>
          <section className="search-result-container">
            {screenCategory !== "mobile" && (
              <section className="inner-grid">
                <h2 className="top-res">Top result</h2>
                <div className="top-result-container">
                  <img src={firstSongImg} />
                  <span className="name">{firstSongName}</span>
                  <section className="type">
                    <span className="song">song</span>
                    <span>{firstSongArtist}</span>
                  </section>
                </div>
              </section>
            )}

            <section className="inner-grid">
              <h2 className="songs">Songs</h2>
              <SongList
                songs={songs}
                onAddToStation={onAddToLikedSongs}
                isSongSavedAtStation={isSongSavedAtSomeUserStation}
                isUserStation={false}
                type="search"
              />
            </section>
            <h2>Playlists result</h2>
            {!!stations.length && (
              <StationList
                stations={stations}
                location="search"
                onCreateEmptyStation={onCreateEmptyStation}
              />
            )}
            {!stations.length && (
              <span className="span-no-results">No results</span>
            )}
          </section>
        </>
      )}
      {/* {!params.userInput && <h1>Suggestions</h1>} */}
    </div>
  );
};
