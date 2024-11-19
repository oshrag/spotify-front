import { useNavigate } from "react-router";
import { SvgIcon } from "./SvgIcon.jsx";
import { useStation } from "../customHooks/useStation.js";

export const StationPreview = ({
  station,
  location,
  onAddSongToStation,
  onCreateEmptyStation,
  onToggleMarkStation,
  isStationToMark
}) => {

  const navigate = useNavigate();
  const { handleClick: handleRightClick } = useStation({
    station,
    location,
    onCreateEmptyStation
  })

  async function onClickStation() {
    if (location === "modal-more") {
      onAddSongToStation(station);
    } else if (location === "main" || location === "search") {
      // setStationFromSearch(station);
      onGoToStationDetails();
    } else if (location === "modal-add") {
      onToggleMarkStation(station);
    } else {
      onGoToStationDetails();
    }
  }

  function onGoToStationDetails() {
    navigate(`/station/${station._id}`);
  }

  // function handleClick(event) {
  //   if (location === "modal-add" || location === "modal-more") return;
  //   event.preventDefault();
  //   onToggleModal({
  //     cmp: FloatingMenuStation,
  //     props: {
  //       station: station,
  //       location: location,
  //       onDone() {
  //         if (station._id === stationId) navigate(`/`);
  //         onToggleModal(null);
  //       },
  //       class: "floating-menu-station",
  //       onCreateEmptyStation: onCreateEmptyStation,
  //       onOpenStationDetails() {
  //         onToggleModal(null);
  //         onToggleModal({
  //           cmp: EditStationDetails,
  //           props: {
  //             stationToEdit: station,
  //             class: "floating-edit-station-details",
  //           },
  //         });
  //       },
  //     },
  //     style: {
  //       left: `${event.clientX}px`,
  //       top: `${event.clientY}px`,
  //     },
  //   });
  // }

  const numOfSongs = station.songs.length;
  const profileName = station.createdBy.fullname;

  return (
    <li
      onClick={onClickStation}
      onContextMenu={handleRightClick}
      className={`station-preview ${location}`}
    >
      <section
        className={`station-container ${location === "library" || location === "modal-add"
          ? "intro-outer"
          : ""
          }`}
      >
        <img src={station.imgUrl} />
        <section
          className={`${location === "library" || location === "modal-add"
            ? "intro-inner"
            : ""
            }`}
        >
          <span className="station-name">{station.name}</span>
          {location === "library" && station.type === "liked" && (
            <span className="span-num-of-liked-songs">
              {" "}
              {numOfSongs} songs{" "}
            </span>
          )}
          {location === "library" && station.type === "normal" && (
            <span className="profile-name"> {profileName} </span>
          )}
          {(location === "main" || location === "search") && (
            <span className="station-description">{station.description}</span>
          )}
          {location === "modal-add" && (
            <span className="empty-circle">
              {isStationToMark(station._id) && (
                <SvgIcon iconName="tick" style="active" />
              )}
            </span>
          )}
        </section>
      </section>
    </li>
  );
};

{
  /* <li
onClick={onClickStation}
onContextMenu={handleClick}
className={`station-preview ${location}`}
>
{station.type === "liked" ? (
  <section className={` ${location === "library" ? "intro-outer" : ""} `}>
    <img src={station.imgUrl} />
    <section
      className={`${location === "library" ? "intro-inner" : ""} `}
    >
      <h5>{station.name}</h5>
      {location === "library" && <span> {numOfSongs} songs </span>}
      {location === "modal-add" && <span className="empty-circle"></span>}
    </section>
  </section>
) : (
  <section className={` ${location === "library" ? "intro-outer" : ""} `}>
    <img src={station.imgUrl} />
    <section
      className={` ${location === "library" ? "intro-inner" : ""} `}
    >
      <h5>{station.name}</h5>
      {location === "library" && <span> {profileName} </span>}
      {location === "main" && <span>{station.description}</span>}
      {location === "modal-add" && <span className="empty-circle"></span>}
    </section>
  </section>
)}
</li> */
}

// <li
//   onClick={onClickStation}
//   onContextMenu={handleClick}
//   className="station-preview"
// >
//   {location === "library" && (isUserStation || isSavedStation) && (
//     <section>
//       <img src={station.img} />
//       <h5>{station.name}</h5>
//       <span>
//         {/* Playlist ·{" "} */}
//         {station.type === "liked" ? `${numOfSongs} songs` : profileName}
//       </span>
//     </section>
//   )}
//   {/* {location !== "main" && ( */}
//   <section>
//     <img src={station.imgUrl} />
//     <h5>{station.name}</h5>
//     {location === "main" && <span>{station.description}</span>}
//   </section>
//   {/* )} */}
// </li>
