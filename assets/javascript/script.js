$(document).ready(function(){

    const config = {
        apiKey: "AIzaSyCzc_uB6Vm0fLjvg8-I49W197kVM5Y2keQ",
        authDomain: "rps-multiplayer-33e8c.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-33e8c.firebaseio.com",
        projectId: "rps-multiplayer-33e8c",
        storageBucket: "rps-multiplayer-33e8c.appspot.com",
        messagingSenderId: "187149775253"
    };
    firebase.initializeApp(config);
    const database = firebase.database();
    const userOne = database.ref("user1");
    const userTwo = database.ref("user2");
    const chatDB = database.ref("chat");
    const connectedRef = database.ref(".info/connected");


    var game = {
        isPlayerOne: false,
        isPlayerTwo: false,
        playerOneName: "",
        playerTwoName: "",
        choicePlayerOne: "",
        choicePlayerTwo: "",
        winsPlayerOne: 0,
        lossesPlayerOne: 0,
        winsPlayerTwo: 0,
        lossesPlayerTwo: 0,
        ties: 0,
        displayModal: function () {
            if (game.playerOneName === "" && game.playerTwoName === "") { //if the first player has not given a name and effectively logged in, display error warning
                $('#myModal').modal('show');
                return
            }
        },
        addChat: function () {
            if (game.playerOneName === "") { //if the first player has not given a name and effectively logged in, display error warning
                $('#myModal').modal('show');
            }
            else {
                var chatText = $("#chat-input").val().trim(); //grabs chat input
                $("#chat-input").val("");
                chatDB.push(game.playerOneName + ": " + chatText);
                $(".chat-area").empty();
            }
        }, 
        populate: function (){
            if (game.playerOneName !== ""){
                $(".player-one-title").text(game.playerOneName + "   Wins: " + game.winsPlayerOne + " / Losses: " + game.lossesPlayerOne);
                $(".player-one-img").removeClass("hidden");
            }

            if (game.playerTwoName !== "") {
                $(".player-two-title").text(game.playerTwoName + "   Wins: " + game.winsPlayerTwo + " / Losses: " + game.lossesPlayerTwo);
                $(".player-two-img").removeClass("hidden");
            }

            if (game.playerOneName != "" && game.playerTwoName != "") {
                $(".name-row").replaceWith("<div class='game-status text-center'></div>") //hides name field
                $(".player-one-img").addClass("hidden");
                $(".player-two-img").addClass("hidden");
                $(".player-one-options").removeClass("hidden");
                $(".player-two-options").removeClass("hidden");
            };
        },
        beginGame: function(){
            var name = $("#name-input").val().trim(); //grabs the name user inputs
            $("#name-input").val("");
            if (game.playerOneName === ""){
                game.playerOneName = name;
                userOne.set({
                        name: game.playerOneName,
                        wins: game.winsPlayerOne,
                        losses: game.lossesPlayerOne
                });
                game.isPlayerOne = true;
                console.log(game.isPlayerOne);
            }
            else {
                game.playerTwoName = name;
                userTwo.set({
                        name: game.playerTwoName,
                        wins: game.winsPlayerTwo,
                        losses: game.lossesPlayerTwo
                });
                game.isPlayerTwo = true;
                console.log(game.isPlayerTwo);
            }
            game.populate();
        },
        setPlayers: function(){
            userOne.set({
                name: game.playerOneName,
                wins: game.winsPlayerOne,
                losses: game.lossesPlayerOne
            });
            userTwo.set({
                name: game.playerTwoName,
                wins: game.winsPlayerTwo,
                losses: game.lossesPlayerTwo
            });
        },
        logChoice: function(){
            var userChoice = $(this).attr("data");
            var player = $(this).attr("player");
            if (player === "one"){
                $(".player-one-options").addClass("hidden");
                $(".player-one-choice").html("<h2>" + userChoice + "!<h2>");
                game.choicePlayerOne = userChoice;
            }
            if (player === "two") {
                $(".player-two-options").addClass("hidden");
                $(".player-two-choice").html("<h2>" + userChoice + "!<h2>");
                game.choicePlayerTwo = userChoice;
            }
            if (game.choicePlayerOne != "" && game.choicePlayerTwo !=  ""){
                game.gradeGame();
            }
        },
        gradeGame: function(){
            $("#placeholder-img").hide();
            var results = $("<h2 class='text-center' id='win-text'></h2>");
            $(".game-results").append(results);
            if ((game.choicePlayerOne === "rock") || (game.choicePlayerOne === "paper") || (game.choicePlayerOne === "scissors")) {
                if ((game.choicePlayerOne === "rock") && (game.choicePlayerTwo === "scissors")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerTwo++;
                    results.text(game.playerOneName +  " Wins!");
                } else if ((game.choicePlayerOne === "rock") && (game.choicePlayerTwo === "paper")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    results.text(game.playerTwoName + " Wins!");
                } else if ((game.choicePlayerOne === "scissors") && (game.choicePlayerTwo === "rock")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    results.text(game.playerTwoName + " Wins!");
                } else if ((game.choicePlayerOne === "scissors") && (game.choicePlayerTwo === "paper")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerOne++;
                    results.text(game.playerOneName + " Wins!");
                } else if ((game.choicePlayerOne === "paper") && (game.choicePlayerTwo === "rock")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerOne++;
                    results.text(game.playerOneName + " Wins!");
                } else if ((game.choicePlayerOne === "paper") && (game.choicePlayerTwo === "scissors")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    results.text(game.playerTwoName + " Wins!");
                } else if (game.choicePlayerOne === game.choicePlayerTwo) {
                    results.text("It's a tie!");
                };
                game.setPlayers();
                setTimeout(game.reset, 3000);
            }
        },
        reset: function(){
            $(".choice").text("");
            game.choicePlayerOne = "";
            game.choicePlayerTwo = "";
            $("#placeholder-img").show();
            $("#win-text").remove();
            game.populate();
        }
    };

    userOne.on("value", function (snapshot) {
        if (snapshot.val()){
            var user = snapshot.val();
            game.playerOneName = user.name;
            game.lossesPlayerOne = user.losses;
            game.winsPlayerOne = user.wins;
            game.populate();
        }
    });
    userTwo.on("value", function (snapshot) {
        if (snapshot.val()){
            var userTwo = snapshot.val();
            game.playerTwoName = userTwo.name;
            game.lossesPlayerTwo = userTwo.losses;
            game.winsPlayerTwo = userTwo.wins;
            game.populate();}
    });
    chatDB.on("child_added", function (snapshot) {
        var newLine = $("<div>").text(snapshot.val());
        $(".chat-area").prepend(newLine);
    }, function (err) {
        // Handle errors
        console.log("Error: ", err.code);
    });
    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {
        if (snap.val()){
            if (game.isPlayerOne === true) {
            userOne.onDisconnect().remove();
            }
            else if (game.isPlayerTwo === true) {
            userTwo.onDisconnect().remove();
            }
            else {
                console.log("Hi!")
            }
        }
    });

    $(".btn-name").click(game.beginGame);
    $(".btn-chat").click(game.addChat);
    $(".btn-rps").click(game.logChoice);
});