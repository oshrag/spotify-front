import { useEffect, useState } from "react";
import {
  addSongToStation,
  getUserStations,
  isSongSavedAtStation,
  removeSongFromStation,
} from "../store/actions/station.actions.js";
import { StationList } from "./StationList.jsx";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";

export const FloatingMenuSongAdd = ({ song, onDone }) => {
  const stations = useSelector(
    (storeState) => storeState.stationModule.stations
  );
  const currentStation = useSelector(storeState => storeState.stationModule.station)
  const [stationsToMark, setStationsToMark] = useState([])
  const [stationsToAddSong, setStationsToAddSong] = useState([])
  const [stationsToRemoveSong, setStationsToRemoveSong] = useState([])

  useEffect(() => {
    initializeStationsToMark();
  }, []);

  function initializeStationsToMark() {
    const userStations = getUserStations(stations);
    userStations.forEach((station) => {
      if (isSongSavedAtStation(station, song.id)) {
        addStation(setStationsToMark, station);
      }
    })
  }

  function onToggleMarkStation(station) {
    if (isStationIncluded(stationsToMark, station._id)) {
      unMarkStation(station);
    } else {
      markStation(station);
    }
  }

  function isStationIncluded(stations, stationId) {
    return stations.some((station) => station._id === stationId);
  }

  function addStation(setStations, stationToAdd) {
    setStations((stations) => [...stations, stationToAdd]);
  }

  function removeStation(setStations, stationId) {
    setStations((stations) =>
      stations.filter((station) => station._id !== stationId)
    );
  }

  function unMarkStation(station) {
    removeStation(setStationsToMark, station._id);
    if (isStationIncluded(stationsToAddSong, station._id)) {
      removeStation(setStationsToAddSong, station._id);
    } else {
      addStation(setStationsToRemoveSong, station);
    }
  }

  function markStation(station) {
    addStation(setStationsToMark, station);
    if (isStationIncluded(stationsToRemoveSong, station._id)) {
      removeStation(setStationsToRemoveSong, station._id);
    } else {
      addStation(setStationsToAddSong, station);
    }
  }

  async function onSaveChanges(ev) {
    ev.preventDefault();
    onDone();
    try {
      for (const station of stationsToAddSong) {
        await addSongToStation(station._id, song);
      }

      for (const station of stationsToRemoveSong) {
        await removeSongFromStation(station._id, song.id, currentStation?._id);
      }

      showSuccessMsg("Changes saved");
    } catch (err) {
      console.log("Having issues with adding/removing song", err);
      showErrorMsg("Failed to save changes");
    }
  }

  function isStationToMark(stationId) {
    return isStationIncluded(stationsToMark, stationId);
  }

  const userStations = getUserStations(stations);

  return (
    <form
      onSubmit={onSaveChanges}
      className="floating-menu-song-add"
    >
      {/* <ul> */}
      {/* <li>Add To playlist</li> */}
      {/* <li><AppSearch/></li> */}
      {/* <button> + New playlist</button> */}
      <StationList
        stations={userStations}
        location="modal-add"
        onToggleMarkStation={onToggleMarkStation}
        isStationToMark={isStationToMark}
      />
      {/* </ul> */}
      <section className="cancel-done-btns">
        <button onClick={onDone} type="button">
          Cancel
        </button>
        {(!!stationsToAddSong.length || !!stationsToRemoveSong.length) && (
          <button type="submit" className="done">
            Done
          </button>
        )}
      </section>
    </form>
  );
};
