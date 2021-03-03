import './app.scss';
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesCard from "../templates/mygames.jst";
import playList from '../templates/playlist.jst';
import notification from '../templates/notification.jst';
import icons from '../common/iconMap.js';
import dragNdrop from "./dragndrop.js";

var dashboard = {
    init: function () {
        document.getElementById('v-pills-home').innerHTML = homeTab();
        dashboard.renderMyGames();
        dashboard.getPlaylist();
        dashboard.createIPCs();

    },
    getMyGames: function () {
        return ipcRenderer.invoke('get-all-rows', 'games');
    },
    renderMyGames: function (data) {
        this.getMyGames().then(function (data) {
            document.getElementById('myGamesList').innerHTML = "";
            for (var i = 0; i < data.length; i++) {
                var genres = data[i].Genre.split(','),
                    genreLabels = [];
                for (var n = 0; n < genres.length; n++) {
                    genreLabels.push(icons.genreIcons[genres[n]]);
                }
                document.getElementById('myGamesList').insertAdjacentHTML('beforeend', myGamesCard({
                    game: data[i],
                    genreLabels: genreLabels,
                    statusIcons: icons.statusIcons
                }));
            }
            Array.prototype.slice.call(document.getElementsByClassName('editItem')).forEach(function (item) {
                item.addEventListener('click', function (e) {
                    ipcRenderer.send('show-modal', 'edit-game', e.target.dataset.itemid);
                });
            });
            document.getElementById('addGame').addEventListener('click', function () {
                ipcRenderer.send('show-modal', 'new-game');
            });
        });
    },
    getPlaylist: function () {
        this.getMyGames().then(function (games) {
            const statuses = ['Up Next', 'Playing'];
            document.getElementById('playList').innerHTML = playList({
                statuses: statuses,
                games: games
            });
            Array.prototype.slice.call(document.getElementsByClassName('playListCol')).forEach(function (item) {
                item.addEventListener('drop', function (e) {
                    var game = {
                        id: dragNdrop.drop(e),
                        status: {
                            Status: e.target.dataset.status
                        }
                    };
                    ipcRenderer.invoke('updateGameStatus', game);
                    dashboard.renderMyGames();

                });
                item.addEventListener('dragover', function (e) {
                    dragNdrop.allowDrop(e);
                });
            });
            Array.prototype.slice.call(document.getElementsByClassName('playListItem')).forEach(function (item) {
                item.addEventListener('dragstart', function (e) {
                    dragNdrop.drag(e);
                });
            });
        });


    },
    createIPCs: function () {
        ipcRenderer.on('notification', function (event, type, message) {
            document.getElementById('notificationCenter').insertAdjacentHTML('beforeend', notification({
                message: message,
                type: type
            }));
        });
        ipcRenderer.on('refresh', function () {
            dashboard.renderMyGames();
        });
    },
};

dashboard.init();