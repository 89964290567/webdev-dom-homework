import { fetchGet, fetchPost } from "./api.js"  // import пишем в начале кода а export в конец.
import { getDate } from "./data.js"  // import пишем в начале кода а export в конец.
import { renderComments } from "./render.js"  // import пишем в начале кода а export в конец.
const listElement = document.getElementById('list');
const commentInputElement = document.getElementById('comment-input');
const nameInputElement = document.getElementById('name-input');
const commentsElement = document.querySelectorAll(".comment");
const buttonElement = document.getElementById('add-button');

//const options = {
 //   year: '2-digit',
 //   month: '2-digit',
 //   day: '2-digit',
 //   timezone: 'UTC',
 //   hour: '2-digit',
 //   minute: '2-digit',

//};
let comments;

fetchAndRenderComments();

buttonElement.addEventListener("click", addComments) // Таким способом мы вызываем функцию addComments при клике на кнопку написать. В твоем коде не было addEventListener, по этому на всякий объяснил если вдруг раньше не использовала.

function fetchAndRenderComments() {
    fetchGet()  // Тут мы вызываем функцию fetchGet из api.js и после того как получим от нее ответ идут все последующие .then.
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                    date: getDate(comment),
                    text: comment.text.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
                    likesCount: comment.likes,
                    isLiked: false,
                };
            });
            comments = appComments;
            renderComments(comments, listElement);
        })
        .catch(() => {
            alert("Проверьте подключение к интернету");
        })
}

 //renderComments(comments);

function addComments() {
    nameInputElement.classList.remove("error");
    commentInputElement.classList.remove("error");

    if (!nameInputElement.value || !commentInputElement.value) {
        nameInputElement.classList.add("error"); commentInputElement.classList.add("error");
        return;
    };

    buttonElement.disabled = true;
    buttonElement.textContent = 'Элемент добавляется...';

    fetchPost(nameInputElement.value, commentInputElement.value) // Тут вызывается функция fetchPost из api.js туда мы передаем значения имени и коммента. После того как получим от нее ответ идут все последующие .then.
        .then((response) => { // Мы всегда ожидаем успешный ответ от сервера и в стандартных условиях нужно просто сделать return, а ошибки это исключения поэтому только для них нам нужно делать проверку.
            if (response.status === 400) throw new Error("Слишком коротко");
            if (response.status === 500) throw new Error("Сервер упал");
            return response.json();
        })
        .then((responseData) => {
            comments = responseData;
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
            if (error.message === 'Слишком коротко') {
                alert("name и text должны содержать хотя бы 3 символа");
            }
            if (error.message === 'Сервер упал') {
                alert("Сервер упал");
            }
            if (error.message === 'Failed to fetch') {
                alert('Нет интернета')
            }
            return;
        });
    renderComments(comments, listElement);
}

function checkClick() {
    const touchComments = listElement.querySelectorAll(".comment-text");
    const deleteButtons = document.querySelectorAll(".delete-button");
    const likeButtons = document.querySelectorAll('.like-button');

    for (const comment of touchComments) {
        comment.addEventListener("click", () => {
            const index = comment.dataset.index;
            commentInputElement.value = `>${comments[index].text} \n ${comments[index].name},`
            renderComments(comments, listElement);
        });
    }

    for (let deleteButton of deleteButtons) {
        const index = deleteButton.dataset.index;
        deleteButton.addEventListener('click', () => {
            console.log(comments[index]);
            delete comments[index];
            renderComments(comments, listElement);
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

            renderComments(comments, listElement);
        })
    };
}
export { checkClick };