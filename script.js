import {comments, addComments, fetchAndRenderComments} from "./requests.js"
 export const buttonElement = document.getElementById('add-button');
 const listElement = document.getElementById('list');
 export const nameInputElement = document.getElementById('name-input');
 export const commentInputElement = document.getElementById('comment-input');
 export const commentsElement = document.querySelectorAll(".comment");
 export const likeButton = document.querySelectorAll(".like-button");



let comments = [];

//"GET" 
const fetchAndRenderComments = () => {
    fetch("https://webdev-hw-api.vercel.app/api/v1/raisa/comments", {
        method: "GET",
    }).then((response) => {
        console.log(response);
        if (response.status === 200) {
            return response.json();
        } else {
            //код который обработает ошибку
            throw new Error("Нет интернета");
        }
    }).then((responseData) => {
        const appComments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                date: new Date(comment.date).toLocaleString("ru-RU", options).replace(",", ""),
                text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                likesCount: comment.likes,
                isLiked: false,
            };
        });
        comments = appComments;
        renderComments();
    }).catch((error) => {
        alert("Проверьте подключение к интернету");
    })
}

//Ответ на коментарий


const initTouchComment = () => {
    const touchComments = listElement.querySelectorAll(".comment-text");
    for (const comment of touchComments) {
        comment.addEventListener("click", () => {
            const index = comment.dataset.index;
            commentInputElement.value = `>${comments[index].text} \n ${comments[index].name},`
            renderComments();
        });
    }
}
//Дата
const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timezone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',

};

let nowDate = new Date().toLocaleString("ru-RU", options).replace(",", "");

//получать из хранилища данных
// Функция удалить комментарий
const addDeleteComments = () => {
    const deleteButtons = document.querySelectorAll(".delete-button");
    for (let deleteButton of deleteButtons) {
        deleteButtons.addEventListener('clik', () => {
            comment.pop();
            renderComments();
        });
    };
};


// Добавление лайка

const addLike = () => {
    const likeButtons = document.querySelectorAll('.like-button');
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


const renderComments = () => {
    const commentsHtml = comments.map((user, index) => {
        return `<li id="list" class="comment">
          <div class="comment-header">
            <div>${user.name}</div>
            <div>${user.date}</div>
          </div>
          <div class="comment-body"> 
             <div  class="comment-text" data-index = "${index}">
                ${user.text}
            </div>
          </div>
          <div class="comment-footer">
            <button class="delete-button">Удалить</button>
            <div class="likes">
              <span class="likes-counter">${user.likesCount}</span>
              <button data-index = "${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
            </div> 
          </div>
        </li>`;
    }).join("");

    listElement.innerHTML = commentsHtml;

    addLike();
    initTouchComment();
};
fetchAndRenderComments();
addDeleteComments();
//addComments();
renderComments();

const addComments = () => {
    buttonElement.addEventListener("click", () => {

        nameInputElement.classList.remove("error");
        commentInputElement.classList.remove("error");

        if (!nameInputElement.value || !commentInputElement.value) {
            nameInputElement.classList.add("error"); commentInputElement.classList.add("error");
            return;
        };


        //добавлять задачу в хранилище данных
        // const stsrtAt = Date.now();
        //console.log('начинаем делать запрос');


        buttonElement.disabled = true;
        buttonElement.textContent = 'Элемент добавляется...';

        fetch("https://webdev-hw-api.vercel.app/api/v1/raisa/comments", {
            method: "POST",
            body: JSON.stringify({
                name: nameInputElement.value,
                text: commentInputElement.value,
                date: new Date(),
                forceError: true,
            }),
        }).then((response) => {
            console.log(response);
            if (response.status === 201) {
                return response.json();
                //код который обработает ошибку
            } else if (response.status === 400) {
                throw new Error("Слишком коротко");
            } else if (response.status === 500) {
                throw new Error("Сервер упал");
            }
        }).then((responseData) => {
            comments = responseData;
        }).then(() => {
            return fetchAndRenderComments();
        })
            .then((data) => {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Добавить';
                //nameElement.value = '';
                commentsElement.value = '';
            })
            .catch((error) => {
                buttonElement.disabled = false;
                buttonElement.textContent = 'Добавить';
                if (error.message === 'Слишком коротко') {
                    alert("name и text должены содержать хотя бы 3 символа");
                    return;

                } if (error.message === 'Сервер упал') {
                    alert("Сервер упал");

                    console.warn(error);
                    return;
                }
                if (error.message === 'Failed to fetch') {
                    alert('Нет интернета')
                    return;
                }

            });
        renderComments();
        

        const oldListHtml = listElement.innerHTML;
    });
}


renderComments();
addLike();
addDeleteComments();
initTouchComment();
addComments();
// Код писать здесь
console.log("It works!");