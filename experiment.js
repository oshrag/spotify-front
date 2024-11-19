import { log } from 'console';
import fs, { write } from 'fs'

const API_KEY = 'AIzaSyCUE7BdmEO9uF_gWcV5yY5O3eqyINxdavo'
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
function getAllSongIds(songs) {
    const songIds = []
    songs.forEach(song => {
        songIds.push(song.contentDetails.videoId)
    });
    return songIds
}

function _addDurationToSongs(songs, songsAdditionalInfo) {
    songs.forEach(song => {
        const songAdditionalInfo = songsAdditionalInfo.find(songAdditionalInfo => songAdditionalInfo.id === song.contentDetails.videoId)
        if (songAdditionalInfo) {
            song.duration = songAdditionalInfo.contentDetails.duration
        }
    })
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

function formatSong(song) {
    return {
        id: song.contentDetails.videoId,
        title: getSubstringBeforePipe(song.snippet.title),
        //title: song.snippet.title,
        channelTitle: song.snippet.videoOwnerChannelTitle,
        url: `https://youtube.com/watch?v=${song.contentDetails.videoId}`,
        imgUrl: song.snippet.thumbnails.default.url,
        addedBy: {},
        addedAt: Date.now(),
        duration: _formatSongDuration(song.duration)
    }
}

function _formatSongDuration(songDuration) {
    //'PT4M'
    // 'PT35S'
    // 'PT4M35S'
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

function formatSongs(songs) {
    const formattedSongs = []
    songs.forEach(song => {
        formattedSongs.push(formatSong(song))
    });

    return formattedSongs
}

// let songs = loadJSON('./data/temp-songs.json')
// const songIds = getAllSongIds(songs)
// const songIdsStr = songIds.join(',')
// console.log(songIdsStr);

// let songs = loadJSON('./data/temp-songs.json')
// const songsAdditionalInfo = loadJSON('./data/temp-songs-additional-info.json')
// _addDurationToSongs(songs, songsAdditionalInfo)
// songs = songs.filter(song => song.duration)
// songs = formatSongs(songs)
// console.log(songs);


// fs.writeFileSync('./data/final-songs.json', JSON.stringify(songs, null, 4))










// async function getSongsFromYoutube(songIdsStr) {
//     const songIds = _getSongIds(songs)
//     res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${}&key=${API_KEY}`)
//     data = await res.json()
//     const songsAdditionalInfo = data.items
//     _addDurationToSongs(songs, songsAdditionalInfo)
//     return songs
//     // return searchRes[0].items.slice(0,4)
// }


// const user = { id: "123", name: "Eitan" }
// const userAdmin = { id: "456", name: "Daniel" }

console.log(parseInt("sdfsdf"));
