$(document).ready(function(){

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
        populate: function (){
            if (game.playerOneName !== ""){
                $(".player-one-title").text(game.playerOneName);
                $(".player-one-img").removeClass("hidden");
                
            }
            if (game.playerTwoName !== "") {
                $(".player-two-title").text(game.playerTwoName);
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
        displayModal: function () {
            if (game.playerOneName === "" && game.playerTwoName === "") { //if the first player has not given a name and effectively logged in, display error warning
                $('#myModal').modal('show');
                return
            }
        },
        beginGame: function(){
            var name = $("#name-input").val().trim(); //grabs the name user inputs
            if (game.playerOneName === ""){
                game.playerOneName = name;
            }
            else {
                game.playerTwoName = name;
            }
            game.populate();
        },
        addChat: function(){
            if (game.playerOneName === "") { //if the first player has not given a name and effectively logged in, display error warning
                $('#myModal').modal('show');
            }
            else {
            var chatText = $("#chat-input").val().trim(); //grabs chat input
            $("#chat-input").val("");
            var newLine = $("<div>").text(game.playerOneName + ": " + chatText);
            $(".chat-area").append(newLine);
            }
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
            if ((game.choicePlayerOne === "rock") || (game.choicePlayerOne === "paper") || (game.choicePlayerOne === "scissors")) {
                if ((game.choicePlayerOne === "rock") && (game.choicePlayerTwo === "scissors")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerTwo++;
                    console.log(game.playerOneName +  " Wins!");
                } else if ((game.choicePlayerOne === "rock") && (game.choicePlayerTwo === "paper")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    console.log(game.playerTwoName + " Wins!");
                } else if ((game.choicePlayerOne === "scissors") && (game.choicePlayerTwo === "rock")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    console.log(game.playerTwoName + " Wins!");
                } else if ((game.choicePlayerOne === "scissors") && (game.choicePlayerTwo === "paper")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerOne++;
                    console.log(game.playerOneName + " Wins!");
                } else if ((game.choicePlayerOne === "paper") && (game.choicePlayerTwo === "rock")) {
                    game.winsPlayerOne++;
                    game.lossesPlayerOne++;
                    console.log(game.playerOneName + " Wins!");
                } else if ((game.choicePlayerOne === "paper") && (game.choicePlayerTwo === "scissors")) {
                    game.lossesPlayerOne++;
                    game.winsPlayerTwo++;
                    console.log(game.playerTwoName + " Wins!");
                } else if (game.choicePlayerOne === game.choicePlayerTwo) {
                    game.ties++;
                };
                
                $(".player-one-options").removeClass("hidden");
                $(".player-two-options").removeClass("hidden");
            }
        }
    };


    game.populate();
    $(".btn-name").click(game.beginGame);
    $(".btn-chat").click(game.addChat);
    $(".btn-rps").click(game.logChoice);
});