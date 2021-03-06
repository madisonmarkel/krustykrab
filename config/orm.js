// Import MySQL connection.
var connection = require("../config/connection.js");

//TAKEN FROM CATS SOLVED
// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
    var arr = [];
  
    for (var i = 0; i < num; i++) {
      arr.push("?");
    }
  
    return arr.toString();
  }

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
    var arr = [];
  
    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
      var value = ob[key];
      // check to skip hidden properties
      if (Object.hasOwnProperty.call(ob, key)) {
        // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
        if (typeof value === "string" && value.indexOf(" ") >= 0) {
          value = "'" + value + "'";
        }
        // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
        // e.g. {sleepy: true} => ["sleepy=true"]
        arr.push(key + "=" + value);
      }
    }
  
    // translate array of strings to a single comma-separated string
    return arr.toString();
  }

// ===========================================================================
// MYSQL COMMANDS
// ===========================================================================
// Object for all our SQL statement functions.
var orm = {
    // =======SHOW ALL
    selectAll: function(tableInput, cb) {
        var queryString = "SELECT * FROM burgers;"
        connection.query(queryString, function(err, result){
            if (err) {
                throw err;
            }
            //callback function
            cb(result);
        });
    },

    // =======ADD NEW
    insertOne: function(table, cols, vals, cb) {
        var queryString = "INSERT INTO " + table;

        //TAKEN FROM CATS SOLVED, NOT SURE WHAT'S WORKING?????????????????
        queryString += " (";
        queryString += cols.toString();
        queryString += ") ";
        queryString += "VALUES (";
        queryString += printQuestionMarks(vals.length);
        queryString += ") ";

        console.log(queryString);

        connection.query(queryString, vals, function(err, result) {
            if (err) {
            throw err;
            }
    
            cb(result);
        });
    },

    // =======UPDATE BURGER
    updateOne: function(table, objColVals, condition, cb) {
        var queryString = "UPDATE " + table;
        console.log("CONDITION: " + condition)
        console.log("SET: " + objToSql(objColVals))
        console.log("OBJECT COL VALUES: " + objColVals)

        queryString += " SET ";
        //queryString += "devoured=false";
        queryString += objToSql(objColVals);
        queryString += " WHERE ";
        queryString += condition;

        console.log(queryString);
        connection.query(queryString, function(err, result) {
        if (err) {
            throw err;
        }

        cb(result);
        });
    }
};

// Export the orm object for the model (burger.js).
module.exports = orm;
