var config = {
    apiKey: "AIzaSyD4xD2MwfD82yjUHzWTuyWubfWLMJI_4PM",
    authDomain: "timesheet-a3dce.firebaseapp.com",
    databaseURL: "https://timesheet-a3dce.firebaseio.com",
    projectId: "timesheet-a3dce",
    storageBucket: "timesheet-a3dce.appspot.com",
    messagingSenderId: "290108157734"
};

firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function () {

    $(document).on("click", "#submitButton", function () {
        addTrain();

    });

    database.ref().on("child_added", function (snapshot) {
        if (snapshot.val() !== null) {
            console.log(snapshot);
            createRecord(snapshot);
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })
});


function addTrain() {
    event.preventDefault();

    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime =$("#firstTrainTime").val().trim();
    var frequency = $("#frequency").val().trim();
   
    if (moment(firstTrainTime).isValid()) {

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        });
    } 
}



function createRecord(snapshot) {
    var tr = $("<tr>");
    var { firstTrainTime, frequency, trainName, destination } = snapshot.val();
    getMinutesAway(firstTrainTime, frequency);

    var trainNameTd = $("<td>");
    $(trainNameTd).text(trainName);
    $(tr).append(trainNameTd);

    var destinationTd = $("<td>");
    $(destinationTd).text(destination);
    $(tr).append(destinationTd);    
    
    var frequencyTd = $("<td>");
    $(frequencyTd).text(frequency);
    $(tr).append(frequencyTd);

    var nextArrivalTd = $("<td>");
    $(nextArrivalTd).text(nextArrival);
    $(tr).append(nextArrivalTd);

    var minutesAwayTd = $("<td>");
    $(minutesAwayTd).text(minutesAway);
    $(tr).append(minutesAwayTd);

    $("#tableBody").append(tr);
}

function getMinutesAway(firstTrainTime, frequency) {

      var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");

      var currentTime = moment();
  
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

      var tRemainder = diffTime % frequency;
  
      minutesAway = frequency - tRemainder;
  
      nextArrival= moment().add(minutesAway, "minutes").format("hh:mm");
}