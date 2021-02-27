import addGame from '../templates/addGame.jst';
import notification from '../templates/notification.jst';
import '../dashboard/app.scss';
import rawgApi from '../db/rawg';



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
                document.getElementById('modal-body').innerHTML = addGame();
                modal.setFormListeners();
                break;
            default:
                break;
        }
        modal.createIPCs();
    },
    setFormListeners: function () {
        console.log(document.getElementById('save'))
        document.getElementById('save').addEventListener('click', function () {
            console.log('clicked')
            modal.sendData(modal.getFormData());
        });
    },
    getFormData: function () {
        var form = document.querySelector('form'),
            formData = new FormData(form),
            keys = [],
            item, rowID = (modalType !== 'new-game') ? form.dataset.rowid : false;
        for (var key of formData.keys()) {
            keys.push(key);
        }
        item = {
            rows: [Object.fromEntries(formData)],
            keys: keys,
            form: form.getAttribute('name'),
            rowID: rowID
        };
        return item;
    },
    sendData: function (data) {
        console.log(data);
        ipcRenderer.invoke('add-rows', data);
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