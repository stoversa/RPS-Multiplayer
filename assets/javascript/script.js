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
const users = database.ref("users");
const userOne = database.ref("users/1");
const userTwo = database.ref("users/2");
const chatDB = database.ref("chat");
const turnDB = database.ref("turn");
const connectedRef = database.ref(".info/connected");
// Logs who has accessed page and clears their credentials when they exit
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        userOne.once("value", function (snapshot) {
            if (snapshot.val()) {
                userTwo.onDisconnect().remove(); //disconnect two if one's already taken
                console.log("Will disconnect p 2")
            }
            else { //otherwise, remove one every time, since that's the default/first person
                userOne.onDisconnect().remove();
                console.log("Will disconnect p 1")
            }
        });
    }
});
let isPlayerOne = false;
let isPlayerTwo = false;
var game = {
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
        } else {
            var chatText = $("#chat-input").val().trim(); //grabs chat input
            $("#chat-input").val("");
            // $(".chat-area").empty();
            chatDB.push(game.playerOneName + ": " + chatText);
            
        }
    },
    populate: function () {
        if (game.playerOneName !== "") {
            $(".player-one-title").text(game.playerOneName + "   Wins: " + game.winsPlayerOne + " / Losses: " + game.lossesPlayerOne);
            $(".player-one-img").show();
        }

        if (game.playerTwoName !== "") {
            $(".player-two-title").text(game.playerTwoName + "   Wins: " + game.winsPlayerTwo + " / Losses: " + game.lossesPlayerTwo);
            $(".player-two-img").show();
        }

        if (game.playerOneName != "" && game.playerTwoName != "") {
            $(".name-row").replaceWith("<div class='game-status text-center'></div>") //hides name field
            $(".player-one-img").hide();
            $(".player-two-img").hide();
            if (isPlayerOne){
                $(".player-one-options").show();
            }
            else if (isPlayerTwo) {
                $(".player-two-options").show();
            };
        };
    },
    beginGame: function () {
        turnDB.set({ turn: 1 });
        var name = $("#name-input").val().trim(); //grabs the name user inputs
        $("#name-input").val("");
        if (game.playerOneName === "") {
            game.playerOneName = name;
            userOne.set({
                name: game.playerOneName,
                wins: game.winsPlayerOne,
                losses: game.lossesPlayerOne
            });
            isPlayerOne = true;
        } else {
            game.playerTwoName = name;
            userTwo.set({
                name: game.playerTwoName,
                wins: game.winsPlayerTwo,
                losses: game.lossesPlayerTwo
            });
            isPlayerTwo = true;
        }
        game.populate();
    },
    updatePlayers: function () {
        userOne.update({
            wins: game.winsPlayerOne,
            losses: game.lossesPlayerOne
        });
        userTwo.update({
            wins: game.winsPlayerTwo,
            losses: game.lossesPlayerTwo
        });
        database.ref("users/1/choice").remove();
        database.ref("users/2/choice").remove();
        game.choicePlayerOne = "";
        game.choicePlayerTwo = "";
    },
    logChoice: function () {
        if (isPlayerOne) {
            $(".player-one-options").hide();
            var userChoice = $(this).attr("data");
            var player = $(this).attr("player");
            $(".player-one-choice").html("<h2>" + userChoice + "!<h2>");
            game.choicePlayerOne = userChoice;
            userOne.update({
                choice: userChoice
            });
            game.checkScores();
        }
        else if (isPlayerTwo) {
            $(".player-two-options").hide();
            var userChoice = $(this).attr("data");
            var player = $(this).attr("player");
            $(".player-two-choice").html("<h2>" + userChoice + "!<h2>");
            game.choicePlayerTwo = userChoice;
            userTwo.update({
                choice: userChoice
            });
            game.checkScores();
        }
    },
    gradeGame: function () {
        // game.getUserScore();
        console.log(game.choicePlayerOne);
        console.log(game.choicePlayerTwo);
        $("#placeholder-img").hide();
        var results = $("<h2 class='text-center' id='win-text'></h2>");
        $(".game-results").append(results);
        if ((game.choicePlayerOne === "rock") || (game.choicePlayerOne === "paper") || (game.choicePlayerOne === "scissors")) {
            if ((game.choicePlayerOne === "rock") && (game.choicePlayerTwo === "scissors")) {
                game.winsPlayerOne++;
                game.lossesPlayerTwo++;
                results.text(game.playerOneName + " Wins!");
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
            game.updatePlayers();
            setTimeout(game.reset, 3000);
        }
    },
    getUserScore: function(){
        userOne.once("value", function (snapshot) {
            game.choicePlayerOne = snapshot.choice;
            console.log(game.choicePlayerOne);
        });
        userTwo.once("value", function (snapshot) {
            game.choicePlayerTwo = snapshot.choice;
            console.log(game.choicePlayerTwo);
        });
    },
    checkScores: function(){
        users.once("value", function (snapshot) {
            if (snapshot.val()[1]["choice"] && snapshot.val()[2]["choice"]) {
                console.log("grading")
                game.choicePlayerOne = snapshot.val()[1]["choice"]
                game.choicePlayerTwo = snapshot.val()[2]["choice"]
                game.gradeGame();
            }
        });
    },
    reset: function () {
        $(".choice").text("");
        game.choicePlayerOne = "";
        game.choicePlayerTwo = "";
        $("#placeholder-img").show();
        $("#win-text").remove();
        game.populate();
    }
}; //end game object

userOne.on("value", function (snapshot) {
    if (snapshot.val()) {
        var user = snapshot.val();
        game.playerOneName = user.name;
        game.lossesPlayerOne = user.losses;
        game.winsPlayerOne = user.wins;
        game.populate();
    }
});
userTwo.on("value", function (snapshot) {
    if (snapshot.val()) {
        var userTwo = snapshot.val();
        game.playerTwoName = userTwo.name;
        game.lossesPlayerTwo = userTwo.losses;
        game.winsPlayerTwo = userTwo.wins;
        game.populate();
    }
});


chatDB.on("child_added", function (snapshot) {
    var newLine = $("<div>").text(snapshot.val());
    $(".chat-area").prepend(newLine);
}, function (err) {
    // Handle errors
    console.log("Error: ", err.code);
});


$(".btn-name").click(game.beginGame);
$(".btn-chat").click(game.addChat);
$(".btn-rps").click(game.logChoice);