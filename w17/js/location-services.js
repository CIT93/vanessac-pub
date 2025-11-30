export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            resolve ({
                latitude: position.coords.latitude,     // some code was fixed by Dev Tools
                longitude: position.coords.longitude
            });
        }, (error) => {
            let errorMessage;
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Permission denied. Please enable location services for this site.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "Getting your location timed out.";
                    break
                default:
                    errorMessage = "An unknown error has occurred while getting location";
                    break; 
            }
            reject(new Error(errorMessage));
        });
    });
};
