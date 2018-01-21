$(document).ready(function(){

    var game = {
        playerOneName: "",
        playerTwoName: "",
        wins: 0,
        losses: 0,
        displayModal: function () {
            if (game.playerOneName === "") { //if the first player has not given a name and effectively logged in, display error warning
                $('#myModal').modal('show');
                return
            }
        },
        beginGame: function(){
            var name = $("#name-input").val().trim(); //grabs the name user inputs
            game.playerOneName = name;
            $(".name-row").replaceWith("<div class='game-status text-center'></div>") //hides name field
            $(".player-one-title").text(game.playerOneName);
            $(".player-one-options").removeClass("hidden");
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
            $(".player-one-options").addClass("hidden");
            $(".player-one-choice").html("<h2>" + userChoice + "!<h2>");
        }
    };

    $(".btn-name").click(game.beginGame);
    $(".btn-chat").click(game.addChat);
    $(".btn-rps").click(game.logChoice);
});