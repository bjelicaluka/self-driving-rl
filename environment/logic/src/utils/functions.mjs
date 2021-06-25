export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
} 

export function getRandomArbitraryNumber(min, max) {
    return Math.random() * (max - min) + min;
}