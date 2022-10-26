import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously} from "firebase/auth";
import { getFirestore, collection, getDocs, doc, query, where, setDoc} from "firebase/firestore";
import { startCase } from "lodash";
import { enableNavigation, cookieJar } from "./global.js";

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
const registry = collection(db, "registry");

enableNavigation();

let allGifts = document.querySelectorAll(".gift"),
    checkout = document.querySelector("#checkout"),
    scrim = document.querySelector("#scrim");

let querySnapshot = await getDocs(query(registry, where("purchased", "==", true)));
    querySnapshot.forEach(doc => {
        allGifts.forEach(gift => {
            if(String(gift.querySelector("h2").innerText).toLowerCase() === doc.data().name){
                gift.style.opacity = "60%";
                gift.style.pointerEvents = "none";
            }
        });
    });

allGifts.forEach(gift => {

    gift.querySelector("button").addEventListener("click", function(){

        let username = cookieJar("name");

        if(username) { 
            checkout.querySelector("h2").innerText = "Thank you for your gift,";
            checkout.querySelector(".textInput label").classList.add("hidden");
            checkout.querySelector(".textInput input").value = startCase(username); 
        } else {
            checkout.querySelector(".textInput input").focus();
        }

        let amount = this.value,
            item = String(gift.querySelector("h2").innerText).toLowerCase(),
            paymentLink = "";

        if(item === `"in sickness" fund` || item === `"in health" fund`) {
            paymentLink = `https://www.paypal.com/donate/?business=GPWX95F3VCWCW&no_recurring=1&item_name=For+the+gift+of${" "+this.name+"."}&currency_code=USD`;
        } else {
            paymentLink = `https://www.paypal.com/donate/?business=GPWX95F3VCWCW&amount=${amount}&no_recurring=1&item_name=For+the+gift+of${" "+this.name+"."}+&currency_code=USD`;
        }
        
        document.querySelector("#redirect").href = paymentLink;

        if(checkout.classList.contains("hidden")) {
            checkout.classList.remove("hidden");
            scrim.classList.remove("hidden");

            checkout.querySelector("#redirect button").addEventListener("click", async function () {
                if(item === `"in sickness" fund` || item === `"in health" fund`){

                    let findMatch = await getDocs(query(registry, where("name", "==", item)));
                    
                        findMatch.forEach(async match => {

                            let array = match.data().purchasedBy;
                                array.push(checkout.querySelector(".textInput input").value);

                            await setDoc(doc(registry, match.id), {
                                // add document fields
                                    purchased: false,
                                    purchasedBy: array
                            }, { merge: true })
                                .then(() => { location.reload(); });
                        });
                        
                } else { 

                    let findMatch = await getDocs(query(registry, where("name", "==", item)));

                    findMatch.forEach(async match => {
                        if(match.data().purchased != true) {
                            await setDoc(doc(registry, match.id), {
                                // add document fields
                                    purchased: true,
                                    purchasedBy: checkout.querySelector(".textInput input").value
                            }, { merge: true })
                                .then(() => { location.reload(); });
                        }
                    });
                }
            });

            checkout.querySelector(".close").addEventListener("click", () => {
                checkout.classList.add("hidden");
                scrim.classList.add("hidden");
            })

            scrim.addEventListener("click", () => {
                checkout.classList.add("hidden");
                scrim.classList.add("hidden");
            });
        }
    });
});