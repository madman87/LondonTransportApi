"use strict";

const callapiBtn = document.getElementById('callapi'),
      result = document.getElementById("result").querySelector("tbody");

if (callapiBtn) {
    callapiBtn.addEventListener('click', async (e) => {

        const response = await fetch('https://api.tfl.gov.uk/StopPoint/490009333W/arrivals');
        const myJson = await response.json(); //extract JSON from the http response

        result.innerHTML = "<tr><td colspan='5'>LOADING</td></tr>";

        let trarray = "";
        for (let i = 0; i < myJson.length; i++) {
            let r = myJson[i];
            console.log(myJson[i]);
            let time = myJson[i].expectedArrival;
            let destination = myJson[i].destinationName;
            let station = myJson[i].stationName;
            let vehicle = myJson[i].vehicleId;
            let tr = createTr(vehicle, time, station, destination);
            trarray += tr;
        }
        result.innerHTML = trarray;

        //SEND CALL API DATA TO BACKEND
        const data = new FormData(); //FORM DATA SEND
        data.append("json", JSON.stringify(myJson));

        fetch("/getdata",
            {
                method: "POST",
                body: data,
            })
            .then(function (res) {
                return res.json();
            }).catch((error) => {
                console.log(error);
            });
    });
}

function createTr(v, t, s, d) {
    return "<tr><td>" + v + "</td><td>" + t + "</td><td>" + s + "</td><td>" + d + "</td></tr>";
}

const deleteBtn = document.querySelectorAll('.row_entry'),
      heading = document.querySelector('.heading');
let c=1;

deleteBtn.forEach(item => {
    heading.innerHTML = (`<h3> ${deleteBtn.length} Entries Found </h3>`);
    item.addEventListener("click", (e) => {
        if (e.target.matches('.img')) {
            let objectNum = item.dataset.objectid;
            heading.innerHTML = (`<h3> ${deleteBtn.length-c} Entries Found </h3>`);
            c ++;

            //SEND CALL API ELEMENT ID NUMBER TO BACKEND TO DELETE FROM DB        
            fetch("/delelement/" + JSON.stringify(objectNum),
                {
                    method: "POST",
                })
                .then(function (res) {
                    if (res.status == 200) {
                        let row = e.target.parentElement.parentElement;
                        row.remove();
                    }
                    return res.json();
                }).catch((error) => {
                    console.log(error);
                });
        }
    });
});
