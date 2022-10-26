import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously} from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc, query, where} from "firebase/firestore";
import { join } from "lodash";
import { cookieJar, enableNavigation } from "./global.js";

enableNavigation();

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

let h1 = document.querySelector("h1"),
    nameInput = document.querySelector("#nameInput"),
    formSubmitButton = document.querySelector("#formSubmitButton"),
    formBackButton = document.querySelector("#formBackButton"),
    formSections = rsvpForm.querySelectorAll("section"),
    selectionList = document.querySelector("#selectionList"); 

formSubmitButton.addEventListener("click", () => {
  if(window.innerWidth < 800) {
    let main = document.querySelector("main");
    let title = main.querySelector("h1");
    main.style.cssText = "transition: 750ms; top: 0; background-color: var(--background-color);";
    title.style.cssText = "transition: 1000ms; margin-bottom: 28px;";
    
  }
});

formSubmitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  advanceForm();
});

document.addEventListener("keypress", async (e) => {
  if(e.key === "Enter"){
    e.preventDefault();
    advanceForm();
  }
});

formBackButton.addEventListener("click", (e) => {
  e.preventDefault();
  let active = getActive(formSections);
  formSections[active--].classList.add("hidden");
  formSections[active].classList.remove("hidden");
  showBackButton(active);
});

function getActive(sections){
  let active;
  sections.forEach((section, i) => {
    if(!section.classList.contains("hidden")) active = i;
  });
  return active;
}

function showBackButton(active) {
  if(active === 0) formBackButton.classList.add("hidden");
  else formBackButton.classList.remove("hidden");

  if(formSections[active].id === "saveTheDate") {
    h1.innerHTML = "save the date";
    formSubmitButton.innerHTML = "start rsvp";
  }

  if(formSections[active].id === "claimYourInvitation") {
    h1.innerHTML = "claim your invitation";
    formSubmitButton.innerHTML = "next step";
    nameInput.focus();
  }

  if(formSections[active].id === "updateStatus") {
    h1.innerHTML = "mark those attending";
    formSubmitButton.innerHTML = "next step";
  }

  if(formSections[active].id === "submissionConfirmation") {
    h1.innerHTML = "please confirm";
    formBackButton.innerHTML = "change";
    formSubmitButton.innerHTML = "submit rsvp";
  }

  if(formSections[active].id === "nextSteps") {
    h1.innerHTML = "thank you";
    document.querySelector("#formActions").classList.add("hidden");
  }
}

async function advanceForm() {
  let active = getActive(formSections);

  formSections[active++].classList.add("hidden");
  formSections[active].classList.remove("hidden");
  showBackButton(active);

  if(formSections[active].id === "claimYourInvitation") {
    h1.innerHTML = "claim your invitation";
    let searchParams = new URLSearchParams(window.location.search),
        autofillGuest = searchParams.get("guest");
    if(autofillGuest) {
      nameInput.value = autofillGuest;
    }

    formSubmitButton.innerHTML = "next step";
    nameInput.focus();
  }

  let party = {};// { names: ["",...], details: [{},...]}
  if(formSections[active].id === "updateStatus") {

    let loadingIcon = document.querySelector("#updateStatus .loading");

    loadingIcon.classList.remove("hidden");

    let name = removeTrailingSpace(String(nameInput.value).toLowerCase());

    cookieJar("name", String(nameInput.value).toLowerCase(), "strict");
    
    party = await getParty(name); // { names: ["",...], details: [{},...]}

    party.names.forEach((guest, i) => {
      let newListItem = document.createElement("li"),
          newLabel = document.createElement("label"),
          newCheckbox = document.createElement("input"),
          newInputId = window.crypto.getRandomValues(new Uint32Array(0))[0],
          newContent = document.createTextNode(`${++i}. ${guest}`);

      setTimeout(() => {
        
        loadingIcon.classList.add("hidden");

        newLabel.setAttribute("for", newInputId);
        newLabel.appendChild(newContent);
        newCheckbox.setAttribute("type", "checkbox");
        newCheckbox.setAttribute("id", newInputId);
        newCheckbox.setAttribute("name", guest);

        newListItem.appendChild(newLabel);
        newListItem.appendChild(newCheckbox);
        selectionList.appendChild(newListItem);
      }, 1500);
    });
  }

  if(formSections[active].id === "submissionConfirmation") {
    setTimeout(() => {

      let confirmation = document.querySelector("#submissionConfirmation");
      while (confirmation.firstChild) confirmation.removeChild(confirmation.firstChild);    

      selectionList.querySelectorAll("input").forEach((guest, i) => {
        let newDiv = document.createElement("div"),
            nameBox = document.createElement("div"),
            statusBox = document.createElement("div"),
            newName = document.createTextNode(`${++i}. ${guest.name}`),
            newStatus = document.createTextNode(guest.checked ? "Attending" : "Not Attending");
        nameBox.appendChild(newName);
        statusBox.appendChild(newStatus);
        newDiv.classList.add("row");
        nameBox.classList.add("displayName");
        statusBox.classList.add("displayStatus");
        newDiv.appendChild(nameBox);
        newDiv.appendChild(statusBox);
        confirmation.appendChild(newDiv);
      });
    }, 500);
  }

  if(formSections[active].id === "nextSteps") {

    let attending = [],
        notAttending = [];

    document.querySelectorAll("#updateStatus li input[type=checkbox]").forEach(entry => {
      if(entry.checked) attending.push(entry.name);
      if(!entry.checked) notAttending.push(entry.name);
    });

    if(attending.length > 0){
      let guests = await getDocs(query(collection(db, "guests"), where("name", "in", attending)));
      guests.forEach(async (guest) => {
        await setDoc(doc(collection(db, "guests"), guest.id), {
          // add document fields
              attending: true
        }, { merge: true });
      });
    }

    if(notAttending.length > 0) {
      let guests = await getDocs(query(collection(db, "guests"), where("name", "in", notAttending)));
        guests.forEach(async (guest) => {
          await setDoc(doc(collection(db, "guests"), guest.id), {
            // add document fields
                attending: false
          }, { merge: true });
        });
    }
  }
}

async function getParty(name) {

  while (selectionList.firstChild) selectionList.removeChild(selectionList.firstChild);

  try {

    let querySnapshot = await getDocs(query(collection(db, "guests"), where("name", "==", name))),
      party = [],
      guests = [];

    querySnapshot.forEach((doc, i) => {
      if(i > 0) {
        throw new Error("Database error.");
      } else {
        party.push(...doc.data().party);
      }
    });

    if(party.length > 0) {
      querySnapshot = await getDocs(query(collection(db, "guests"), where("name", "in", party)));
        querySnapshot.forEach(doc => {
          guests.push(doc.data());
        });
    }

    return {
      names: party,
      details: guests
    };

  } catch (err) {
    // ! create error dialog and prompt user to start remedy
    console.log(err);
  }
}

function removeTrailingSpace(str) {
  let array = String(str).split(" ");
  console.log(array);
  return array.length > 2 ? `${ array[0] } ${array[1]}` : str;
}