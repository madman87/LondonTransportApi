"use strict";


const callapiBtn = document.getElementById('callapi'),
      databox = document.querySelector('.myBox');
      

if (callapiBtn) {callapiBtn.addEventListener('click', async (e) => {

    const response = await fetch('https://api.tfl.gov.uk/StopPoint/490009333W/arrivals');
    const myJson = await response.json(); //extract JSON from the http response

    console.log(Object.keys(myJson));

    let arr = [];

    for (var i in myJson) {
        var key = i;
        var val = myJson[i];
        const date = myJson[i].expectedArrival.substring(0,10),
              time = myJson[i].expectedArrival.substring(11,19);

        arr.push(`Transport No ${myJson[i].vehicleId} towards ${myJson[i].towards} expected to arrive at ${time} ${date} <br/>`);
    }

    databox.innerHTML = arr.join(' ');
    
    //SEND CALL API DATA TO BACKEND
    var data = new FormData(); //FORM DATA SEND
    data.append("json", JSON.stringify(myJson));

    fetch("/getdata",
        {
            method: "POST",
            body: data,
        })
        .then(function (res) {
            return res.json();
        });
    
});}

const deleteBtn = document.querySelectorAll('.list-group-item');
for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", (e) => {
        if (e.target.matches('.img')) {

        const startIndex=deleteBtn[i].innerHTML.indexOf("('"),
              endIndex=deleteBtn[i].innerHTML.indexOf("),"),
              objectNum=deleteBtn[i].innerHTML.substring(startIndex+2,endIndex-1);

        //SEND CALL API ELEMENT ID NUMBER TO BACKEND TO DELETE FROM DB        
        fetch("/delelement/"+JSON.stringify(objectNum),
            {
                method: "POST",
            })
            .then(function (res) {
                return res.json();
            });
        
        deleteBtn[i].style.display="none";
        }
    });
}


