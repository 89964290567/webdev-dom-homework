import {renderComments} from "./script"; 
import {comments} from  "./recuests"; 
// Добавление лайка 
 
export const addLike = () => { 
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