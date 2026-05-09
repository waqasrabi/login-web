// LOGIN
  
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    let response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

   let data = await response.json();

let msg = document.getElementById("loginMessage");
msg.innerText = data.message;

msg.style.color = data.success ? "green" : "red";

// 🚀 REDIRECT ON SUCCESS
if (data.success) {
  localStorage.setItem("token", data.token);

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}
    if (data.success) {
  document.getElementById("loginForm").reset();
}

  } catch (error) {
    document.getElementById("loginMessage").innerText = "Server error";
  }
});


// SIGNUP
document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
console.log("here");
  try {
    let response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
   

    let data = await response.json();

    let msg = document.getElementById("signupMessage");
    msg.innerText = data.message;

    msg.style.color = data.message.includes("created") ? "green" : "red";

  } catch (error) {
    document.getElementById("signupMessage").innerText = "Server error";
  }
});


