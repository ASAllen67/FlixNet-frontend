import {backend_api} from "./constants"
import {default as http} from 'superagent'


export function healthCheck() {
    return http.get(backend_api)
}

export function getUser() {
    return http
    .get(makeUrl('users/current'))
    .set(makeHeaders())
}

export function createUser(credentials) {
    return http
    .post(makeUrl('users'))
    .set(makeHeaders())
    .send(credentials)
}

export function createSession(credentials) {
    return http
    .post(makeUrl('sessions'))
    .set(makeHeaders())
    .send(credentials)
}

export function createEntry(type, id, entry) {
    return http
    .post(makeUrl('entries', type))
    .set(makeHeaders())
    .send({id, entry})
}

export function deleteEntry(type, id) {
    return http
    .delete(makeUrl('entries', type, id))
    .set(makeHeaders())
}

export function searchTMDB(page, query) {
    return http
    .get(makeUrl('sessions/tmdb-search'))
    .set(makeHeaders())
    .query({query, page})
    .then(res => res.body)
}

function makeUrl(...path) {
    path.unshift(backend_api)
    return path.join('/')
}

function makeHeaders() {
    const token = makeToken()
    const common = {
        accept: 'application/json',
        'Content-Type': 'application/json',
    }

    if (token) {
        common['Authorization'] = `Bearer ${token}`
    }

    return common
}

function makeToken() {
    return localStorage.token
}
