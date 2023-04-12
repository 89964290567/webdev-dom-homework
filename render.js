import { click } from "./script.js";
function registerUser(registerElement,checkEnter) {
    
    switch (checkEnter) {
        case "enter":
            registerElement.innerHTML = `
        <input id="login" type="text" placeholder="Введите логин" >
        <input id="password" type="text" placeholder="Введите пароль" >
        <button id="enterButton" class="add-form-button">Войти</button>
        <button id="registrButton" class="add-form-button">Зарегистрироваться</button>
        `
            break;
        case "registr":
            registerElement.innerHTML = `
        <input id="name" type="text" placeholder="Введите имя" >
        <input id="login" type="text" placeholder="Введите логин" >
        <input id="password" type="text" placeholder="Введите пароль" >
        <button id="registrButton" class="add-form-button">Зарегистрироваться</button>
        <button id="enterButton" class="add-form-button">Войти</button>
        
    `
            break;
        default:
            break;
    }
    click();
}



export {registerUser};