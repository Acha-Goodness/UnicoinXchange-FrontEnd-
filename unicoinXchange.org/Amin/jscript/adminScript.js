const createAcctLink = document.getElementById("create-acct-btn");
const forgotCodeLink = document.getElementById("forgot-code-btn");
const returnToLoginLink = document.getElementById("return-login"); 

createAcctLink.addEventListener("click", () => {
    const loginForm = document.querySelector(".login-form");
    const registrationForm = document.querySelector(".registration-form");

    loginForm.style.display = "none";
    registrationForm.style.display = "block";
});

forgotCodeLink.addEventListener("click", () => {
    const loginForm = document.querySelector(".login-form");
    const forgotPassForm = document.querySelector(".forgot-password-form");

    loginForm.style.display = "none";
    forgotPassForm.style.display = "block";
});

returnToLoginLink.addEventListener("click", () => {
    const forgotPassForm = document.querySelector(".forgot-password-form");
    const loginForm = document.querySelector(".login-form");

    forgotPassForm.style.display = "none";
    loginForm.style.display = "block";
});