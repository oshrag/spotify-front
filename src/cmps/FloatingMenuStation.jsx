import {
  removeStation,
  addStationToLibrary,
  removeStationFromLibrary
} from "../store/actions/station.actions.js";
import { SvgIcon } from "./SvgIcon.jsx";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { useNavigate } from "react-router";

export const FloatingMenuStation = ({
  station,
  location,
  onDone,
  onOpenStationDetails,
  onCreateEmptyStation
}) => {

  const user = useSelector(storeState => storeState.userModule.user)
  const currentStation = useSelector(storeState => storeState.stationModule.station)
  const navigate = useNavigate()

  async function onDeleteStation() {
    onDone();
    try {
      await removeStation(station._id);
      if (currentStation && currentStation._id === station._id) {
        navigate('/')
      }
      showSuccessMsg("Removed from Your Library")
    } catch (error) {
      console.log("Cannot remove station", error);
      showErrorMsg("Cannot Remove this Playlist")
    }
  }

  function onEditStationDetails() {
    onOpenStationDetails()
  }

  async function onAddStationToLibrary() {
    onDone();
    try {
      if (user) {
        await addStationToLibrary(station, currentStation?._id);
        showSuccessMsg("Added to Your Library")
      }
      else {
        showErrorMsg("Log in to add this to your Library")
      }
    } catch (error) {
      console.log("Cannot add to library", error);
      showErrorMsg("Cannot Add to Your Library")
    }
  }

  async function onRemoveStationFromLibrary() {
    onDone();
    try {
      await removeStationFromLibrary(station, currentStation?._id);
      showSuccessMsg("Removed from Your Library")
    } catch (error) {
      console.log("Cannot remove from library", error);
      showErrorMsg("Cannot Remove from Your Library")
    }
  }

  function onCreateStation() {
    onDone();
    onCreateEmptyStation();
  }

  const isLikedSongsStation = station.type === "liked"
  const isUserStation = user && user._id === station.createdBy.id
  const isSavedStation = user && station.savedBy.some(userId => userId === user._id)
  return (
    <ul>
      {(location === "library" || location === "station-details") &&
        isUserStation &&
        !isLikedSongsStation &&
        <li onClick={onDeleteStation}>
          <span className="btn-type-2">
            <SvgIcon iconName="delete" /> Delete
          </span>
        </li>
      }
      {(location === "station-details" || location === "library") &&
        isUserStation &&
        !isLikedSongsStation &&
        <li onClick={onEditStationDetails} className="lastInGroup">
          <span className="btn-type-2">
            <SvgIcon iconName="edit" /> Edit details
          </span>
        </li>
      }
      {location !== "library" && !isUserStation && !isSavedStation &&
        <li onClick={onAddStationToLibrary} className="lastInGroup">
          <span className="btn-type-2">
            <SvgIcon iconName="add" /> Add to Your Library
          </span>
        </li>
      }
      {!isUserStation && isSavedStation &&
        <li onClick={onRemoveStationFromLibrary} className="lastInGroup">
          <span className="btn-type-2 active">
            <SvgIcon iconName="tick" /> Remove From your library
          </span>
        </li>
      }

      {location !== "station-details" &&
        <li>
          <span className="btn-type-2" onClick={onCreateStation}>
            <SvgIcon iconName="create" /> Create Playlist
          </span>
        </li>
      }
    </ul>
  );
};
