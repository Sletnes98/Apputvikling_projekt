import { usersList } from "./userList.js";
import { deleteUser, groupKey } from "./adminUsers.js";


console.log(usersList);

const userListContainer = document.getElementById("userListContainer");


usersList.forEach(user => {
    userListContainer.innerHTML += `
    

        <div id="${user.id}" class="userContainer">
        
            <img src="https://sukkergris.onrender.com/images/${groupKey}/users/${user.thumb}"/><br/>
            User ID : ${user.id} <br/>
            Username : ${user.username} <br/>
            Full Name : ${user.full_name} <br/>
            Street : ${user.street} <br/>
            City : ${user.city} <br/>
            Zip Code : ${user.zipcode} <br/>
            Country : ${user.country} <br/>

            <button class="delete-btn" data-id="${user.id}">×</button>
            <br/>
            
        </div>

    `;
    userListContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const userId = event.target.dataset.id;
            deleteUser(userId);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        }
    });
});



//------------------------------------------------------------------------------------------------------------