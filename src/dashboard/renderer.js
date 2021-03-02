import './app.scss';
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesCard from "../templates/mygames.jst";
import notification from '../templates/notification.jst';
import icons from '../common/iconMap.js';
import images from '../common/images.js';

var dashboard = {
    init: function () {
        document.getElementById('v-pills-home').innerHTML = homeTab();
        ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {

            for (var i = 0; i < data.length; i++) {
                var genres = data[i].Genre.split(','),
                    genreLabels = [],
                    imgPath = '';
                for (var n = 0; n < genres.length; n++) {
                    imgPath = images[genres[n].toLowerCase()];
                    console.log(imgPath);
                    genreLabels.push(imgPath);
                }

                document.getElementById('myGamesList').insertAdjacentHTML('beforeend', myGamesCard({
                    game: data[i],
                    genreLabels: genreLabels,
                    statusIcons: icons.statusIcons
                }));
            }
        });
        dashboard.createIPCs();
        dashboard.setEventListeners();


    },
    createIPCs: function () {
        ipcRenderer.on('notification', function (event, type, message) {
            document.getElementById('notificationCenter').insertAdjacentHTML('beforeend', notification({
                message: message,
                type: type
            }));
        });
        ipcRenderer.on('refresh', function () {
            ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {
                document.getElementById('myGamesList').innerHTML = myGamesTab({
                    games: data,
                    statusIcons: statusIcons
                });
            });
        });
    },
    setEventListeners: function () {
        document.getElementById('addGame').addEventListener('click', function () {
            ipcRenderer.send('show-modal', 'new-game');
        });
    }
};

dashboard.init();