import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppHeader } from "../cmps/AppHeader";
import { AppPlayer } from "../cmps/AppPlayer";
import { StationList } from "../cmps/StationList";
import { CurrentSongDetails } from "../cmps/CurrentSongDetails";
import { SvgIcon } from "../cmps/SvgIcon";
import { stationService } from "../services/station";
import { useScreenCategory } from "../customHooks/useBreakpoint";

import {
  addSongToStation,
  createEmptyStation,
  getUserStations,
  isSongSavedAtSomeStation,
  loadLikedSongsStation,
  loadLibraryStations as loadLibraryStations,
  setExpandLib,
  loadHomeStations,
  updateHomeStation,
  updateStation,
  getCmdUpdateHomeStation,
  getCmdUpdateStation,
} from "../store/actions/station.actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { SOCKET_EVENT_SONG_ADDED, SOCKET_EVENT_STATION_SAVED, SOCKET_EVENT_STATION_UPDATED, socketService } from "../services/socket.service";
import { useDispatch } from "react-redux";

export const StationIndex = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screenCategory = useScreenCategory();
  const [isHome, setHomeLib] = useState(true);
  const dispatch = useDispatch()

  const [isSearchDisplayed, setIsSearchDisplayed] = useState(false);
  const [isHomePageDisplayed, setIsHomePageDisplayed] = useState(true);

  const libraryStations = useSelector(
    (storeState) => storeState.stationModule.stations
  );
  const homeStations = useSelector(
    (storeState) => storeState.stationModule.homeStations
  );
  const likedSongsStation = useSelector(
    (storeState) => storeState.stationModule.likedSongsStation
  );
  const displayCard = useSelector(
    (storeState) => storeState.stationModule.displayCard
  );

  const expendLib = useSelector(
    (storeState) => storeState.stationModule.expendLib
  );

  const user = useSelector((storeState) => storeState.userModule.user);

  useEffect(() => {
    if (user) {
      loadLibraryStations({ location: "library", userId: user._id });
      loadHomeStations({ location: "home", userId: user._id });
    }
    else {
      loadHomeStations({ location: "home", userId: null });
    }
    if (user) {
      loadLikedSongsStation();
    }

    // socketService.on(SOCKET_EVENT_STATION_UPDATED, station => {
    //   dispatch(getCmdUpdateHomeStation(station))
    //   dispatch(getCmdUpdateStation(station))
    // })

    socketService.on(SOCKET_EVENT_STATION_SAVED, ({ user, station }) => {
      updateStation(station)
      showSuccessMsg(`${user.fullname} saved your ${station.name} playlist`)
    })

    socketService.on(SOCKET_EVENT_SONG_ADDED, ({ user, station }) => {
      updateStation(station)
      updateHomeStation(station)
      showSuccessMsg(`${user.fullname} added a song in ${station.name} playlist`)
    })

    return () => {
      socketService.off(SOCKET_EVENT_STATION_UPDATED)
      socketService.off(SOCKET_EVENT_STATION_SAVED)
      socketService.off(SOCKET_EVENT_SONG_ADDED)
    }
  }, [user]);

  useEffect(() => {
    getLocation();
  }, [location]);

  function getLocation() {
    if (location.pathname.includes("search")) {
      setIsSearchDisplayed(true);
    } else {
      setIsSearchDisplayed(false);
    }
    if (location.pathname === "/") {
      setIsHomePageDisplayed(true);
    } else {
      setIsHomePageDisplayed(false);
    }
  }

  function toggleDemoLib() {
    setHomeLib(false);
    navigate("/");
  }
  function goToHome() {
    setHomeLib(true);
    navigate("/");
  }

  async function onAddToLikedSongs(songToAdd) {
    try {
      if (user) {
        await addSongToStation(likedSongsStation._id, songToAdd);
        showSuccessMsg("Added to Liked Songs")
      }
      else {
        showErrorMsg("Log in to add this to your Liked Songs")
      }
    } catch (err) {
      console.log("Having issues with saving this song", err);
      showErrorMsg("Cannot Add to your Liked Songs")
    }
  }

  async function onCreateEmptyStation() {
    try {
      if (user) {
        const emptyStation = await createEmptyStation();
        navigate(`/station/${emptyStation._id}`);
      }
      else {
        showErrorMsg("Log in to create playlists")
      }
    } catch (err) {
      console.log("Creating new playlist failed", err)
      showErrorMsg("Failed to create playlist")
    }
  }

  function onSetExpandLib() {
    setExpandLib(!expendLib);
  }

  function isSongSavedAtSomeUserStation(song) {
    const userStations = user ? getUserStations(libraryStations) : []
    return isSongSavedAtSomeStation(userStations, song.id);
  }

  return (
    <div
      className={`station-index  ${displayCard ? "display-card" : ""}  ${expendLib ? "expend-lib" : ""
        } `}
    >
      {/* <p>Current screen category: {screenCategory}</p> */}
      {/* {isHome ? "home" : "library"} */}
      {/* {console.log("rendered")} */}
      <aside>
        <nav>
          {((screenCategory !== "mobile" && !isHomePageDisplayed) ||
            (screenCategory === "mobile" && !isHome)) && (
              <button onClick={goToHome} className="btn-type-2">
                {" "}
                <SvgIcon iconName="home" /> Home{" "}
              </button>
            )}
          {((screenCategory !== "mobile" && isHomePageDisplayed) ||
            (screenCategory === "mobile" && isHome)) && (
              <button onClick={goToHome} className="btn-type-2 current">
                {" "}
                <SvgIcon iconName="homeActive" /> Home{" "}
              </button>
            )}

          {!isSearchDisplayed && (
            <Link to="/search" className="btn-type-2 ">
              {" "}
              <SvgIcon iconName="search" /> Search
            </Link>
          )}
          {isSearchDisplayed && (
            <Link to="/search" className="btn-type-2 current">
              {" "}
              <SvgIcon iconName="searchActive" /> Search
            </Link>
          )}

          {screenCategory === "mobile" && isHome && (
            <button className="btn-type-2" onClick={toggleDemoLib}>
              {" "}
              <SvgIcon iconName="library" /> Your Library
            </button>
          )}

          {screenCategory === "mobile" && !isHome && (
            <button className="btn-type-2 current" onClick={toggleDemoLib}>
              {" "}
              <SvgIcon iconName="library" /> Your Library
            </button>
          )}

          {screenCategory === "mobile" && (
            <Link
              to="https://open.spotify.com/download"
              className="btn-type-2 "
            >
              {" "}
              <SvgIcon iconName="arrowDown" /> Install now
            </Link>
          )}
        </nav>

        <section className="library">
          <div className="library-pannel">
            <button title="Collapse Your Library" className="btn-type-2">
              {" "}
              <SvgIcon iconName="library" />
              Your Library
            </button>
            <button
              onClick={onCreateEmptyStation}
              title="Create playlist"
              className="icon-type-1"
            >
              <SvgIcon iconName="plus" />
            </button>
            <button
              title="Show more"
              className="icon-type-1"
              onClick={onSetExpandLib}
            >
              <>
                {expendLib && <SvgIcon iconName="arrowLeft" />}
                {!expendLib && <SvgIcon iconName="arrowRight" />}
              </>
            </button>
          </div>
          <div className="library-types">
            <button className="btn-type-1">Playlists</button>
            <button className="btn-type-1">Artists</button>
            <button className="btn-type-1">Albums</button>
          </div>
          <div className="search-in-lib">
            {/* <button title="Search in your Library" className="btn btn-icon"> */}

            <button title="Search in your Library" className="icon-type-1">
              {" "}
              <SvgIcon iconName="search" />
            </button>
            <input
              type="text"
              className="search-field"
              placeholder="Search in your Library"
            />
            {/* <button>Recents</button> */}
          </div>
          <div className="station-list-wrapper">
            {user && (
              <StationList
                stations={libraryStations}
                location="library"
                onCreateEmptyStation={onCreateEmptyStation}
              />
            )}
          </div>
        </section>
      </aside>
      <main>
        {(isHomePageDisplayed || isSearchDisplayed) && <AppHeader />}

        {((isHomePageDisplayed && screenCategory !== "mobile") ||
          (isHomePageDisplayed && isHome && screenCategory === "mobile")) && (
            <StationList
              stations={homeStations}
              location="main"
              onCreateEmptyStation={onCreateEmptyStation}
            />
          )}

        {isHomePageDisplayed && screenCategory === "mobile" && !isHome && (
          <div className="station-list-wrapper">
            <StationList
              stations={libraryStations}
              location="library"
              onCreateEmptyStation={onCreateEmptyStation}
            />
          </div>
        )}

        {!isHomePageDisplayed && (
          <Outlet
            context={{
              onAddToLikedSongs,
              isSongSavedAtSomeUserStation,
              onCreateEmptyStation
            }}
          />
        )}
      </main>
      {displayCard && (
        <section className="card">
          <CurrentSongDetails />
        </section>
      )}
      <footer>{<AppPlayer />}</footer>
    </div>
  );
};
