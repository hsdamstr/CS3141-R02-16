;
jQuery(function ($) {
	'use strict';

	const IO = {


		//Called when page is initially loaded
		init: function () {
			IO.socket = io.connect();
			IO.bindEvents();
		},

		bindEvents: function () {
			IO.socket.on('connected', IO.onConnected);
			IO.socket.on('roomCreated', IO.onRoomCreated);
			IO.socket.on('playerJoinedRoom', IO.onPlayerJoinedRoom);
			IO.socket.on('player1', IO.on);
			IO.socket.on('startGame', IO.onStart);
			IO.socket.on('dealCards' , IO.onDealCards);
			IO.socket.on('playerLoggedIn' , IO.onLoginClick);

		},


		onConnected: function (data) {
			App.mySocketID = IO.socket.id;
			console.log(IO.socket.id);
			console.log(data.message);
		},


		onRoomCreated: function (data) {
			App.Player.hostPreScreen(data);
		},

		onPlayerJoinedRoom: function (data) {

			App.Player.playerJoinedRoom(data);

		},


		onStart: function () {

			console.log("game info: ");
			console.log("game started");
			console.log("Role: " + App.myRole);

			if (App.myRole === 'Player') {
				App.Round.roundStart();
			}
			else {
				App.Player.startGame()
			}
		},

		onDealCards: function (data){
			console.log("dealing");
			
		},

		onLoginClick: function(){
			App.gameArea.html(App.$introScreen);
		}


	};


	const App = {

		gameId: 0,

		myRole: "",

		mySocketID: "",

		currentRound: 0,

		init: function () {
			App.cacheElements();
			App.showInitScreen();
			App.bindEvents();
		},

		cacheElements: function () {
			App.$doc = $(document)
			App.gameArea = $('#gameArea');

			App.$introScreen = $('#introScreen').html();
			App.$signUp = $('#signUp').html();
			App.$login = $('#login').html();

			App.$hostJoinGame = $('#hostJoinGame').html();
			App.$waiting = $('#waiting').html();
			App.$playerJoinGame = $('#playerJoinGame').html();
			App.$playerSetsName = $('#playerSetsName').html();
		},

		bindEvents: function () {
			App.$doc.on('click', '#signUp', App.Player.onSignUpClick)
			App.$doc.on('click', '#login', App.Player.onLoginClick)
			App.$doc.on('click', '#createGame', App.Player.onCreateClick);
			App.$doc.on('click', "#joinGame", App.Player.onJoinClick);
			App.$doc.on('click', "#submit", App.Player.setName);
			App.$doc.on('click', "#startGame", App.Player.startGameClick);
			App.$doc.on('click', '#quit', App.showInitScreen);
		},


		showInitScreen: function () {
			App.gameArea.html(App.$introScreen);
		},



		Player: {
			/**
		 * players[{name: string, points: int}]
		 */
			players: [],

			numPlayers: 0,

			roomNum: null,

			hostSocketId: '',

			hostRoomNumber: '',

			playerName: '',

			playerOne: false,

			playerDeck: [],


			onCreateClick: function () {
				IO.socket.emit('hostCreatedGame');
				console.log("host created game");
				
			},

			hostPreScreen: function (data) {

				App.Player.roomNum = data.roomid;

				App.myRole = "Host";

				App.gameArea.html(App.$hostJoinGame);


				$("#startInject")
					.append("<button id='startGame'>Start Game</button>");

				$('#roomCode')
					.html(data.roomid);

				$('#playerCount')
					.html("Player Count: " + App.Player.players.length);

				console.log(data.roomid);
			},

			playerJoinedRoom: function (data) {

				App.Player.numPlayers = App.Player.numPlayers + 1;


				$('#playerCount')
					.append('<p/>')
					.text('Player Count: ' + App.Player.numPlayers)

				$('#player').append('<p>Player : ' + data.pName + ' has joined the game.</p>');

				App.Player.players.push(data.pName);
			},

			startGame: function () {
				App.gameArea.html(App.$hostWaitingScreen);
			},


			onLoginClick: function () {
				App.gameArea.html(App.$login);
			},

			onSignUpClick: function () {
				console.log("new member")
				App.gameArea.html(App.$signUp);
			},

			onJoinClick: function () {
				console.log("new player")
				console.log(App.mySocketID)
				App.gameArea.html(App.$playerJoinGame);
			},

			onPlayerPlaceCard: function () {
				card = deck.pop.shift();

				socket.emit('placecard',);
			},


			setName: function () {
				let data = {
					name: $('#name').val(),
					roomNum: $('#roomNum').val()
				}

				App.Player.playerName = data.name;
				App.Player.hostRoomNumber = data.roomNum;
				App.myRole = "Player"

				console.log("Player Info:")
				console.log(App.myRole);
				console.log(App.Player.playerName);
				console.log(App.Player.hostRoomNumber);

				IO.socket.emit('playerJoin', {
					roomNumber: App.Player.hostRoomNumber,
					playerName: App.Player.playerName
				});
				App.gameArea.html(App.$waiting);
			},

			setHost: function () {

				//sets this player to player 1
				this.host = true;

				//appends the start button
				
			},

			startGameClick: function () {

				IO.socket.emit('playerReqStart', { roomNum: App.Player.hostRoomNumber });


			},

		},

	}

	IO.init();
	App.init();
})
