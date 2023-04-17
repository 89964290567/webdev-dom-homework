import { fetchGet, fetchPost, fetchClick, registerUserRe } from "./api.js"  // import пишем в начале кода а export в конец.
import { registerUser } from "./render.js"
import { format } from "date-fns";
import _ from 'lodash';
//import { renderComments } from "./render.js"  // import пишем в начале кода а export в конец.
//import { renderLoginComponent } from "./components./login-comments.js";
const listElement = document.getElementById("list");
const commentInputElement = document.getElementById('comment-input');
const buttonElement = document.getElementById('add-button');
const registerElement = document.getElementById('app');
const commentsElement = document.getElementById("comment-input");





let checkEnter = "enter";
//console.log(checkEnter);
buttonElement.addEventListener("click", addComments);

let comments;

let token;

fetchAndRenderComments();
//get запрос


function fetchAndRenderComments() {
    return fetchGet()  // Тут мы вызываем функцию fetchGet из api.js и после того как получим от нее ответ идут все последующие .then.
        .then((responseData) => {

            comments = responseData.comments;
            renderComments();
            registerUser(registerElement, checkEnter);
            //click();//функция вызовать кнопка
        })
        .catch((error) => {
            alert("Проверьте подключение к интернету");
            return console.log(error);
        })
}
function click() {
    const registrButton = document.getElementById('registrButton');
    //const nameElement = document.getElementById('name');
    const enterButton = document.getElementById('enterButton');
    const addFormElement = document.getElementById("form");

    enterButton.addEventListener('click', () => {
        switch (checkEnter) {
            case "enter":
                const loginEnterElement = document.getElementById('login');
                const passwordEnterElement = document.getElementById('password');

                if (loginEnterElement.value === "" || passwordEnterElement.value === "") {
                    alert("Имя или Login не могут быть пустыми");
                    return;
                    //checkEnter = "registr";
                }
                fetchClick(loginEnterElement.value, passwordEnterElement.value)
                .then((response) => {
                    console.log(response);
                    token = `Bearer ${response.user.token}`;
                    addFormElement.classList.remove("-display-none");
                    registerElement.classList.add("-display-none");
                })
                .catch((error) =>{
                    alert("Не верный логин или пароль");
                })
            return;
                break;
            case "registr":
                checkEnter = "enter";
                registerUser = (registerElement,checkEnter);
            default:
                break;
        }
    })

    registrButton.addEventListener('click', () => {
        switch (checkEnter) {
            case "enter":
                console.log("ggg");
                checkEnter = "registr";
                registerUser(registerElement,checkEnter);

                break;
            case "registr":
                console.log();
                const nameElement = document.getElementById('name');
                const loginEnterElement = document.getElementById('login');
                const passwordEnterElement = document.getElementById('password');
                console.log(nameElement, loginEnterElement, passwordEnterElement);
                registerUserRe(_.capitalize(nameElement.value), loginEnterElement.value, passwordEnterElement.value)
                .then((response) => {
                    console.log(response);
                    token = `Bearer ${response.user.token}`;
                    addFormElement.classList.remove("-display-none");
                    registerElement.classList.add("-display-none");
                    registerUser(registerElement,checkEnter);
                })
                .catch((error) => {
                       alert("Такой пользователь уже существует")
                        return console.log(error);
                    })
            default:
                break;
        }

    })
}

//1. навесить обр кликов на войти через id
//2. нажав на кнопку отправить запрос в апи на авторизацию (логин и  пароль) документация апи через feth ссылку, метод POST, в теле логин и пароль
//3.из полученных данных вытащить JSON и записать в переменную токен responseJSON

//Рендер функция
function renderComments() {

    listElement.innerHTML = comments.map((user, index) => {
        return `<li id="list" class="comment">
      <div class="comment-header">
        <div>${user.author.name}</div>
        <div>${format(new Date(user.date), "yyyy-MM-dd hh.mm.ss")}</div>
      </div>
      <div class="comment-body"> 
         <div class="comment-text" data-index="${index}">
            ${user.text}
        </div>
      </div>
      <div class="comment-footer">
        <button data-index="${index}" class="delete-button">Удалить</button>
        <div class="likes">
          <span class="likes-counter">${user.likes}</span>
          <button data-index="${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
        </div> 
      </div>
    </li>`;
    }).join("");
    checkClick(); // Здесь вызывается функция (находиться на 123 строчке) которая отслеживает нажатия на все кнопки, каждый раз после рендера.
};


//Добавление комментария, POST запрос с GET

//renderComments(comments);
function addComments() {

    commentInputElement.classList.remove("error");

    if (!commentInputElement.value) {
        commentInputElement.classList.add("error");
        return;
    };

    buttonElement.disabled = true;
    buttonElement.textContent = 'Элемент добавляется...';

    fetchPost(commentInputElement.value, token) // Тут вызывается функция fetchPost из api.js туда мы передаем значения имени и коммента. После того как получим от нее ответ идут все последующие .then.

        .then(() => {
            return fetchAndRenderComments();
        })
        .then(() => {
            buttonElement.disabled = false;
            buttonElement.textContent = 'Добавить';
            commentsElement.value = '';
        })
        .catch((error) => {
            buttonElement.disabled = false;
            buttonElement.textContent = 'Добавить';
            if (error.message === 'Короткий текст') {
                alert("name и text должны содержать хотя бы 3 символа");
            }
            if (error.message === 'Сервер упал') {
                alert("Сервер упал");
            }
            if (error.message === "нет авторизации") {
                alert('Вы не авторизованы')
            }
            return;
        });
}



function checkClick() {
    const touchComments = listElement.querySelectorAll(".comment-text");
    const deleteButtons = document.querySelectorAll(".delete-button");
    const likeButtons = document.querySelectorAll('.like-button');
    // ответ на комментарии
    for (const comment of touchComments) {
        comment.addEventListener("click", () => {
            const index = comment.dataset.index;
            commentInputElement.value = `>${comments[index].text} \n ${comments[index].name},`
            renderComments();
        });
    }

    for (let deleteButton of deleteButtons) {
        const index = deleteButton.dataset.index;
        deleteButton.addEventListener('click', () => {
            console.log(comments[index]);
            delete comments[index];
            renderComments();
        });
    };

    for (let likeButton of likeButtons) {

        likeButton.addEventListener('click', () => {
            const index = likeButton.dataset.index;

            if (!comments[index].isLiked) {
                comments[index].isLiked = true;
                comments[index].likesCount += 1;

            } else if (comments[index].isLiked === true) {
                comments[index].isLiked = false;
                comments[index].likesCount -= 1;
            }

            renderComments();
        })
    };
}


export { click };

 //buttonElement.addEventListener("click", addComments) // Таким способом мы вызываем функцию addComments при клике на кнопку написать. В твоем коде не было addEventListener, по этому на всякий объяснил если вдруг раньше не использовала.
    //const appEl = document.getElementById("app");
    // if (!token) {
    //     renderLoginComponent({
    //         comments,
    //         appEl,
    //         setToken: (newToken) => {
    //             token = newToken;
    //         },
    //         renderComments,
    //     });
    //     return;
    // }



