export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    debounce,
    randomPastTime,
    saveToStorage,
    loadFromStorage,
    formatDate,
    getRandomExcludingY,
    createGradientColors,
    convertFormattedTimeToSeconds,
    formatTime,
    getFirstChar,
    darkenColor
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}


function formatDate(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);

    const msPerMinute = 60 * 1000;
    const msPerHour = 60 * 60 * 1000;
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerWeek = 7 * msPerDay;


    const timeDifference = now - date;
    const minutesDiffrence = Math.floor(timeDifference / msPerMinute);
    const hoursDifference = Math.floor(timeDifference / msPerHour);
    const daysDifference = Math.floor(timeDifference / msPerDay);
    const weeksDifference = Math.floor(timeDifference / msPerWeek);

    if (minutesDiffrence < 60) {
        return 'just now'
    } else if (hoursDifference < 24) {
        return `${hoursDifference} hours ago`;
    } else if (daysDifference < 7) {
        return `${daysDifference} days ago`;
    } else if (daysDifference < 30) {
        return `${weeksDifference} weeks ago`;
    } else {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedDateWithoutDot = formattedDate.replace('.', '');
        return formattedDateWithoutDot;
    }
}

function getRandomExcludingY(x, y) {
    if (x === 0) throw new Error("x must be greater than 0");

    let randomNum;
    do {
        randomNum = Math.floor(Math.random() * (x + 1));
    } while (randomNum === y);

    return randomNum;
}

function darkenColor(color, percent) {

    color = color.replace(/\s+/g, '');


    const [r, g, b, a] = color.match(/\d+/g).map(Number);
    const darken = value => Math.max(0, value - Math.floor((value * percent) / 100));

    return `rgba(${darken(r)}, ${darken(g)}, ${darken(b)}, ${a})`;
}

function convertFormattedTimeToSeconds(formattedTime) {
    // Example of formatted time - 3:42
    formattedTime = formattedTime.split(":")
    const minutes = parseInt(formattedTime[0])
    const seconds = parseInt(formattedTime[1])
    return (minutes * 60) + seconds
}

function formatTime(timeInSeconds = 0) {
    if (typeof timeInSeconds !== "number" || Number.isNaN(timeInSeconds)) {
        timeInSeconds = 0
    }
    const minutes = parseInt(timeInSeconds / 60, 10)
    const seconds = timeInSeconds % 60
    const formattedTime = `${minutes}:${seconds > 9 ? seconds : '0' + seconds}`

    return formattedTime
}

function createGradientColors(color) {

    //console.log('color:', color)
    const darkenedBackground_50 = darkenColor(color, 50);
    const gradientBackground1 = `linear-gradient(${color}, ${darkenedBackground_50})`;

    const darkenedBackground_52 = darkenColor(color, 52);
    //darkenedBackground_100 = darkenColor(color, 100);

    const darkenedBackground_100 = 'rgba(18,18,18,1)';
    const gradientBackground2 = `linear-gradient( ${darkenedBackground_52}, ${darkenedBackground_100})`;

    return {
        style1: { background: gradientBackground1 },
        style2: { background: gradientBackground2 },
        darken: darkenedBackground_52
    };
}


function getFirstChar(str) {
    if (str.length === 0) return '';
    return str.charAt(0).toUpperCase();
}
