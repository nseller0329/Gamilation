var schema = {
    games: {
        fields: ["ItemID", "Media_Type", "Media_Format", "Name", "Platform", "Client", "Genre", "Status"],
        idField: "ItemID"
    },
    genres: {
        fields: ['ID', 'Name'],
        idField: "ID"
    }
};

export default schema;