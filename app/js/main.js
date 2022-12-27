"use strict"

let box = document.getElementById('wrapper');
let cols = document.querySelectorAll('.colors__col'); // Array.from(document.getElementById('colors__wrapper').children)
let lock = document.querySelectorAll('.colors__lock');

// container.addEventListener('click', function () {
//     setColor()
// })

// lock.forEach(button => {
//     console.log(button)
//     button.addEventListener('click', function (e) {
//         console.log(e)
//         if (button.firstElementChild.className === 'icon-unlocked') {
//             button.firstElementChild.classList.remove('icon-unlocked');
//             button.firstElementChild.classList.add('icon-lock');
//         } else {
//             button.firstElementChild.classList.remove('icon-lock');
//             button.firstElementChild.classList.add('icon-unlocked');
//         }
//     })
// })

document.addEventListener('click', function click(event) {
    let type = event.target.dataset.type;

    if (type === 'button' || event.target.classList.contains('icon-unlocked') || event.target.classList.contains('icon-lock')) {
        let node = event.target.tagName.toLowerCase() === 'button'
            ? event.target.firstElementChild
            : event.target
        
        node.classList.toggle('icon-unlocked');
        node.classList.toggle('icon-lock')
    }

    if (type === 'col') setColor()
    if (type === 'text') {
        copyTextByClick(event.target.textContent);
        event.target.dataset.tooltip = "скопировано!";
        setTimeout(function () {event.target.dataset.tooltip = "копировать"}, 1000)
    }

    if (type === 'hamburger') showMobileMenu()
})

function setColor (isInitial) {
    let colorsHash = isInitial ? getColorsHash() : [];

    cols.forEach((col, index) => {

        let randomColor = isInitial
          ? colorsHash.length === 0 
            ? getRandomColor() 
            : colorsHash[index] 
          : getRandomColor();
        
        let text = col.querySelector('h2');
        let icon = col.querySelector('span');

        if (icon.className === 'icon-unlocked') {
            col.style.backgroundColor = randomColor;

            text.textContent = randomColor;
            
            setTextColorFromLuminance(text, col.style.backgroundColor);
            setTextColorFromLuminance(icon, col.style.backgroundColor);

            if (!isInitial) colorsHash.push(randomColor);
        } else {
            if (!isInitial) colorsHash.push(text.textContent);
        }
        
    })
    console.log(colorsHash)
    updateColorsHash(colorsHash)
}

function getRandomColor () {
    let arrHex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let randomHex = '#';
    
    for (let i = 1; i <= 6; i++) {
        randomHex += arrHex[Math.floor(Math.random() * arrHex.length)]
    }

    return randomHex
}

function setTextColorFromLuminance (text, color) {
    let arrRGB = color.slice(4, color.length - 1).split(', '); 

    let [r, g, b] = arrRGB;

    let luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;

    text.style.color = luminance > 186 ? '#000000' : '#ffffff';
    /* 
    if ((r * 0.2126 + g * 0.7152 + b * 0.0722) > 186) {
        text.style.color = '#000000';
        icon.style.color = '#000000';
    }
    else {
        text.style.color = '#ffffff';
        icon.style.color = '#ffffff';
    } */
}

function copyTextByClick (text) {
    return navigator.clipboard.writeText(text)
}

function updateColorsHash (colors = []) {
    document.location.hash = colors.map(item => item.substring(1)).join('-');
} 

function getColorsHash () {
    if (document.location.hash.length > 1 
    && document.location.hash != '#colors' 
    && document.location.hash != '#gallery' 
    && document.location.hash != '#biography') {
        return document.location.hash.substring(1).split('-').map(item => '#' + item) 
    } else {
        return []
    }
}

setColor(true)


{
    let menu = document.getElementById('menu');

    let prevScrollPos = window.scrollY;

    window.onscroll = function () {
        let currentScrollPos = window.scrollY;
        
        if (currentScrollPos > prevScrollPos && !menu.children[0].classList.contains('menu__wrapper_active')) {
            menu.style.top = '-' + window.getComputedStyle(menu).height;
        } else {
            menu.style.top = '0px';
        }
        
        prevScrollPos = currentScrollPos;
    }
}

function smoothScroll () {
    const smoothLinks = document.querySelectorAll('a[href^="#"]');

    for (let smoothLink of smoothLinks) {
        smoothLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(smoothLink)
            const id = smoothLink.getAttribute('href').substring(1);
            console.log(id)
            document.getElementById(id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        })
    }

}

function showMobileMenu() {
    let mobileMenu = document.querySelector('.menu__wrapper');
    let hamburger = document.querySelector('.hamburger');

    hamburger.classList.toggle('hamburger__active');
    mobileMenu.classList.toggle('menu__wrapper_active');
}

smoothScroll()