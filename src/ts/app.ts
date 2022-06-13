import { init } from "./game";

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                './sw.js',
                {
                    scope: './',
                }
            );
            if (registration.active) {
                console.log('service worker active!');
            }
        } catch (error) {
            console.error((`registration failed with ${error}`));
        }
    }
}

registerServiceWorker();

init();