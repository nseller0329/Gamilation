const key = 'key=4d01c0acbee14d8582c27cf3d92f7d00';
const fetch = require('cross-fetch');

const rawgApi = {
    searchGames: function (searchParam) {
        return fetch(`https://api.rawg.io/api/games?${key}&search='${searchParam}'&search_exact=true`, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        });
    },
    getGameById: function (gameID) {
        return fetch(`https://api.rawg.io/api/games/${gameID}?${key}`, {
            method: 'GET'
        }).then(function (response) {
            return response.json();
        });
    }
};


/*rawgApi.searchGames('Final Fantasy').then(function (data) {
    console.log(data);
}); */

rawgApi.getGameById('1').then(function (data) {
    console.log(data);
});