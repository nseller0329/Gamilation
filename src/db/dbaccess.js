import Database from 'better-sqlite3';
import schema from '../db/schema';
import path from 'path';
const dbPath = path.resolve(__dirname, 'gamilation.db');
class dbaccess {
    constructor() {
        this.db = new Database(dbPath, {
            verbose: console.log
        });
        this.schema = schema;
    }
    getAllRows(table) {
        var query = `SELECT * FROM ${table}`,
            sql = this.db.prepare(query);
        const rows = sql.all();
        return rows;
    }
    getRowItem(table, params = []) {
        var IdField = schema[table].idField,
            query = `SELECT * FROM ${table} WHERE ${IdField}= ?`,
            sql = this.db.prepare(query);
        const row = sql.get(params);
        return row;
    }
    addRowItems(table, fields, rows, callback) {
        var allfields = fields.map((field) => field).join(','),
            allvalues = fields.map((field) => '@' + field).join(','),
            query = `INSERT INTO ${table}(${allfields}) VALUES (${allvalues})`,
            sql = this.db.prepare(query),
            errLog = [];
        const insertRows = this.db.transaction(function (rows) {
            for (const row of rows) {
                try {
                    sql.run(row);
                } catch (err) {
                    errLog.push(err);
                }
            }
        });
        if (typeof callback === "function") {
            callback(errLog);
        }


        insertRows(rows);
    }
    updateRowItem(table, data, params = [], callback) {
        var IdField = schema[table].idField,
            updatefields = [],
            query, sql, errLog = [];
        for (var index in data) {
            if (data[index]) {
                updatefields.push(index + " = '" + data[index] + "'");
            }
        }
        updatefields = updatefields.map((field) => field).join(',');
        query = `UPDATE ${table} SET ${updatefields} WHERE ${IdField} = ?`;
        sql = this.db.prepare(query);

        try {
            sql.run(params);
        } catch (err) {
            errLog.push(err);
        }

        if (typeof callback === "function") {
            callback(errLog);
        }
    }
    runCustomSql(query, method, params = []) {
        var sql = this.db.prepare(query),
            data;
        switch (method) {
            case 'all':
                data = sql.all(params);
                break;

            case 'get':
                data = sql.get(params);
                break;
            case 'run':
            default:
                break;
        }

        return data;
    }
    closeDBConnection() {
        this.db.close();
    }
} //data access object

export default dbaccess;