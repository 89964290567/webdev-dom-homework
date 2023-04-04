function fetchGet() {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/raisa/comments", {
        method: "GET",
    })
        .then((response) => {
            if (response.status === 500) throw new Error("Нет интернета");
            return response.json();
        })
}

function fetchPost(name, text) {
    return fetch("https://webdev-hw-api.vercel.app/api/v1/raisa/comments", {
        method: "POST",
        body: JSON.stringify({
            name: name,
            text: text,
        }),
    });
}

export { fetchGet, fetchPost }; // import пишем в начале кода а export в конец.