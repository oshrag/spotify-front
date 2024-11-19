import { utilService } from "../services/util.service.js";
import { SvgIcon } from "./SvgIcon.jsx";
import { useSelector } from "react-redux";
import { PlayBtn } from "./PlayBtn.jsx";
import { onToggleModal } from "../store/actions/app.actions.js";
import { FloatingMenuSongAdd } from "./FloatingMenuSongAdd.jsx";
import { FloatingMenuSong } from "./FloatingMenuSong.jsx";
import { setCurrentSong, setPlayPause } from "../store/actions/station.actions";
import { useScreenCategory } from "../customHooks/useBreakpoint.js";

export function SongPreview({
  song,
  onAddToStation,
  isSongSavedAtStation,
  isUserStation,
  type,
  index,
}) {
  const currentSong = useSelector(
    (storeState) => storeState.stationModule.currentSong
  );
  const isPlaying = useSelector(
    (storeState) => storeState.stationModule.isPlaying
  );

  const screenCategory = useScreenCategory();

  function playSong() {
    if (currentSong !== song) {
      setCurrentSong(song);
    }
    setPlayPause(true);
  }

  function onOpenMoreOptionsModal(ev, song) {
    const element = ev.currentTarget;
    const rect = element.getBoundingClientRect();

    onToggleModal({
      cmp: FloatingMenuSong,
      props: {
        song,
        onDone() {
          onToggleModal(null);
        },
        class: "floating-menu-song",
      },
      style: {
        // left: `${ev.clientX - 300}px`,
        // top: `${ev.clientY - 200}px`,
        left: `${rect.left - 220}px`,
        top: `${rect.top - 100}px`,
      },
    });
  }

  function onOpenAddToStationModal(ev, song) {
    const element = ev.currentTarget;
    const rect = element.getBoundingClientRect();
    // console.log("Add.......");
    onToggleModal({
      cmp: FloatingMenuSongAdd,
      props: {
        song,
        onDone() {
          onToggleModal(null);
        },
        class: "floating-menu-song-add",
      },
      style: {
        // left: `${ev.clientX - 300}px`,
        // top: `${ev.clientY - 200}px`,
        left: `${rect.left - 280}px`,
        top: `${rect.top - 100}px`,
      },
    });
  }
  const songImg = song.imgUrl;
  const songName = song.title;
  const artistName = song.channelTitle;
  const myClassName = type === "station" ? "song-preview-station-grid" : type;
  const isSongSaved = isSongSavedAtStation(song);

  const isActive = currentSong.id === song.id && isPlaying ? true : false;

  return (
    <li className={`song-preview  ${myClassName}`}>
      {/* col 1 only in station view */}
      {type === "station" && (
        <div className="number">
          <span className={`${isActive ? "num active" : "num"}`}>
            {index + 1}
          </span>
          <span className="play"> {<PlayBtn song={song} />}</span>
        </div>
      )}

      {/* col 2 song image and name */}
      {(type === "search-at-station" || type === "search") && (
        <section className="intro-outer">
          <div className="square-ratio">
            {" "}
            <img src={songImg} />
            <span className="play"> {<PlayBtn song={song} />}</span>
          </div>
          <div className="intro-inner">
            <span>{songName}</span>
            <span>{artistName}</span>
          </div>
        </section>
      )}
      {type === "station" && (
        <section className="intro-outer">
          <div className="square-ratio">
            {" "}
            <img src={songImg} />
          </div>
          <div className="intro-inner" onClick={playSong}>
            <span className={`song-name ${isActive ? "active" : ""}`}>
              {songName}
            </span>
            <span>{artistName}</span>
          </div>
        </section>
      )}

      {/* col 3 album */}
      {screenCategory !== "mobile" && type === "search-at-station" && (
        <section>album</section>
      )}

      {/* col 4 date */}
      {type === "station" && (
        <span className="date">{utilService.formatDate(song.addedAt)}</span>
      )}

      {/* need to be fix - should be general add */}
      {(type === "station" || type === "search") && (
        <span
          //
          className={!isUserStation && isSongSaved ? "" : "add"}
          title={`Add to ${isSongSaved ? "playlist" : "Liked Songs"}`}
          onClick={(ev) =>
            isSongSaved
              ? onOpenAddToStationModal(ev, song)
              : onAddToStation(song)
          }
        >
          {isSongSaved ? (
            <SvgIcon iconName="tick" style="active" />
          ) : (
            <SvgIcon iconName="add" />
          )}
        </span>
      )}

      {/* col 6 duration */}
      {screenCategory !== "mobile" && (
        <span className="song-duration">{song.duration}</span>
      )}

      {/* col 7 more */}
      {/* need to be fix - more not working in search becuse function not exist*/}
      {(type === "station" || type === "search") && (
        <span
          onClick={(ev) => onOpenMoreOptionsModal(ev, song)}
          className="more"
        >
          <SvgIcon iconName="more" />
        </span>
      )}

      {/* col 8 more */}
      {type === "search-at-station" && screenCategory !== "mobile" && (
        <button
          onClick={() => onAddToStation(song)}
          className="btn-type-3 center-item"
        >
          {isSongSaved ? "Added" : "Add"}
        </button>
      )}
      {/* 
      {type === "search" && (
        <section>
          <img style={{ width: "40px", height: "40px" }} src={songImg} />
          <span>{songName}</span>
          <span>{artistName}</span>
          <button
            title="Add to Liked Songs"
            onClick={() => onAddToStation(song)}
          >
            {isSongSavedAtStation(song) ? "Added" : "Add"}
          </button>
        </section>
      )}
      {type === "station" && (
        <section className="song-preview-grid">
          <div className="number">
            <span className="num">{index + 1}</span>
            <span className="play"> {<PlayBtn song={song} />}</span>
          </div>
          <section className="intro-outer">
            <div className="square-ratio">
              {" "}
              <img src={songImg} />
            </div>
            <div className="intro-inner">
              <span>{songName}</span>
              <span>{artistName}</span>
            </div>
          </section>

          <span>{utilService.formatDate(song.addedAt)}</span>
          <span onClick={(ev) => onAddToStation(ev, song)} className="add">
            <SvgIcon iconName="tick" style="active" />
          </span>
          <span onClick={(ev) => onMoreOptions(ev, song)} className="more">
            <SvgIcon iconName="more" />
          </span>
        </section>
      )}
      {type === "search-at-station" && (
        <>
          <section className="intro-outer">
            <div className="square-ratio">
              {" "}
              <img src={songImg} />
              <span className="play"> {<PlayBtn song={song} />}</span>
            </div>
            <div className="intro-inner">
              <span>{songName}</span>
              <span>{artistName}</span>
            </div>
          </section>
          <section>album</section>
          <button onClick={() => onAddToStation(song)} className="btn">
      {type === "search-at-station" && (
        <section>
          <img style={{ width: "40px", height: "40px" }} src={songImg} />
          <span>{songName}</span>
          <span>{artistName}</span>
          <button onClick={() => onAddToStation(song)}>
            {isSongSavedAtStation(song) ? "Added" : "Add"}
          </button>
        </>
      )} */}
    </li>
  );
}
