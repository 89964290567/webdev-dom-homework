import {buttonElement} from "./script.js" 
import { commentInputElement } from "./script.js"; 
import { nameInputElement } from "./script.js"; 
import { renderComments } from "./script.js"; 
export let comments = []; 
 
export const addComments = () => { 
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
    export const fetchAndRenderComments = () => { 
        fetch("https:/webdev-hw-api.vercel.app/api/v1/raisa/comments", { 
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
        }).catch((error)=>{ 
          alert("Проверьте подключение к интернету"); 
        }) 
      }