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
        document.getElementById('gamesForm').addEventListener('submit', function (e) {
            e.preventDefault();
            if (f.checkValidity()) {
                form.sendData(form.getFormData());
            }
        });
        document.getElementById('Name').addEventListener('keyup', function (e) {
            form.searchForGameWithApi(e);
        });
        document.getElementById('Genre').addEventListener('keyup', function (e) {
            form.filterSelect(e, "genreList");
            form.toggleDropdown(e, 'genreToggle');
        });
        document.getElementById('Platform').addEventListener('keyup', function (e) {
            form.filterSelect(e, "platformList");
            form.toggleDropdown(e, 'platformToggle');
        });
        Array.prototype.slice.call(document.getElementsByClassName('dropdown-item')).forEach(function (item) {
            item.addEventListener('click', function (e) {
                form.setSelectValue(e.target.dataset.inputref, e.target.getAttribute('value'), e.target.parentNode.id);
            });
        });


    },

    searchForGameWithApi: function (e) {
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
    },
    toggleDropdown: function (e, toggleElement) {
        var toggle = document.getElementById(toggleElement);
        if (!toggle.classList.contains('show') && e.target.value) {
            toggle.click();
        } else if (toggle.classList.contains('show') && !e.target.value) {
            toggle.click();
        }
    },
    filterSelect: function (e, listElement) {
        var options = Array.prototype.slice.call(document.querySelectorAll(`#${listElement} li.filterable`)),
            values = e.target.value.split(',');
        var matches = Array.prototype.slice.call(document.querySelectorAll(`#${listElement} li[data-searchval^='${values[values.length-1].toLowerCase()}']`));
        for (var i = 0; i < options.length; i++) {
            if (matches.length && !matches.includes(options[i])) {
                options[i].style.display = 'none';
            } else {
                options[i].style.display = 'block';
            }
        }
    },
    setSelectValue: function (parent, value, listElement) {
        var parentElem = document.getElementById(parent),
            matchesVals = [],
            matches = document.querySelectorAll(`#${listElement} li`),
            parentElemVals = parentElem.value.split(','),
            newVals = [];
        parentElemVals.push(value);
        for (var i = 0; i < matches.length; i++) {
            matchesVals.push(matches[i].dataset.searchval);
        }
        for (var n = 0; n < parentElemVals.length; n++) {
            if (matchesVals.includes(parentElemVals[n].toLowerCase()) && !newVals.includes(parentElemVals[n])) {
                newVals.push(parentElemVals[n]);
            }
        }
        parentElem.value = newVals;
        parentElem.focus();
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