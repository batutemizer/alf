const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

module.exports = {
  addStudent: (name, surname, parent_phone, device_id, callback) => {
    db.get(
      `SELECT * FROM students WHERE device_id = ?`,
      [device_id],
      (err, row) => {
        if (row) {
          callback(new Error('Bu cihaz ile zaten bir öğrenci kaydı var.'), null);
        } else {
          db.run(
            `INSERT INTO students (name, surname, parent_phone, device_id) VALUES (?, ?, ?, ?)`,
            [name, surname, parent_phone, device_id],
            function (err) {
              callback(err, this ? this.lastID : null);
            }
          );
        }
      }
    );
  },

  findStudent: (name, surname, device_id, callback) => {
    db.get(
      `SELECT * FROM students WHERE name = ? AND surname = ? AND device_id = ?`,
      [name, surname, device_id],
      (err, row) => {
        callback(err, row);
      }
    );
  },

  listStudents: (callback) => {
    db.all(`SELECT * FROM students`, [], (err, rows) => {
      callback(err, rows);
    });
  },
}; 