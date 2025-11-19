import { usersList } from "./user.js";
import { groupKey } from "./adminUsers.js";


console.log(usersList);

usersList.forEach(user => {
    document.body.innerHTML += `
    
    <div id="${user.id}">
    
        <img src="https://sukkergris.onrender.com/images/${groupKey}/users/${user.thumb}"/><br/>
        User ID : ${user.id} <br/>
        Username : ${user.username} <br/>
        Full Name : ${user.full_name} <br/>
        Street : ${user.street} <br/>
        City : ${user.city} <br/>
        Zip Code : ${user.zipcode} <br/>
        Country : ${user.country} <br/>

    </div>
    <br/>
    <hr/>
    <br/>

    `;
});

//------------------------------------------------------------------------------------------------------------