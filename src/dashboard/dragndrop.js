var dragNdrop = {
    allowDrop: function (e) {
        e.preventDefault();
    },
    drag: function (e) {
        e.dataTransfer.setData('text', e.target.id);
    },
    drop: function (e) {
        e.preventDefault();
        var data = e.dataTransfer.getData('text');
        e.target.appendChild(document.getElementById(data));
    }
};

export default dragNdrop;