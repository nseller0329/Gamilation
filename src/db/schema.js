var schema = {
    games: {
        fields: ["ID", "Media_Type", "Media_Format", "Name", "Platform", "Client", "Genre", "Status"],
        idField: "ID"
    },
    genres: {
        fields: ['ID', 'Name'],
        idField: "ID"
    }
};

export default schema;