var pagination = {
  pageLength: 20,
  currentPage: 1,
  numberOfPages: 1,
  list: [],
  pageList: [],
  listID: "",
  setNumberOfPages: function () {
    pagination.numberOfPages = Math.ceil(
      pagination.list.length / pagination.pageLength
    );
  },
  firstPage: function () {
    pagination.currentPage = 1;
    pagination.loadList();
  },
  nextPage: function () {
    pagination.currentPage++;
    pagination.loadList();
  },
  previousPage: function () {
    pagination.currentPage--;
    pagination.loadList();
  },
  lastPage: function () {
    pagination.currentPage = pagination.numberOfPages;
    pagination.loadList();
  },
  loadList: function () {
    var begin = (pagination.currentPage - 1) * pagination.pageLength,
      end = begin + pagination.pageLength;

    pagination.pageList = pagination.list.slice(begin, end);
    pagination.drawList(); // draws out our data
    pagination.setButtonStyles();
  },
  drawList: function () {
    document.getElementById(pagination.listID).innerHTML = "";
    for (var r = 0; r < pagination.pageList.length; r++) {
      document.getElementById(pagination.listID).innerHTML +=
        pagination.pageList[r] + "";
    }
  },
  setButtonStyles: function () {
    if (pagination.currentPage === pagination.numberOfPages) {
      document.getElementById("next").classList.add("disabled");
      document.getElementById("last").classList.add("disabled");
      document.getElementById("previous").classList.remove("disabled");
      document.getElementById("first").classList.remove("disabled");
    }
    if (pagination.currentPage === 1) {
      document.getElementById("previous").classList.add("disabled");
      document.getElementById("first").classList.add("disabled");
      document.getElementById("next").classList.remove("disabled");
      document.getElementById("last").classList.remove("disabled");
    }
    if (
      pagination.currentPage > 1 &&
      pagination.currentPage < pagination.numberOfPages
    ) {
      document.getElementById("previous").classList.remove("disabled");
      document.getElementById("first").classList.remove("disabled");
      document.getElementById("next").classList.remove("disabled");
      document.getElementById("last").classList.remove("disabled");
    }
  },
};
export default pagination;
