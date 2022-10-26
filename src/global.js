import { atcb_init } from 'add-to-calendar-button';

function enableNavigation() {
    document.addEventListener('DOMContentLoaded', atcb_init, false);
    document.addEventListener('DOMContentLoaded', replaceATCBicon);

    let menuButton = document.querySelector("#menuIcon"),
        navMenu = document.querySelector("#navMenu"),
        menuItems = navMenu.querySelectorAll("li a");

    menuButton.addEventListener("click", () => {
        if(navMenu.classList.contains("hidden")){
            navMenu.classList.remove("hidden");
            menuButton.innerHTML = "menu_open";
        } else {
            navMenu.classList.add("hidden");
            menuButton.innerHTML = "menu";
        }
    });

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            setTimeout(() => {
                navMenu.classList.add("hidden");
                menuButton.innerHTML = "menu";
            }, 500);
        });
    });
}

function replaceATCBicon() {
    document.querySelectorAll(".atcb-icon").forEach(icon => {
        let newIcon = document.createTextNode("edit_calendar");
        icon.innerHTML = '';
        icon.classList.replace("atcb-icon", "material-icons");
        icon.append(newIcon);
    });
}

function cookieJar(key, pair, sameSite = "lax") {
    let parsedCookies = {};
    if(typeof pair === "string") { 
        document.cookie = `${key}=${pair};SameSite=${sameSite};`; 
        return;
    }
    else {
        try{
        let cookies = String(document.cookie).split(";");
        cookies.forEach(cookie => {
            cookie = String(cookie).split("=");
            parsedCookies[cookie[0]] = cookie[1];
            
        });
        console.log(parsedCookies[key]);
        if(typeof parsedCookies[key] === "string") return parsedCookies[key];
        // else throw(new Error());
        }
        catch (err) {
            return false;
        }
    }
}

export { enableNavigation, cookieJar };