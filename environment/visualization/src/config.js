let windowWidth = window.innerWidth;
if(windowWidth <= 400) {
    windowWidth *= 0.9;
} else if(windowWidth >= 400 && windowWidth <= 765) {
    windowWidth *= 0.7;
} else {
    windowWidth *= 0.45;
}

const API_URL = window._env_.SAME_HOST === 'true' ? 
  `${window._env_.API_PROTOCOL}://${window.location.hostname}:${window._env_.API_PORT}${window._env_.API_PATH}` 
  :
  `${window._env_.API_PROTOCOL}://${window._env_.API_HOSTNAME}:${window._env_.API_PORT}${window._env_.API_PATH}`

export let CONFIG = {
    WS_API_URL: API_URL
}

export function setConfig(config) {
    CONFIG = {...CONFIG, ...config};
}