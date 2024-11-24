
const { DEV, VITE_LOCAL } = import.meta.env



import { stationService as remote } from './station.service.remote.js'
import { stationService as local } from './station.service.local.js'

import { getLoggedInUser } from '../../store/actions/user.actions.js'



const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY




function createEmptyStation() {
    return {
        // _id: "",
        name: "My Playlist",
        type: "normal",
        description: '',
        imgUrl: 'https://www.greencode.co.il/wp-content/uploads/2024/07/station-thumb-default.jpg',
        tags: [],
        createdBy: {},
        savedBy: [],
        songs: []
    }
}







function isSongSavedAtStation(station, songId) {
    return station.songs.some(song => song.id === songId)
}

function getUserStations(stations) {
    return stations.filter(station => station.createdBy.id === getLoggedInUser()._id)
}

function isSongSavedAtSomeStation(stations, songId) {
    let isSongSavedAtSomeStation = false
    stations.forEach(station => {
        if (station.songs.some(song => song.id === songId)) {
            isSongSavedAtSomeStation = true
        }
    })
    return isSongSavedAtSomeStation
}

async function getSongsFromYoutube(userInput, location = '') {
    const searchTerm = userInput
    let maxResults = 4
    if (location === "search-at-station") {
        maxResults = 15
    }
    let res = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`)
    let data = await res.json()
    let songs = data.items
    const songIds = _getSongIds(songs)
    const songIdsStr = songIds.join(',')
    res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${songIdsStr}&key=${API_KEY}`)
    data = await res.json()
    const songsAdditionalInfo = data.items
    _addDurationToSongs(songs, songsAdditionalInfo)
    songs = songs.filter(song => song.duration)
    songs = _formatSongs(songs)
    return songs
    // return searchRes[0].items.slice(0,4)
}


function _getSongIds(songs) {
    const songIds = []
    songs.forEach(song => {
        songIds.push(song.id.videoId)
    })

    return songIds
}

function _addDurationToSongs(songs, songsAdditionalInfo) {
    songs.forEach(song => {
        const songAdditionalInfo = songsAdditionalInfo.find(songAdditionalInfo => songAdditionalInfo.id === song.id.videoId)
        if (songAdditionalInfo) {
            song.duration = songAdditionalInfo.contentDetails.duration
        }
    })
}


function _formatSongs(songs) {
    const formattedSongs = []
    songs.forEach(song => {
        formattedSongs.push(_formatSong(song))
    });

    return formattedSongs
}

function _formatSong(song) {
    return {
        id: song.id.videoId,
        title: getSubstringBeforePipe(song.snippet.title),
        //title: song.snippet.title,
        channelTitle: song.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${song.id.videoId}`,
        imgUrl: song.snippet.thumbnails.default.url,
        addedBy: {},
        addedAt: null,
        duration: _formatSongDuration(song.duration)
    }
}

function _formatSongDuration(songDuration) {
    // Examples of durations: 'PT4M' | 'PT35S' | 'PT4M35S'

    let formattedDuration = null
    if (!songDuration.includes('S')) {
        const minutes = songDuration.substring(2, songDuration.indexOf('M'))
        formattedDuration = `${minutes}:00`
    }
    if (!songDuration.includes('M')) {
        const seconds = songDuration.substring(2, songDuration.indexOf('S'))
        const formattedSeconds = seconds.length < 2 ? `0${seconds}` : seconds
        formattedDuration = `0:${formattedSeconds}`
    }
    if (songDuration.includes('S') && songDuration.includes('M')) {
        formattedDuration = songDuration.substring(2, songDuration.indexOf('S'))
        const [minutes, seconds] = formattedDuration.split('M')
        const formattedSeconds = seconds.length < 2 ? `0${seconds}` : seconds

        formattedDuration = `${minutes}:${formattedSeconds}`
    }

    return formattedDuration
}

function getSubstringBeforePipe(str) {
    // בדוק אם המחרוזת מכילה את התו '|'
    const pipeIndex = str.indexOf('|');

    // אם אין את התו '|', החזר את המחרוזת כולה
    if (pipeIndex === -1) {
        return str;
    }
    // אחרת, החזר את החלק של המחרוזת עד ל-| הראשון (לא כולל)
    return str.substring(0, pipeIndex);
}






// function getDefaultFilter() {
//     return { pageIdx: '', txt: '', severity: '' , labels: '', sortBy: '', sortDir: ''}
// }


// function getDefaultFilterSrcPrms(searchParams) {
//     return {
//         //pageIdx: searchParams.get('pageIdx') || '',
//         txt: searchParams.get('txt') || '',
//         severity: searchParams.get('severity') || '',
//         labels:  searchParams.get('labels') || '',
//         sortBy: searchParams.get('sortBy') || '',
//         sortDir: searchParams.get('sortDir') || '',
//         pageIdx: searchParams.get('pageIdx') ? +searchParams.get('pageIdx') : undefined
//     }
// }


const service = VITE_LOCAL === 'true' ? local : remote

export const stationService = {
    createEmptyStation,
    // getDemoStations, 
    isSongSavedAtStation,
    getUserStations,
    isSongSavedAtSomeStation,
    getSongsFromYoutube,
    getLoggedInUser, ...service
}

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
