import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtimedb-c1c69-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");
// const bookListInDB = ref(database, "books");

const btnEl = document.getElementById("add-btn");
const inputEl = document.getElementById("input-field");
const shoppingListEl = document.getElementById("shopping-list");

btnEl.addEventListener("click", function () {
  let inputItem = inputEl.value;
  if(inputItem === ''){
    return
  }
  push(shoppingListInDB, inputItem);
  inputEl.value = '';
});
onValue(shoppingListInDB, function (snapshot) {
    if(!snapshot.exists()){
      shoppingListEl.textContent = 'No items here... yet'
      return
    }
  let itemsArray = Object.entries(snapshot.val());
  clearShoppingListEl();


  for (let i = 0; i < itemsArray.length; i++) {
    let currentItem = itemsArray[i]
    appendItemToShoppingListEl(currentItem);
  }
});

function appendItemToShoppingListEl(item) {
    let itemID = item[0];
    let itemValue = item[1]

    let newEl = document.createElement('li');
    newEl.textContent =`${itemValue}`
    shoppingListEl.append(newEl)

    newEl.addEventListener('dblclick', ()=> {
        let exactLocationOfItemInDB = ref(database,`shoppingList/${itemID}` )
        remove(exactLocationOfItemInDB)
    })
}
function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}
