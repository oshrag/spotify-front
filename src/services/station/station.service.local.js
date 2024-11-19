import { storageService } from '../async-storage.service'
import { utilService } from '../util.service'
import { userService } from '../user.service.local'
import initialStations from '../../../data/stations.json'
import searchRes from "../../../data/search.json"
import demoStations from "../../../data/demo-stations.json"

import { getLoggedInUser } from '../../store/actions/user.actions'

//Checked - All looks good.

export const stationService = {
    query,
    getById,
    // save,
    remove,
    // getStations,
    // addSongToStation, // =
    getLikedSongsStation, // =
    updateStationDetails, // =
    getDemoStations, // =
    // removeSongFromStation, // =
    addStationToLibrary, // =
    isLikedSongStation, // =
    // createEmptyStation,
    // getSongsFromYoutube,
    // isSongSavedAtStation,
    // getUserStations,
    // isSongSavedAtSomeStation,
    isSongInLikedSong, // only in Floating in mark
    addUserLikedToStation, //nobody call that function
    removeUserLikedFromStation, //nobody call that function
    // getEmptyCar,
    // addCarMsg
}
window.ss = stationService
const STORAGE_KEY = 'station_db'
// const API_KEY = 'AIzaSyCUE7BdmEO9uF_gWcV5yY5O3eqyINxdavo'

_createStations()


async function query(filterBy = { txt: '', price: 0 }) {
    console.log('local')
    var stations = await storageService.query(STORAGE_KEY)
    console.log('stations:', stations)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     cars = cars.filter(car => regex.test(car.vendor) || regex.test(car.description))
    // }
    // if (filterBy.price) {
    //     cars = cars.filter(car => car.price <= filterBy.price)
    // }

    // Return just preview info about the boards
    // cars = cars.map(({ _id, vendor, price, owner }) => ({ _id, vendor, price, owner }))
    return stations
}


// function getStations() {
//     return storageService.query(STORAGE_KEY)
// }

async function getLikedSongsStation() {
    const stations = await query()
    const likedSongsStation = stations.find(station => station.type === 'liked')
    return likedSongsStation
}

async function isLikedSongStation(stationId) {
    const station = await getById(stationId)
    const islikedSongsStation = (station.type === 'liked')
    return islikedSongsStation
}

function isSongSavedAtStation(station, songId) {
    return station.songs.some(song => song.id === songId)
}

// function getUserStations(stations) {
//     return stations.filter(station => station.createdBy.id === getLoggedInUser()._id)
// }

// function isSongSavedAtSomeStation(stations, songId) {
//     let isSongSavedAtSomeStation = false
//     stations.forEach(station => {
//         if (station.songs.some(song => song.id === songId)) {
//             isSongSavedAtSomeStation = true
//         }
//     })
//     return isSongSavedAtSomeStation
// }

async function getById(stationId) {
    return await storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
}

// function createEmptyStation() {
//     return {
//         _id: "",
//         name: "My Playlist",
//         type: "normal",
//         description: null,
//         imgUrl: 'https://www.greencode.co.il/wp-content/uploads/2024/07/station-thumb-default.jpg',
//         tags: [],
//         createdBy: {},
//         savedBy: [],
//         songs: []
//     }
// }

// async function save(station) {
//     let savedStation
//     if (station._id) {
//         // const stationToSave = {
//         //     _id: station._id,
//         //     name: station.name,
//         //     tags: station.tags,
//         //     createdBy: station.createdBy,
//         //     likedByUsers: station.likedByUsers,
//         //     songs: station.songs
//         // }
//         savedStation = await storageService.put(STORAGE_KEY, station)
//     } else {
//         // Later, owner is set by the backend
//         const user = {
//             id: getLoggedInUser()._id,
//             fullname: getLoggedInUser().name
//         }
//         const stationToSave = {
//             ...station, createdBy: user
//         }
//         savedStation = await storageService.post(STORAGE_KEY, stationToSave)
//     }
//     return savedStation
// }

// async function getSongsFromYoutube(userInput) {
//     const searchTerm = userInput
//     let res = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&part=snippet&type=video&videoCategoryId=10&maxResults=4&key=${API_KEY}`)
//     let data = await res.json()
//     let songs = data.items
//     const songIds = _getSongIds(songs)
//     const songIdsStr = songIds.join(',')
//     res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${songIdsStr}&key=${API_KEY}`)
//     data = await res.json()
//     const songsAdditionalInfo = data.items
//     _addDurationToSongs(songs, songsAdditionalInfo)
//     songs = songs.filter(song => song.duration)
//     songs = _formatSongs(songs)
//     return songs
//     // return searchRes[0].items.slice(0,4)
// }

// function _formatSongs(songs) {
//     const formattedSongs = []
//     songs.forEach(song => {
//         formattedSongs.push(_formatSong(song))
//     });

//     return formattedSongs
// }

// function _getSongIds(songs) {
//     const songIds = []
//     songs.forEach(song => {
//         songIds.push(song.id.videoId)
//     })

//     return songIds
// }

