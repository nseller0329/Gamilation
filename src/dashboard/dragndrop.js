var dragNdrop = {
    allowDrop: function (e) {
        e.preventDefault();
    },
    drag: function (e) {
        e.dataTransfer.setData('game', e.target.id);
    },
    drop: function (e) {
        e.preventDefault();
        var data = e.dataTransfer.getData('game');
        e.target.appendChild(document.getElementById(data));
        return document.getElementById(data).dataset.itemid;
    }
};

export default dragNdrop;