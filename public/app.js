jQuery(function($) {
	'use strict';

    const IO = {


		//Called when page is initiflly loaded
		init: function () {
			IO.socket = io.connect();
			IO.bindEvents();
		},

        bindEvents: function () {
			IO.socket.on('connected', IO.onConnected);
			IO.socket.on('roomCreated', IO.onRoomCreated);
			IO.socket.on('playerJoinedRoom', IO.onPlayerJoinedRoom);
			IO.socket.on('player1', IO.onPlayer1);
			IO.socket.on('startGame', IO.onStart);

        },


        onConnected: function (data) {
			App.mySocketID = IO.socket.id;
			console.log(IO.socket.id);
			console.log(data.message);
		},


		onRoomCreated: function (data) {
			App.Host.hostPreScreen(data);
		},

        onPlayerJoinedRoom: function (data) {

			App.Host.playerJoinedRoom(data);

		},


		onStart: function () {

			console.log("game info: ");
			console.log("game started");
			console.log("Role: " + App.myRole);

			if(App.myRole === 'Player')
			{
				App.Round.roundStart();
			}
			else {
				App.Host.startGame()
			}
		},


    };


	const App = {
		
		gameId: 0,

		myRole: "",

		mySocketID: "",

		currentRound: 0,

		init: function() {
			App.cacheElements();
			App.showInitScreen();
			App.bindEvents();
		},

		cacheElements: function (){
			App.$doc = $(document)
			App.gameArea = $('#gameArea');

			App.$introScreen = $('#introScreen').html();
			App.$signUp = $('#signUp').html();
			App.$login = $('#login').html();
			App.$home = $('#introScreen').html();

			//host screens
			App.$hostJoinGame = $('#hostJoinGame').html();
			App.$hostWaitingScreen = $('#roundStart').html();

			//player screens
			App.$playerJoinGame = $('#playerJoinGame').html();
			App.$playerSetsName = $('#playerSetsName').html();
		},

		bindEvents: function (){
			App.$doc.on('click', '#Home' , App.Player.onHomeClick);
			App.$doc.on('click', '#login' , App.Player.onLoginClick);
			App.$doc.on('click', '#signUp' , App.Player.onSignUpClick);
			App.$doc.on('click', '#createGame', App.Host.onCreateClick);
			App.$doc.on('click', "#joinGame", App.Player.onJoinClick);
			App.$doc.on('click', "#submit", App.Player.setName);
			App.$doc.on('click', "#startGame", App.Player.startGameClick);
			App.$doc.on('click', '#quit', App.showInitScreen);
		},


		showInitScreen: function(){
			App.gameArea.html(App.$introScreen);
		},


		Player: {
			hostSocketId: '',

			hostRoomNumber: '',

			playerName: '',

			playerOne: false,

			onHomeClick : function(){
				console.log("going back")
				App.gameArea.html(App.$introScreen);
			},

			onLoginClick : function(){
				console.log("returning player")
				App.gameArea.html(App.$login);
			},

			onSignUpClick : function (){
				console.log("new member")
				App.gameArea.html(App.$signUp);	
			},

			onJoinClick: function (){
				console.log("new player")
				console.log(App.mySocketID)
				App.gameArea.html(App.$playerJoinGame);
			},


			setName: function (){
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
				App.Player.displayBlank();
			},

			setPlayer1: function () {

				//sets this player to player 1
				this.playerOne = true;

				//appends the start button
				$("#startInject")
					.append("<button id='startGame'>Start Game</button>");
			},

			startGameClick: function () {

				IO.socket.emit('playerReqStart', {roomNum: App.Player.hostRoomNumber});

			}	
		},

		Host: {

			roomNum: null,

			/**
			 * players[{name: string, points: int}]
			 */
			players: [],

			numPlayers: 0,
			/**
			 * When create game is selected emits event to get room code
			 */
			onCreateClick: function () {
				IO.socket.emit('hostCreatedGame');
				console.log("host created game");
			},

			hostPreScreen: function (data) {

				App.Host.roomNum = data.roomid;

				App.myRole = "Host";

				App.gameArea.html(App.$hostJoinGame);

				$('#roomCode')
					.html(data.roomid);

				$('#playerCount')
					.html("Player Count: " + App.Host.players.length);

				console.log(data.roomid);
			},

			playerJoinedRoom: function (data) {

				App.Host.numPlayers = App.Host.numPlayers + 1;


				$('#playerCount')
					.append('<p/>')
					.text('Player Count: ' + App.Host.numPlayers)

				$('#player').append('<p>Player : ' + data.pName + ' has joined the game.</p>');

				App.Host.players.push(data.pName);
			},

			startGame: function () {

				App.gameArea.html(App.$hostWaitingScreen);
			},

		}

	}

	IO.init();
	App.init();
});