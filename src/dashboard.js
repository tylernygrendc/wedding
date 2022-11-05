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
    let options = document.querySelectorAll("#functions button");
    options[0].addEventListener("click", () => {
        getAllGuests();
    })
});

// Show all guests and attending status

async function getAllGuests() {

    let querySnapshot = await getDocs(collection(db, "guests"));

    let table = document.querySelector("#output");
    
    while(table.firstChild) table.removeChild(table.firstChild);

    querySnapshot.forEach(doc => {
        let newRow = document.createElement("tr");
        for(var prop in doc.data()){
            let newCell = document.createElement("td").appendChild(document.createTextNode(prop));
            newRow.appendChild(newCell);
        }
        table.appendChild(newCell);
    });
}
// Show all registry items and purchase status, with purchased by name
