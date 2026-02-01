function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Simple front-end validation
  if(username === "admin" && password === "admin123") {
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect username or password");
  }
}
