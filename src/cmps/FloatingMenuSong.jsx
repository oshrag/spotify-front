import { StationList } from "./StationList.jsx";
import {
  addSongToStation,
  getUserStations,
  isSongSavedAtStation,
  removeSongFromStation
} from "../store/actions/station.actions.js";
import { useSelector } from "react-redux";
import { SvgIcon } from "./SvgIcon.jsx";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";

export const FloatingMenuSong = ({ onDone, song }) => {
  const stations = useSelector(
    (storeState) => storeState.stationModule.stations
  );
  const currentStation = useSelector((storeState) => storeState.stationModule.station);
  const likedSongsStation = useSelector(
    (storeState) => storeState.stationModule.likedSongsStation
  );
  const user = useSelector(storeState => storeState.userModule.user)

  function onRemoveSongFromStation() {
    onDone();
    try {
      removeSongFromStation(currentStation._id, song.id, currentStation._id);
    } catch (err) {
      console.log("Having issues with removing song from station", err);
      showErrorMsg("Failed to Remove song");
    }
  }

  function isSongSavedAtLikedSongs() {
    return isSongSavedAtStation(likedSongsStation, song.id);
  }

  async function onToggleAddToLikedSongs() {
    onDone();
    if (!user) {
      showErrorMsg("Log in to add this to your Liked Songs")
      return
    }
    let isSongAdded = false; // is song added or removed from liked songs station
    try {
      if (isSongSavedAtLikedSongs()) {
        await removeSongFromStation(likedSongsStation._id, song.id, currentStation?._id);
      } else {
        await addSongToStation(likedSongsStation._id, song);
        isSongAdded = true;
      }
      showSuccessMsg(
        `${isSongAdded ? "Added to" : "Removed from"} Liked Songs`
      );
    } catch (err) {
      console.log(
        "Having issues with adding/removing song from liked songs station",
        err
      );
      showErrorMsg("Failed to Add/Remove song from Liked Songs");
    }
  }

  async function onAddSongToStation(station) {
    onDone();
    try {
      if (!isSongSavedAtStation(station, song.id)) {
        await addSongToStation(station._id, song)
        showSuccessMsg(`Added to ${station.name}`);
      } else {
        showErrorMsg(
          `Already added: This is already in your '${station.name}' playlist.`
        );
      }
    } catch (err) {
      console.log("Having issues with adding this song to station", err);
      showErrorMsg("Failed to Add song");
    }
  }
  const userStations = user ? getUserStations(stations) : []
  const isUserStation = user && currentStation && user._id === currentStation.createdBy.id;
  const isSongToMark = user && isSongSavedAtLikedSongs();

  return (
    <div className="song-floating-menu">
      <ul>
        <li>
          <span className="btn-type-2">
            <SvgIcon iconName="plus" /> Add To Playlist
          </span>
          <StationList
            stations={userStations}
            location="modal-more"
            onAddSongToStation={onAddSongToStation}
          />
        </li>
        {currentStation && currentStation.type === "normal" && isUserStation && (
          <li onClick={onRemoveSongFromStation}>
            <span className="btn-type-2">
              <SvgIcon iconName="bin" /> Remove From This Playlist
            </span>
          </li>
        )}
        {/* <li onClick={onToggleAddToLikedSongs}>
          {`${
            isSongSavedAtLikedSongs() ? "Remove From" : "Save to"
          } Your Liked Songs`}
        </li> */}

        <li onClick={onToggleAddToLikedSongs}>
          {isSongToMark ? (
            <>
              <span className="btn-type-2 active">
                <SvgIcon iconName="tick" />
                Remove From Your Liked Songs{" "}
              </span>
            </>
          ) : (
            <>
              <span className="btn-type-2">
                <SvgIcon iconName="add" />
                Save To Your Liked Songs{" "}
              </span>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};
