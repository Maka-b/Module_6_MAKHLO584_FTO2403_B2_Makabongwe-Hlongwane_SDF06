//imported functions 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, remove, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

//created an object (appSettings) and set its value to my Firebase database
const appSettings = {
    databaseURL : "https://realtime-database-24b37-default-rtdb.firebaseio.com/"
}
//
const app = initializeApp(appSettings)
const database = getDatabase(app)
//imported reference function
const shoppingListInDB = ref(database, "shoppingList")
//
const inputFieldEl = document.getElementById("input-field")
const addbtnEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addbtnEl.addEventListener("click", function() {
    //Checks if anything has been added to the string
    if (inputFieldEl.value) {
        let inputFieldEntry = inputFieldEl.value
    // function pushes the input value to the database
        push(shoppingListInDB, inputFieldEntry)

        //console.log(inputFieldEntry)
     
        clearBar()
    } else {
        nothingAdded()
    }
    

    
})
//whenever there is change to the database
onValue (shoppingListInDB, function(snapshot) {
  //checks to see if there are items in the database
    if (snapshot.exists()) {
       let itemsArray = Object.entries(snapshot.val())
    // we want the snapshot values as array, but paired to their unique keys 
       clearShoppingListEl()
    
       //console.log(itemsArray)
        //appends each item to the shopping list
        for (let i = 0; i < itemsArray.length; i++) {

            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            addToShoppingList(currentItem)
        } 
    }else {
        shoppingListEl.innerHTML = "no items yet..."
    }

    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
//clears user input bar
function clearBar() {
    inputFieldEl.value = ""
    inputFieldEl.placeholder = "add some more!"
}
//adds (+-) inputed values as a list in HTML
function addToShoppingList(item) {
    //shoppingListEl.innerHTML += `<li>${input}</li>`
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

   // shoppingListEl.append(newEl)

    // Delete function
    newEl.addEventListener("dblclick", function() {
        // gets the location of the dblclicked item
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function nothingAdded() {
  document.getElementById("input-field").placeholder = "Nothing added yet..."
  
}