// function _addDurationToSongs(songs, songsAdditionalInfo) {
//     songs.forEach(song => {
//         const songAdditionalInfo = songsAdditionalInfo.find(songAdditionalInfo => songAdditionalInfo.id === song.id.videoId)
//         if (songAdditionalInfo) {
//             song.duration = songAdditionalInfo.contentDetails.duration
//         }
//     })
// }

function getDemoStations() {
    return demoStations

}

async function addStationToLibrary(station) {

    const stationToSave = {
        ...station, savedBy: [...station.savedBy, getLoggedInUser()._id]
    }

    const stations = await getStations()
    const isExists = stations.some(_station => _station._id === station._id)
    if (isExists) {
        return Promise.resolve('already exists');
    }
    const savedStation = await storageService.post(STORAGE_KEY, stationToSave)


    return savedStation
}

// async function addSongToStation(stationId, song) {
//     // Later, this is all done by the backend
//     const station = await getById(stationId)

//     station.songs.push(song)
//     await storageService.put(STORAGE_KEY, station)

//     return station // ?
// }


// async function removeSongFromStation(stationId, songId) {

//     const station = await getById(stationId)
//     station.songs = station.songs.filter((song) => song.id !== songId)
//     await storageService.put(STORAGE_KEY, station)

//     return station // ?
// }

async function addUserLikedToStation(stationId, userId) {
    const station = await getById(stationId)

    station.likedByUsers.push(userId)
    await storageService.put(STORAGE_KEY, station)

    return station // ?
}

async function removeUserLikedFromStation(stationId, userId) {
    const station = await getById(stationId)

    station.likedByUsers.filter((user) => user.id == userId)
    await storageService.put(STORAGE_KEY, station)

    return station // ?
}



async function updateStationDetails(stationToSave) {

    const station = await getById(stationToSave._id)

    // station.name = stationToSave.name;
    // station.description = stationToSave.description;
    // station.imgUrl = stationToSave.imgUrl;

    Object.assign(station, stationToSave);

    await storageService.put(STORAGE_KEY, station)

    return station // ?)

}

async function isSongInLikedSong(songId) {

    const station = await getLikedSongsStation();

    console.log('isSongInLikedSong songId:', songId)
    console.log('isSongInLikedSong station:', station)
    const isInStation = station.songs.some((song) => song.id === songId)
    console.log('isSongInLikedSong isInStation:', isInStation)
    return isInStation;

}

function _formatSong(song) {
    const user = {
        id: getLoggedInUser()._id,
        name: getLoggedInUser().name
    }
    return {
        id: song.id.videoId,
        title: getSubstringBeforePipe(song.snippet.title),
        //title: song.snippet.title,
        channelTitle: song.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${song.id.videoId}`,
        imgUrl: song.snippet.thumbnails.default.url,
        addedBy: user,
        addedAt: Date.now(),
        duration: _formatSongDuration(song.duration)
    }
}

// function _formatSongDuration(songDuration) {
//     // Examples of durations: 'PT4M' | 'PT35S' | 'PT4M35S'

//     let formattedDuration = null
//     if (!songDuration.includes('S')) {
//         const minutes = songDuration.substring(2, songDuration.indexOf('M'))
//         formattedDuration = `${minutes}:00`
//     }

//     if (!songDuration.includes('M')) {
//         const seconds = songDuration.substring(2, songDuration.indexOf('S'))
//         const formattedSeconds = seconds.length < 2 ? `0${seconds}` : seconds
//         formattedDuration = `0:${formattedSeconds}`
//     }
//     if (songDuration.includes('S') && songDuration.includes('M')) {
//         formattedDuration = songDuration.substring(2, songDuration.indexOf('S'))
//         const [minutes, seconds] = formattedDuration.split('M')
//         const formattedSeconds = seconds.length < 2 ? `0${seconds}` : seconds

//         formattedDuration = `${minutes}:${formattedSeconds}`
//     }

//     return formattedDuration
// }

// function getSubstringBeforePipe(str) {
//     // בדוק אם המחרוזת מכילה את התו '|'
//     const pipeIndex = str.indexOf('|');

//     // אם אין את התו '|', החזר את המחרוזת כולה
//     if (pipeIndex === -1) {
//         return str;
//     }
//     // אחרת, החזר את החלק של המחרוזת עד ל-| הראשון (לא כולל)
//     return str.substring(0, pipeIndex);
// }




// async function addCarMsg(carId, txt) {
//     // Later, this is all done by the backend
//     const car = await getById(carId)

//     const msg = {
//         id: utilService.makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     car.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, car)

//     return msg
// }

// function getEmptyCar() {
//     return {
//         vendor: 'Susita-' + utilService.makeId(),
//         price: utilService.getRandomIntInclusive(1000, 9000),
//         msgs: []
//     }
// }





function _createStations() {
    let stations = utilService.loadFromStorage(STORAGE_KEY)
    if (!stations || !stations.length) {
        utilService.saveToStorage(STORAGE_KEY, initialStations)
    }
}


// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))

