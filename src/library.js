import placeholder from './images/placeholder.png'

export function makePosterSrc(path, size) {
    return path ? `https://image.tmdb.org/t/p/${size}/${path}` : placeholder
}
