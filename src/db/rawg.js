const key = process.env.RAWG_KEY;
const fetch = require('cross-fetch');
const rawgApi = {
    searchGames: function (searchParam) {
        return fetch(`https://api.rawg.io/api/games?${key}&search='${searchParam}'&search_precise=true`, {
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
    },
};

module.exports = rawgApi;