import {checkClick} from "./script.js"
function renderComments(comments, listElement) {
    const commentsHtml = comments.map((user, index) => {
        return `<li id="list" class="comment">
          <div class="comment-header">
            <div>${user.name}</div>
            <div>${user.date}</div>
          </div>
          <div class="comment-body"> 
             <div class="comment-text" data-index="${index}">
                ${user.text}
            </div>
          </div>
          <div class="comment-footer">
            <button data-index="${index}" class="delete-button">Удалить</button>
            <div class="likes">
              <span class="likes-counter">${user.likesCount}</span>
              <button data-index="${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
            </div> 
          </div>
        </li>`;
    }).join("");

    listElement.innerHTML = commentsHtml;

    checkClick(); // Здесь вызывается функция (находиться на 123 строчке) которая отслеживает нажатия на все кнопки, каждый раз после рендера.
};
export { renderComments }; // import пишем в начале кода а export в конец.

