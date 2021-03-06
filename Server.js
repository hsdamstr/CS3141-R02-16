const express = require('express');
const app = express();
const path = require('path')
const http = require('http')
const { instrument } = require("@socket.io/admin-ui");
const PORT = process.env.PORT || 3000
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mySql = require("mysql");
const session = require('express-session');
var mysql = require('mysql');
const { Hash } = require('crypto');


instrument(io, {
	auth: false
});

let username;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'))
})
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));



server.listen(PORT, () => console.log('Sever running on port ' + PORT))
var connection = mySql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "teamsoftware16",
	database: "myapp"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});


// http://localhost:3000/auth
app.post('/auth', function (request, response) {
	// Capture the input fields
	username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM users WHERE name = ? AND password = ?', [username, password], function (error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page

				console.log(request.session.username);
				console.log(request.session.loggedin);

				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		response.redirect('index.html');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

let user;
let password;
let email;
var passwordHash = require('password-hash');
//CREATE USER
app.post("/createUser", function (req,res) {
	user = req.body.name;
	password = req.body.password;
	email = req.body.email;
	 const sqlSearch = 'SELECT * FROM users WHERE name = ?';
	 const search_query = mysql.format(sqlSearch,[user]);
	 const sqlInsert = 'INSERT INTO users(name, password, email) VALUES (?,?,?)';
	 const insert_query = mySql.format(sqlInsert,[user, password, email]);

	connection.query (search_query, function (err, result) {
	  if (err) throw (err)
	  console.log("------> Search Results")
	  console.log(result.length);
	  if (result.length != 0) {
	   connection.release();
	   console.log("------> User already exists");
	   res.sendStatus(409) 
	  } 
	  else {
	connection.query (insert_query, (err, result) => {
	   //connection.release()
	   if (err) throw (err)
	   console.log ("--------> Created new User");
	   console.log(result.insertId);
	   res.sendStatus(201);
	  })
	 }
	}) //end of connection.query()
	}) //end of app.post()

	


//Start server

io.on('connection', socket => {

	console.log('New WS connection' + socket.id);

	socket.emit('connected', { message: "You are Connected" });

	//when host creates game function is called
	socket.on('hostCreatedGame', function () {
		console.log('host has created game');

		//generates a room number
		let roomNum = (Math.random() * 1000) | 0;
		//emits roomCreated with room number to host
		socket.emit("roomCreated", { roomid: roomNum });
		//host joins the room to creat it
		this.join(roomNum.toString());

		console.log(socket.rooms);

	})
	socket.on('playerJoin', function (data) {

		//info printing
		console.log(data.roomNumber);

		console.log(io.of('/').adapter.rooms);

		//makes sure the room has a host before allowing players to join
		if (io.of('/').adapter.rooms.has(data.roomNumber)) {
			//joins the room
			this.join(data.roomNumber);

			console.log(io.of('/').adapter.rooms);
			//emits that a player is joining the room to the host
			socket.to(data.roomNumber).emit('playerJoinedRoom', { pName: data.playerName });
			//sets num players = to the size of the room
			var numPlayers = io.of('/').adapter.rooms.get(data.roomNumber).size;

			console.log(numPlayers);
			//if this is the first player they get to be player one
			if (numPlayers === 2) {
				socket.emit('player1');
			}

			console.log(data.playerName + " joining room: " + data.roomNumber);

		}

		else {
			console.log("room does not exist");
		}

	})

	socket.on('playerReqStart', function (data) {

		io.in(data.roomNum).emit('startGame');

		console.log("Game started for room: " + data.roomNum);
	})

	//function for place card

	socket.on('placeCard', function (data) {

		console.log("cardPlace holder")

	})

	socket.on('playerRequestDeck', function (data) {
		io.in(data.roomNum).emit('dealCards')
	})

	socket.emit('playerLogged', {user: username})

	socket.on("requestLog", function (request, response) {
		response.redirect('/auth')
	})


})