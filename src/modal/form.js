import addGame from '../templates/addGame.jst';
var form = {
    init: function (bodyID, type) {
        switch (type) {
            case 'new-game':

                document.getElementById(bodyID).innerHTML = addGame({
                    genres: '',
                    platforms: '',
                });
                break;
            default:
                break;
        }

        form.setFormListeners();

    },
    setFormListeners: function () {
        document.getElementById('save').addEventListener('click', function () {
            modal.sendData(modal.getFormData());
        });
        document.getElementById('Name').addEventListener('keyup', function (e) {
            var val = e.target.value,
                datalist = document.getElementById('gamesDataList'),
                maxResults = 5;
            if (val.length > 4) {
                ipcRenderer.invoke('api-search', val).then(function (resp) {
                    datalist.innerHTML = '';
                    for (var i = 0; i < resp.results.length; i++) {
                        if (i < maxResults) {
                            datalist.insertAdjacentHTML('afterbegin', '<option data-gameid="' + resp.results[i].id + '" value = "' + resp.results[i].name + '" > ');
                        }
                    } //show top 5 in suggestions
                });
            }
        });
        document.getElementById('Name').addEventListener('input', function (e) {
            var match = document.querySelector(`#gamesDataList option[value='${e.target.value}'`);
            if (match) {
                console.log('match!');
                console.log(match.dataset.gameid);
            }

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
    }
};
export default form;