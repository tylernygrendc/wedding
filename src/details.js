import { enableNavigation } from "./global.js";

enableNavigation();

document.querySelectorAll(".banner").forEach((banner, i) => {
    document.addEventListener("scroll", () => {
        let viewportHeight = window.innerHeight,
            bannerHeight = Number(window.getComputedStyle(banner)
                .getPropertyValue("height").split("px")[0]),
            bannerRect = banner.getBoundingClientRect(),
            scroll = window.scrollY;
        let parallax = bannerRect.top * -0.25;
        if(bannerRect.top < viewportHeight && bannerRect.bottom > 0) {
            if(i===1) console.log(scroll, bannerRect.top, parallax);
            banner.querySelector("img").style.transform = `translateY(${parallax}px)`;
        }
    });
});