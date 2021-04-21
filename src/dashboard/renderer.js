import "./app.scss";
import "bootstrap";
import homeTab from "../templates/home.jst";
import myGamesCard from "../templates/mygames.jst";
import genreLegend from "../templates/genreLegend.jst";
import playList from "../templates/playlist.jst";
import notification from "../templates/notification.jst";
import icons from "../common/iconMap.js";
import dragNdrop from "./dragndrop.js";
import pagination from "./pagination.js";

var dashboard = {
  init: function () {
    dashboard.getHomeTab();
    dashboard.renderMyGames();
    dashboard.getPlaylist();
    dashboard.createIPCs();
  },
  getHomeTab: function () {
    document.getElementById("v-pills-home").innerHTML = homeTab();
  },
  getMyGames: function () {
    return ipcRenderer.invoke("get-all-rows", "games");
  },
  renderMyGames: function () {
    var genres,
      genreLabels = [],
      gamesList = [];
    document.getElementById("legend").innerHTML = genreLegend({
      icons: icons.genreIcons,
    });
    this.getMyGames().then(function (data) {
      document.getElementById("myGamesList").innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        genreLabels = [];
        if (data[i].Genre) {
          genres = data[i].Genre.split(",");
          for (var n = 0; n < genres.length; n++) {
            genreLabels.push(icons.genreIcons[genres[n]]);
          }
        }
        if (data[i].Platform) {
          data[i].Platform = data[i].Platform.split(",");
        }
        pagination.listID = "myGamesList";
        gamesList.push(
          myGamesCard({
            game: data[i],
            genreLabels: genreLabels,
            statusIcons: icons.statusIcons,
          })
        );
      }
      pagination.list = gamesList;
      pagination.setNumberOfPages();
      pagination.loadList();
      dashboard.addGameListListeners();
      dashboard.addPaginationListeners();
    });
  },
  addPaginationListeners: function () {
    document.getElementById("next").onclick = function () {
      pagination.nextPage();
      dashboard.addGameListListeners();
    };
    document.getElementById("previous").onclick = function () {
      pagination.previousPage();
      dashboard.addGameListListeners();
    };
    document.getElementById("first").onclick = function () {
      pagination.firstPage();
      dashboard.addGameListListeners();
    };
    document.getElementById("last").onclick = function () {
      pagination.lastPage();
      dashboard.addGameListListeners();
    };
  },
  addGameListListeners: function () {
    Array.prototype.slice
      .call(document.getElementsByClassName("editItem"))
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          ipcRenderer.send("show-modal", "edit-game", e.target.dataset.itemid);
        });
      });
    Array.prototype.slice
      .call(document.getElementsByClassName("mgUpdate"))
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          dashboard.updateStatus(e);
        });
      });
    document.getElementById("addGame").addEventListener("click", function () {
      ipcRenderer.send("show-modal", "new-game");
    });
  },
  getPlaylist: function () {
    this.getMyGames().then(function (games) {
      const statuses = ["Up Next", "Playing", "Completed", "Unfinished"];
      document.getElementById("playList").innerHTML = playList({
        statuses: statuses,
        games: games,
      });
      dashboard.addPlaylistListeners();
    });
  },
  addPlaylistListeners: function () {
    Array.prototype.slice
      .call(document.getElementsByClassName("playListCol"))
      .forEach(function (item) {
        item.addEventListener("drop", function (e) {
          dashboard.updateStatus(e, true);
        });
        item.addEventListener("dragover", function (e) {
          dragNdrop.allowDrop(e);
        });
      });
    Array.prototype.slice
      .call(document.getElementsByClassName("playListItem"))
      .forEach(function (item) {
        item.addEventListener("dragstart", function (e) {
          dragNdrop.drag(e);
        });
      });
    Array.prototype.slice
      .call(document.getElementsByClassName("plUpdate"))
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          dashboard.updateStatus(e);
        });
      });
  },
  updateStatus: function (e, drop) {
    var game = {
      id: drop ? dragNdrop.drop(e) : e.target.dataset.itemid,
      data: {
        Status: e.target.dataset.status,
      },
    };
    ipcRenderer.invoke("updateGameStatus", game).then(function () {
      dashboard.renderMyGames();
      dashboard.getPlaylist();
    });
  },
  createIPCs: function () {
    ipcRenderer.on("notification", function (event, type, message) {
      document.getElementById("notificationCenter").insertAdjacentHTML(
        "beforeend",
        notification({
          message: message,
          type: type,
        })
      );
    });
    ipcRenderer.on("refresh", function () {
      dashboard.renderMyGames();
      dashboard.getPlaylist();
    });
  },
};

dashboard.init();
