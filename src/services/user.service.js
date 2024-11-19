import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
// const STORAGE_KEY_LOGEDON_USER = 'logedon_user'

export const userService = {
    login,
    logout,
    signup,
    getLoggedInUser,
    getUsers,
    getById,
    remove,
    update,
    getEmptyCredentials
}

window.userService = userService

async function getUsers() {
    try {
        const users = await httpService.get(`user`)
        return users
    } catch (error) {
        console.log("Having issues with getting users", error);
        throw error
    }
}

async function getById(userId) {
    try {
        const user = await httpService.get(`user/${userId}`)
        return user
    } catch (error) {
        console.log("Having issues with getting user", error);
        throw error
    }
}

async function remove(userId) {
    try {
        const data = await httpService.delete(`user/${userId}`)
        return data
    } catch (error) {
        console.log("Having issues with removing user", error);
        throw error
    }
}

async function update({ _id, fullname }) {
    try {
        const user = await httpService.put(`user/${_id}`, { _id, fullname })

        // When admin updates other user's details, do not update loggedinUser
        if (getLoggedInUser()._id === user._id) _saveLocalUser(user)
        return user
    } catch (error) {
        console.log("Having issues with updating user", error);
        throw error
    }
}

async function login(credentials) {
    try {
        const user = await httpService.post('auth/login', credentials)
        _saveLocalUser(user)
        return user
    } catch (error) {
        console.log("Cannot login", error);
        throw error
    }
}

async function signup(credentials) {
    try {
        const user = await httpService.post('auth/signup', credentials)
        _saveLocalUser(user)
        return user
    } catch (error) {
        console.log("Cannot sign up", error);
        throw error
    }

    // if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
}

async function logout() {
    try {
        await httpService.post('auth/logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (error) {
        console.log("Cannot logout", error);
        throw error
    }
}

function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyCredentials() {
    return (
        {
            fullname: "",
            username: "",
            password: "",
            email: ""
        }
    )
}


// function getLoggedInUser() {
//     return utilService.loadFromStorage(STORAGE_KEY_LOGEDON_USER)
// }

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()



