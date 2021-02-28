import addGame from '../templates/addGame.jst';

var form = {
    init: function (bodyID, type) {
        this.type = type;
        switch (this.type) {
            case 'new-game':
                ipcRenderer.invoke('getGAndP').then(function (data) {
                    document.getElementById(bodyID).innerHTML = addGame({
                        genres: data.genres,
                        platforms: data.platforms,
                    });
                    form.setFormListeners();
                });

                break;
            default:
                break;
        }



    },
    setFormListeners: function () {
        document.getElementById('save').addEventListener('click', function () {
            form.sendData(form.getFormData());
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
        document.getElementById('Genre').addEventListener('keyup', function (e) {
            form.filterSelect(e, "genreList");
            var toggle = document.getElementById('genreToggle');
            if (!toggle.classList.contains('show') && e.target.value) {
                toggle.click();
            } else if (toggle.classList.contains('show') && !e.target.value) {
                toggle.click();
            }

        });
        document.getElementById('Platform').addEventListener('keyup', function (e) {
            form.filterSelect(e, "platformList");
            var toggle = document.getElementById('platformToggle');
            if (!toggle.classList.contains('show') && e.target.value) {
                toggle.click();
            } else if (toggle.classList.contains('show') && !e.target.value) {
                toggle.click();
            }
        });


    },
    filterSelect: function (e, listElement) {
        var options = Array.prototype.slice.call(document.querySelectorAll(`#${listElement} li.filterable`));
        var matches = Array.prototype.slice.call(document.querySelectorAll(`#${listElement} li[value^='${e.target.value.toLowerCase()}']`));
        for (var i = 0; i < options.length; i++) {
            if (matches.length && !matches.includes(options[i])) {
                options[i].style.display = 'none';
            } else {
                options[i].style.display = 'block';
            }
        }
    },
    getFormData: function () {
        var form = document.querySelector('form'),
            formData = new FormData(form),
            keys = [],
            item, rowID = (this.Type !== 'new-game') ? form.dataset.rowid : false;
        for (var key of formData.keys()) {
            keys.push(key);
        }
        formData.append("Genre", document.getElementById('Genre').value);
        formData.append("Platform", document.getElementById('Platform').value);
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
        //  ipcRenderer.invoke('add-rows', data);
    }
};
export default form;