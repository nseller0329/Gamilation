import './app.scss';
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesTab from "../templates/mygames.jst";
import placeholder from '../images/placeholder.png';
import notification from '../templates/notification.jst';
var dashboard = {
    init: function () {
        document.getElementById('v-pills-home').innerHTML = homeTab();
        ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {
            document.getElementById('v-pills-mygames').innerHTML = myGamesTab({
                games: data,
                coverImg: placeholder
            });
        });
        //    ipcRenderer.send('show-modal', 'new-game');
        dashboard.createIPCs();
    },
    createIPCs: function () {
        ipcRenderer.on('notification', function (event, type, message) {
            document.getElementById('notificationCenter').insertAdjacentHTML('beforeend', notification({
                message: message,
                type: type
            }));
        });
        ipcRenderer.on('refresh', function () {
            console.log('REFRESH ME');
        });
    }
};

dashboard.init();