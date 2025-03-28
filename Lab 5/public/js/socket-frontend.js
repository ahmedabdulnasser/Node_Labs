const socket = io("http://localhost:3000");
const userContainer = document.getElementById("user-container");
const msgContainer = document.getElementById("msg-container");
const msgForm = document.getElementById("send-container");
const msgInput = document.getElementById("msg-input");
socket.emit("new-user");

socket.on("chat-msg", (data) => {
  append(`${data.username}: ${data.msg}`, msgContainer, data.self);
  if (data.newUsersList) {
    userContainer.innerHTML = "";
    data.newUsersList.forEach((user) =>
      append(user, userContainer, false, "user")
    );
  }
});

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = msgInput.value;
  socket.emit("send-chat-msg", msg);
  msgInput.value = "";
});

function append(value, container, isSameUser = false, contentType = "msg") {
  const element = document.createElement("div");
  element.innerText = value;
  element.classList.add(contentType);
  isSameUser ? element.classList.add("self") : "";
  container.append(element);
}

socket.on("disconnect", () => {
  window.location.href = "/";
});
