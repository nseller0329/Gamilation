import gameItem from '../templates/gameItem.jst';


var form = {
    init: function (bodyID, data) {
        if (data) {
            this.itemID = data;
        }
        form.renderForm(bodyID);
    },
    renderForm: function (bodyID) {
        ipcRenderer.invoke('getLookups').then(function (lookups) {
            document.getElementById(bodyID).innerHTML = gameItem({
                genres: lookups.genres,
                platforms: lookups.platforms,
                statuses: lookups.statuses,
            });
            form.setFormListeners();
            if (form.itemID) {
                form.setFormData();
            }
        });

    },
    setFormData: function () {
        ipcRenderer.invoke('get-GameById', form.itemID).then(function (game) {

            for (var index in game) {
                if (document.getElementById(index)) {
                    document.getElementById(index).value = game[index];
                }
            }

        });
    },
    setFormListeners: function () {
        document.getElementById('gamesForm').addEventListener('submit', function (e) {
            e.preventDefault();
            if (e.target.checkValidity()) {
                form.sendData(form.getFormData());
            }
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
        var formElem = document.querySelector('form'),
            formData = new FormData(formElem),
            keys = [],
            item, rowID = (form.itemID) ? form.itemID : false;
        for (var key of formData.keys()) {
            keys.push(key);
        }
        formData.append("Genre", document.getElementById('Genre').value);
        formData.append("Platform", document.getElementById('Platform').value);
        item = {
            rows: [Object.fromEntries(formData)],
            keys: keys,
            form: formElem.getAttribute('name'),
            rowID: rowID
        };
        return item;
    },
    sendData: function (data) {

        if (data.rowID) {
            ipcRenderer.invoke('update-item', data);
        } else {
            ipcRenderer.invoke('add-rows', data);
        }

    }
};
export default form;