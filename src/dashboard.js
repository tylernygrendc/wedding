import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously} from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc, query, where} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnUXVArtydKKlgQYxq3hCYvOVFPCGpv5I",
  authDomain: "nygrenkocsiswedding07162023.firebaseapp.com",
  projectId: "nygrenkocsiswedding07162023",
  storageBucket: "nygrenkocsiswedding07162023.appspot.com",
  messagingSenderId: "32136017443",
  appId: "1:32136017443:web:c31ec7f2b510f17c576396"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

signInAnonymously(auth);

const db = getFirestore(app);

window.addEventListener("load", () => {
    let functionSelector = document.querySelector("#functionSelector"),
        start = document.querySelector("#start");
    start.addEventListener("click", async () => {
        switch(functionSelector.value){
            case "getAllGuests":
                getAllGuests();
                break;
            case "getAttending":
                getAttending();
            case "getNotAttending":
                getAttending(false);
                break;
            case "getPurchased":
                break;
        }
    });
});

// Show all guests and attending status

async function getAllGuests() {

    let table = document.querySelector("#output");
    
    while(table.firstChild) table.removeChild(table.firstChild);

    const keys = ["name", "attending", "party"];

    let tableHead = document.createElement("thead");

    keys.forEach(key => {
        let newCell = document.createElement("td"),
            newText = document.createTextNode(key);
        newCell.appendChild(newText);
        tableHead.appendChild(newCell);
    });

    table.appendChild(tableHead);

    let querySnapshot = await getDocs(collection(db, "guests"));

    querySnapshot.forEach(doc => {

        let newRow = document.createElement("tr");
        
        keys.forEach(key => {
            let newCell = document.createElement("td"),
                newText = document.createTextNode(doc.data()[key]);
            newCell.appendChild(newText);
            newRow.appendChild(newCell);
        });
        table.appendChild(newRow);
    });

    sortTable(table);
}

async function getAttending(status=true) {

    let table = document.querySelector("#output");
    
    while(table.firstChild) table.removeChild(table.firstChild);

    const keys = ["name", "attending", "party"];

    let tableHead = document.createElement("thead");

    keys.forEach(key => {
        let newCell = document.createElement("td"),
            newText = document.createTextNode(key);
        newCell.appendChild(newText);
        tableHead.appendChild(newCell);
    });

    table.appendChild(tableHead);

    let querySnapshot = await getDocs(query(collection(db, "guests"), where("attending","==", status)));

    querySnapshot.forEach(doc => {

        let newRow = document.createElement("tr");
        
        keys.forEach(key => {
            let newCell = document.createElement("td"),
                newText = document.createTextNode(doc.data()[key]);
            newCell.appendChild(newText);
            newRow.appendChild(newCell);
        });
        table.appendChild(newRow);
    });

    sortTable(table);
}

function sortTable(table) {
let rows, sorting = true, x, y;
while (sorting) {
        sorting = false;
        rows = table.rows;
        for (let i = 0; i < (rows.length - 1); i++) {
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            if (String(x.innerHTML).split(" ")[1] > String(y.innerHTML).split(" ")[1]) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                sorting = true;
            }
        }
    }
}
