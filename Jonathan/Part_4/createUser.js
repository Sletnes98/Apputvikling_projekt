


let checkURL = `https://sukkergris.onrender.com/users`;
let checkData;

async function loadData() {

    try {
        let response = await fetch(checkURL);
        checkData = await response.json();

        console.log(checkData);



    } 
    
    catch (error) {
        console.log("something went wrong: ", error);
    };

};

loadData();