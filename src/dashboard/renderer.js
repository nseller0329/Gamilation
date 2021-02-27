import './app.scss';
import 'bootstrap';
import homeTab from '../templates/home.jst';
import myGamesTab from "../templates/mygames.jst";
import placeholder from '../images/placeholder.png';



document.getElementById('v-pills-home').innerHTML = homeTab();
ipcRenderer.invoke('get-all-rows', 'games').then(function (data) {
    document.getElementById('v-pills-mygames').innerHTML = myGamesTab({
        games: data,
        coverImg: placeholder
    });
});
ipcRenderer.send('show-modal', 'new-game');
ipcRenderer.on('refresh', function () {
    console.log('REFRESH ME');
});

console.log('👋 This message is being logged by "renderer.js", included via webpack');