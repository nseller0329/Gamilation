import './app.scss';
import "@fortawesome/fontawesome-free/js/all";
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesTab from "../templates/mygames.jst";
import notification from '../templates/notification.jst';
import icons from '../common/iconMap.js';

var dashboard = {
    init: function () {
        console.log(icons)
        document.getElementById('v-pills-home').innerHTML = homeTab();
        ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {
            document.getElementById('myGamesList').innerHTML = myGamesTab({
                games: data,
                statusIcons: icons.statusIcons
            });

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