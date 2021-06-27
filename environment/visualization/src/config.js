let windowWidth = window.innerWidth;
if(windowWidth <= 400) {
    windowWidth *= 0.9;
} else if(windowWidth >= 400 && windowWidth <= 765) {
    windowWidth *= 0.7;
} else {
    windowWidth *= 0.45;
}

export let CONFIG = {
    WS_API_URL: 'http://localhost:4001'
}

export function setConfig(config) {
    CONFIG = {...CONFIG, ...config};
}