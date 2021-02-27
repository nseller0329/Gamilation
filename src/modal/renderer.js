import notification from '../templates/notification.jst';
import '../dashboard/app.scss';
import form from './form';

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
                form.init('modal-body', modalType);
                break;
            default:
                break;
        }
        modal.createIPCs();
    },

    createIPCs: function () {
        ipcRenderer.on('notification', function (event, type, message) {
            document.getElementById('notificationCenter').insertAdjacentHTML('beforeend', notification({
                message: message,
                type: type
            }));
        });
    },

};
modal.init();