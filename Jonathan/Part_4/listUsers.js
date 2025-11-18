async function loadData() {

    try {
        let response = await fetch("https://sukkergris.onrender.com/products?category?key=ABKGYB48");
        checkData = await response.json();

        console.log(checkData);

    } 
    
    catch (error) {
        console.log("something went wrong: ", error);
    };

};

loadData();

/*
const username = "augustus.gloop@sukkergris.no";
const password = "laffytaffy";
*/

function createBasicAuthString(username, password) {
    const combinedStr = `${username}:${password}`;
    const b64 = btoa(combinedStr);
    //return "Basic " + b64; // stor B!
    console.log("Basic " + b64);
  };

createBasicAuthString();
