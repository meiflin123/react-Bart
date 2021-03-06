const mysql = require('mysql');
const mysqlConfig = require('./config.js');

const connection = mysql.createConnection(mysqlConfig);

connection.connect((err) => {
	if (err) {
		console.log('problem connecting to mysql', err);
		return;
	}
	console.log('connected to mysql!')
})

//retrieve all lines from table `service_lines` in the database.

const getAllLines = function(callback) {
  connection.query('SELECT * FROM service_lines', (err, data) => {
  	if (err) {
  		callback(err);
  		return;
  	}
  	callback(null, data);
  });
}

//get all stops found along a line, according to that line's `id`.

const getStops = function(lineid, callback) {
  let query = 'SELECT *  FROM stations, stops WHERE stops.line_id = ? AND stations.id = stops.station_id;'
  connection.query(query, lineid, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data);
  })
}


// toggle a station to be favorite or to be unfavorite. 
  //if a station's is_favorite is 0, make it 1 and send true to server.(makefav)
  //if a station's is_favorite is 1, make it 0 and send false to server. (removefav)

const toggleFavStation = function(stationId, callback) {
  let stationData = 'SELECT * FROM stations WHERE id = ?'
  let makeFav = 'UPDATE stations SET is_favorite = 1 WHERE stations.id = ?';
  let removeFav = 'UPDATE stations SET is_favorite = 0 WHERE stations.id = ?';

  connection.query(stationData, stationId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
  
    if(data[0].is_favorite === 0) {
      connection.query(makeFav, stationId, (err, data) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, true)
      })
    }

    if (data[0].is_favorite === 1) {
      connection.query(removeFav, stationId, (err, data) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, false)
      })
    }
  })}


// gets all stations 
const getStations = function(callback) {
  connection.query('SELECT * FROM stations', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
  })

}
//get a station's lineid according to that station's `id`.
const getLineId = function(stationId, callback) {
  var query = 'SELECT line_id  FROM stops where station_id = ?'
  connection.query(query, stationId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: lineid', data)
  })
}

const getTransfer = function(lineId, callback) {
  let query = 'SELECT station_id from stops where is_transfer = 1 AND line_id = ?'
  connection.query(query, lineId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: transfer station on this line', data)
  })
}

const getLineColor = function(lineId, callback) {
  var query = 'SELECT color, name FROM service_lines where id = ?'
  connection.query(query, lineId, (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    callback(null, data)
    console.log('database: line color is ', data)
  })
}

module.exports = {
  getAllLines,
  getStops,
  toggleFavStation,
  getStations,
  getLineId,
  getTransfer,
  getLineColor
};