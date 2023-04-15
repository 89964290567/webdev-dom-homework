
let host = 'https://webdev-hw-api.vercel.app/api/v2/raisa/comments';
function fetchGet() {
    return fetch(host, {
        method: "GET",

    })
        .then((response) => {
            if (response.status === 500) throw new Error("Нет интернета");
            return response.json();
        })
}

function fetchPost(comment, token) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
        text: comment
        }),
        headers: {
         Authorization: token,
        },
    }).then((response) => {
        if (response.status === 401) throw new Error("нет авторизации");
        if (response.status === 400) throw new Error("Короткий текст");
        if (response.status === 500) throw new Error("Сервер упал");
    });
}
function fetchClick(login, password){
    return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login: login,
            password : password,
        }),
    }).then((response)=> {
        if (response.status === 401) throw new Error("нет авторизации");
        if (response.status === 400) throw new Error("Неверный логин или пароль");
        if (response.status === 500) throw new Error("Сервер упал");
        return response.json();
    })  
}
function registerUserRe(name, login, password) {
    return fetch("https://webdev-hw-api.vercel.app/api/user", {
        method: "POST",
        body: JSON.stringify({
            login: login,
            name: name,
            password: password,
        }),
    }).then((response) => {
        if (response.status === 401) throw new Error("нет авторизации");
        if (response.status === 400) throw new Error("Такой пользователь уже существует");
         if (response.status === 500) throw new Error("Сервер упал");
         return response.json();
    });
}




export { fetchGet, fetchPost, fetchClick, registerUserRe }; // import пишем в начале кода а export в конец.