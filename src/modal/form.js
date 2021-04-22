import gameItem from "../templates/gameItem.jst";
import choice from "../templates/gameItemChoice.jst";

var form = {
  init: function (bodyID, data) {
    if (data) {
      this.itemID = data;
    }
    form.renderForm(bodyID);
  },
  renderForm: function (bodyID) {
    ipcRenderer.invoke("getLookups").then(function (lookups) {
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
    var multivals;
    ipcRenderer.invoke("get-GameById", form.itemID).then(function (game) {
      for (var index in game) {
        if (document.getElementById(index)) {
          if (index === "Genre" || index === "Platform") {
            multivals = game[index].split(",");
            document.getElementById(index + "_Hidden").value = game[index];
            for (var i = 0; i < multivals.length; i++) {
              document.getElementById(index + "_Choices").innerHTML += choice({
                parent: index,
                value: multivals[i],
              });
            }
          } else {
            document.getElementById(index).value = game[index];
          }
        }
      }
      form.setChoiceListener();
    });
  },
  setChoiceListener: function () {
    Array.prototype.slice
      .call(document.getElementsByClassName("remove-select"))
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          form.removeSelectValue(
            e.target.parentNode.id,
            e.target.parentNode.dataset.value
          );
        });
      });
  },
  setFormListeners: function () {
    document
      .getElementById("gamesForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        if (e.target.checkValidity()) {
          form.sendData(form.getFormData());
        }
      });
    document.getElementById("Genre").addEventListener("keyup", function (e) {
      form.filterSelect(e, "genreList");
      form.toggleDropdown(e, "genreToggle");
    });
    document.getElementById("Platform").addEventListener("keyup", function (e) {
      form.filterSelect(e, "platformList");
      form.toggleDropdown(e, "platformToggle");
    });
    Array.prototype.slice
      .call(document.getElementsByClassName("dropdown-item"))
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          form.setSelectValue(
            e.target.dataset.inputref,
            e.target.getAttribute("value"),
            e.target.parentNode.id
          );
        });
      });
  },

  toggleDropdown: function (e, toggleElement) {
    var toggle = document.getElementById(toggleElement);
    if (!toggle.classList.contains("show") && e.target.value) {
      toggle.click();
    } else if (toggle.classList.contains("show") && !e.target.value) {
      toggle.click();
    }
  },
  filterSelect: function (e, listElement) {
    var options = Array.prototype.slice.call(
        document.querySelectorAll(`#${listElement} a.filterable`)
      ),
      values = e.target.value.split(",");

    var matches = Array.prototype.slice.call(
      document.querySelectorAll(
        `#${listElement} a[data-searchval*='${values[
          values.length - 1
        ].toLowerCase()}']`
      )
    );
    for (var i = 0; i < options.length; i++) {
      if (matches.length && !matches.includes(options[i])) {
        options[i].style.display = "none";
      } else {
        options[i].style.display = "block";
      }
    }
  },
  setSelectValue: function (parent, value, listElement) {
    var parentElem = document.getElementById(parent + "_Hidden"),
      matchesVals = [],
      matches = document.querySelectorAll(`#${listElement} a`),
      parentElemVals = parentElem.value.split(","),
      newVals = [];
    parentElemVals.push(value);
    for (var i = 0; i < matches.length; i++) {
      matchesVals.push(matches[i].dataset.searchval);
    }
    for (var n = 0; n < parentElemVals.length; n++) {
      if (
        matchesVals.includes(parentElemVals[n].toLowerCase()) &&
        !newVals.includes(parentElemVals[n])
      ) {
        newVals.push(parentElemVals[n]);
      }
    }
    parentElem.value = newVals;
    document.getElementById(parent + "_Choices").innerHTML = "";
    for (var i = 0; i < newVals.length; i++) {
      document.getElementById(parent + "_Choices").insertAdjacentHTML(
        "beforeend",
        choice({
          parent: parent,
          value: newVals[i],
        })
      );
    }
    document.getElementById(parent).value = "";
    document.getElementById(parent).focus();
    form.setChoiceListener();
  },
  removeSelectValue: function (element, value) {
    var hiddenElem = document.getElementById(element.split("_")[0] + "_Hidden"),
      hiddenElemVals = hiddenElem.value.split(",");
    for (var i = 0; i < hiddenElemVals.length; i++) {
      if (hiddenElemVals[i] === value) {
        hiddenElemVals.splice(i, 1);
      }
    }
    hiddenElem.value = hiddenElemVals;
    document.getElementById(element).remove();
  },
  getFormData: function () {
    var formElem = document.querySelector("form"),
      formData = new FormData(formElem),
      keys = [],
      item,
      rowID = form.itemID ? form.itemID : false;
    for (var key of formData.keys()) {
      keys.push(key);
    }
    item = {
      rows: [Object.fromEntries(formData)],
      keys: keys,
      form: formElem.getAttribute("name"),
      rowID: rowID,
    };
    return item;
  },
  sendData: function (data) {
    if (data.rowID) {
      ipcRenderer.invoke("update-item", data);
    } else {
      ipcRenderer.invoke("add-rows", data);
    }
  },
};
export default form;
