import addGame from '../templates/addGame.jst';
import notification from '../templates/notification.jst';
import '../dashboard/app.scss';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const modalType = urlParams.get('type');

window.closeModal = function () {
    ipcRenderer.send('refresh-main');
    window.close();
};

var modal = {
    init: function () {
        switch (modalType) {
            case 'new-game':
                document.getElementById('modal-body').innerHTML = addGame({
                    rowID: ""
                });
        }
    },

};
modal.init();