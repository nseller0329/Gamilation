import './app.scss';
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesCard from "../templates/mygames.jst";
import notification from '../templates/notification.jst';
import icons from '../common/iconMap.js';


var dashboard = {
    init: function () {
        document.getElementById('v-pills-home').innerHTML = homeTab();
        dashboard.getMyGames();
        dashboard.createIPCs();
        dashboard.setEventListeners();
    },
    getMyGames: function () {
        document.getElementById('myGamesList').innerHTML = "";
        ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {

            for (var i = 0; i < data.length; i++) {
                var genres = data[i].Genre.split(','),
                    genreLabels = [];
                for (var n = 0; n < genres.length; n++) {
                    genreLabels.push(icons.genreIcons[genres[n].toLowerCase().replace(' ', "")]);
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
            dashboard.getMyGames();
        });
    },
    setEventListeners: function () {
        document.getElementById('addGame').addEventListener('click', function () {
            ipcRenderer.send('show-modal', 'new-game');
        });

    }
};

dashboard.init();