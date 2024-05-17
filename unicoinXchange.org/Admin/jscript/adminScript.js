if(window.location.pathname === '/unicoinXchange.org/Admin/html/adminAuth.html'){

        const createAcctLink = document.getElementById("create-acct-btn");
        const forgotCodeLink = document.getElementById("forgot-code-btn");
        const returnToLoginLink = document.getElementById("return-login"); 

        // SWITCH AUTHENTICATION FORM
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

        // NOTIFICATION POPUP MODAL
        const modal = document.getElementById("popup");
        const closeModalBtn = document.getElementById("close-modal");

        const openPopup = () => {
            const navigate = JSON.parse(sessionStorage.getItem("notificationMsg"));
            
            if(window.location.pathname === '/unicoinXchange.org/index.html'){
                modal.style.top = "64%";
            }

            console.log("Status: ", navigate.status)
            if(navigate.status === "error"){
                modal.children[0].src = "../img/error.png"
                modal.children[1].innerHTML = "Error!!!"
                modal.children[2].innerHTML = navigate.message
                modal.children[1].classList.add("error");
                modal.children[3].classList.add("btnErr");
                modal.classList.add("open-popup");
            }
            if(navigate.status === "success"){
                modal.children[0].src = "../img/check.png"
                modal.children[1].innerHTML = "Thank You!"
                modal.children[2].innerHTML = navigate.message
                modal.children[1].classList.add("success");
                modal.children[3].classList.add("btnSuccess");
                modal.classList.add("open-popup");
            }
        };

        closeModalBtn && closeModalBtn.addEventListener("click", () => {
            const registrationForm = document.querySelector(".registration-form");
            const otpForm = document.querySelector(".otp-form");
            const forgotForm = document.querySelector(".forgot-password-form");
            const resetForm = document.querySelector(".reset-password-form");

            const navigate = JSON.parse(sessionStorage.getItem("notificationMsg"))
            
            modal.classList.remove("open-popup");
            if(navigate.status === "error") return;

            if(navigate.formId === "reg"){
                registrationForm.style.display = "none";  
                otpForm.style.display = "block";
             }
             if(navigate.formId === "forgotPass"){
                forgotForm.style.display = "none";
                resetForm.style.display = "block";
             };

             sessionStorage.removeItem("notificationMsg");
            if(navigate.location !== null) window.location.href = navigate.location;  
        });

        // STORE JWT TO LOCAL STORAGE
        const storeJWT = (JWTToken, userData) => {
            localStorage.setItem("adminJwtToken", JWTToken);
            localStorage.setItem("adminData", JSON.stringify(userData));
        };

        // ADMIN REGISTRATION
        const registrationForm = document.querySelector(".registration-form");

        // SET POPUP MESSAGE
        const setPopUpMsg = (message, location, status, formId) => {
            
            const notification = {
                status:status,
                message:message,
                location:location,
                formId:formId
            };

            sessionStorage.setItem("notificationMsg", JSON.stringify(notification));
            openPopup();
        };

        const register = () => {
            const fullName = document.getElementById("full-name");
            const emailAddress = document.getElementById("email-address");
            const password = document.getElementById("passcode");
            const passwordConfirm = document.getElementById("passcodeConfirm");

            axios.post("http://127.0.0.1:7000/api/v1/admin/adminSignUp", {
                name: fullName.value.trim(),
                email: emailAddress.value.trim(),
                password: password.value.trim(),
                passwordConfirm: passwordConfirm.value.trim(),
            }).then(res => {
                res.data.status === "success";
                const formId = "reg"
                const status = "success"
                const message = res.data.message;
                setPopUpMsg(message, null, status, formId);
            }).catch(err => {
                const status = "error"
                const message = err.message;
                setPopUpMsg(message, null, status, null);
            });
        };

        registrationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            register();
        });

        // USER VERIFY OTP TOKEN
        const otpForm = document.querySelector(".otp-form");

        const verifyOtp = () => {
            const otp = document.getElementById("otp");

            axios.post("http://127.0.0.1:7000/api/v1/admin/adminVerifyOTP",{
                otp:otp.value.trim()
            }).then(res => {
                res.data.status === "success";
                storeJWT(res.data.JWTToken, res.data.data.user);
                const status = "success"
                const message = res.data.message;
                const location = 'admin.html'
                setPopUpMsg(message, location, status, null)
            }).catch(err => {
                console.log(err);
                const status = "error"
                const message = err.message;
                setPopUpMsg(message, null, status, null)
            });
        };

        otpForm && otpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            verifyOtp();
        });

        // USER LOGIN
        const loginForm = document.querySelector(".login-form");

        const login = () => {
            const loginEmail = document.getElementById("email-address2");
            const loginPassword = document.getElementById("password");

            axios.post("http://127.0.0.1:7000/api/v1/admin/adminLogin", {
                email: loginEmail.value.trim(),
                password: loginPassword.value.trim()
            }).then(res => {
                res.data.status === "success";
                storeJWT(res.data.JWTToken, res.data.data.user);
                const status = "success"
                const message = res.data.message;
                const location = 'admin.html'
                setPopUpMsg(message, location, status, null)
            }).catch(err => {
                console.log(err);
                const status = "error"
                const message = err.response.data.message;
                setPopUpMsg(message, null, status, null)
            });
        };

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });


        // FORGOT PASSWORD

        const forgotPasswordForm = document.getElementById("forgotPassword");

        const forgotPassword = () => {
            const forgotPassEmail = document.getElementById("forgot-pass-mail");

            axios.post("http://127.0.0.1:7000/api/v1/admin/adminForgetPassword", {
                email:forgotPassEmail.value.trim()
            }).then(res => {
                const formId = "forgotPass"
                const status = "success"
                const message = res.data.message;
                setPopUpMsg(message, null, status, formId)
            }).catch(err => {
                const status = "error"
                const message = err.message;
                setPopUpMsg(message, null, status, null)
            });
        };

        forgotPasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();
            forgotPassword();
        });

        // RESET PASSWORD FORM
        const resetPasswordForm = document.getElementById("resetPassword");

        const resetPassword = () => {
            const resetPassOtp = document.getElementById("admin-otp");
            const newPass = document.getElementById("admin-password");
            const confirmResetPass = document.getElementById("admin-confirm-password");

            axios.patch("http://127.0.0.1:7000/api/v1/admin/adminResetPassword", {
                otp: resetPassOtp.value.trim(),
                password: newPass.value.trim(),
                passwordConfirm: confirmResetPass.value.trim()
            }).then(res => {
                res.data.status === "success"
                storeJWT(res.data.JWTToken, res.data.data.user);
                window.location.href = 'admin.html';
            }).catch(err => {
                console.log(err);
            });
        }

        resetPasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();
            resetPassword();
        })
}


// MAIN ADMIN DASHBOARD
if(window.location.pathname === '/unicoinXchange.org/Admin/html/admin.html'){

    const displayUsers = (users) => {
        
        const userCardsWrap = document.querySelector(".user-cards-wrap");
        
        Array.from(users).map(user => {
            const card = document.createElement("div");
            const userIcon = document.createElement("i");
            const name = document.createElement("h5");
            const role = document.createElement("p");
            const userId = document.createElement("p")
            const btn1 = document.createElement("button");
            const btn2 = document.createElement("button");
            const btn3 = document.createElement("button");
            const deleteIcon = document.createElement("i");

            card.classList.add("user-card");
            userId.classList.add("userId");
            btn1.classList.add("card-btn");
            btn2.classList.add("card-btn");
            btn3.classList.add("card-btn");
            userIcon.classList.add("fa");
            userIcon.classList.add("fa-user");
            name.innerText = user.name;
            userId.innerText = user._id;
            role.innerText = user.role;
            btn1.innerText = "Update Client Investment Amount";
            btn2.innerText = "Activate Client Investment";
            btn3.innerText = "De-activate Client Investment";
            deleteIcon.classList.add("fa");
            deleteIcon.classList.add("fa-trash");

            card.appendChild(userIcon)
            card.appendChild(name)
            card.appendChild(userId)
            card.appendChild(role)
            card.appendChild(btn1)
            card.appendChild(btn2)
            card.appendChild(btn3)
            card.appendChild(deleteIcon)
            userCardsWrap.appendChild(card);
        })

        const delBtn = document.getElementById("del-client");
        delBtn.addEventListener("click", () => {
          const cards = document.querySelectorAll(".user-card");
          Array.from(cards).map(card => {
            const trashBtn = card.querySelector(".fa-trash");
            const btns = card.querySelectorAll(".card-btn")

            trashBtn.classList.toggle("active-trash")

            Array.from(btns).map(btn => {
                btn.classList.toggle("active-card-btn")
            })
          })

          if(delBtn.innerText === "Delete Client"){
            delBtn.innerText = "Cancel..."
          }else{
            delBtn.innerText = "Delete Client"
          }
        })

        const updateAdminDetailsForm = document.querySelector(".update-admin-details-form");
        const updateAdminPasswordForm = document.querySelector(".update-Admin-password-form");

        updateAdminDetailsForm.style.display = "none";
        updateAdminPasswordForm.style.display = "none";

        retriveCards(users)
    };

      // UPDATE CLIENT INVESTMENT AMOUNT
      const updateClientInvesmentAmtForm = (userId) => {

        const userCardsWrap = document.querySelector(".user-cards-wrap");
        const updateAdminDetailsForm = document.querySelector(".update-admin-details-form");
        const adminsCard = document.querySelector(".admins-card");
        const updateAdminPasswordForm = document.querySelector(".update-Admin-password-form");
        const UpdateCliInvestForm = document.querySelector(".update-cli-inv-form");
        const delBtn = document.getElementById("del-client");

        userCardsWrap.style.display = "none";
        updateAdminDetailsForm.style.display = "none";
        updateAdminPasswordForm.style.display = "none";
        adminsCard.style.display = "none";
        UpdateCliInvestForm.style.display = "block";
        delBtn.style.display = "none";

        const jwtToken = localStorage.getItem("adminJwtToken")

        UpdateCliInvestForm.addEventListener("submit", (e) => {
            e.preventDefault();
        
            const amount = document.getElementById("ammount");
            const coin = document.getElementById("coin-type");

            axios.post(`http://127.0.0.1:7000/api/v1/admin/setUserInvestmentAmount/${userId}`,{
                amount: amount.value.trim(),
                paymentMode: coin.value.trim(),
            },{
                headers: {
                    "Content-Type" : 'application/json',
                    "Authorization" : `Bearer ${jwtToken}`
            }}).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        });
      };

      const activateClientInvesment = (userId) => {
        const jwtToken = localStorage.getItem("adminJwtToken")
        console.log(jwtToken)
        console.log(userId)
        axios.post(`http://127.0.0.1:7000/api/v1/admin/activateUserInvestment/${userId}`, {
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
      };

      const deActivateClientInvesment = (userId) => {
        const jwtToken = localStorage.getItem("adminJwtToken");
          
        axios.post(`http://127.0.0.1:7000/api/v1/admin/deactivateUserInvestment/${userId}`,{
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
      };

      const  retriveCards = () => {
        const userCardsWrap = document.querySelector(".user-cards-wrap");
        if(userCardsWrap.children !== null){
            const userCards = userCardsWrap.getElementsByClassName("user-card");
            const cardsArray = Array.from(userCards)
            cardsArray.map((card) => {
                card.addEventListener("mouseover", () => {
                    const cardBtns = card.querySelectorAll(".card-btn"); 
                    const userId = card.querySelector(".userId").innerText;

                    Array.from(cardBtns).map((cardBtn, idx) => {
                        cardBtn.addEventListener("click", (e) => {
                            e.stopImmediatePropagation()
                            if(idx === 0) updateClientInvesmentAmtForm(userId);
                            if(idx === 1) activateClientInvesment(userId);
                            if(idx === 2) deActivateClientInvesment(userId);
                        })
                    })
                })
            })
        }
    };

    const getAllUser = () => {
        const jwtToken = localStorage.getItem("adminJwtToken")
        
        axios.get("http://127.0.0.1:7000/api/v1/admin/getAllUsers", {
            headers: {
                "Content-Type" : 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            }
        }).then(res => {
            displayUsers(res.data.data.users);
        }).catch(err => {
            console.log(err);
        });
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const adminData = JSON.parse(localStorage.getItem("adminData"));
        
        const adminNameWrap = document.querySelector(".admin-user");
        adminNameWrap.children[1].innerHTML = adminData.name

        getAllUser();
    });

    // GET ALL USERS RELOAD BUTTON
    const getAllUsersReloadBtn = document.getElementById("get-all-user");

    getAllUsersReloadBtn.addEventListener("click", () => {
        window.location.reload();
    });

    // GET ALL ADMIN
    const displayAdmin = (admins) => {
        const adminsCard = document.querySelector(".admins-card");

        Array.from(admins).map(admin => {
            const adminCard = document.createElement("div");
            const adminIcon = document.createElement("i");
            const adminName = document.createElement("h3");
            const role = document.createElement("p");
            const delBtn = document.createElement("button");

            adminCard.classList.add("adminCard");
            adminIcon.classList.add("fa");
            adminIcon.classList.add("fa-user");
            adminName.innerText = admin.name;
            role.innerText = admin.role;
            delBtn.innerText = "delete Admin";

            adminCard.appendChild(adminIcon);
            adminCard.appendChild(adminName);
            adminCard.appendChild(role);
            adminCard.appendChild(delBtn);

            adminsCard.appendChild(adminCard);
        })

        // if(admins.length < 2){
        //     adminsCard.style.
        // }
    };

    const getAllAdminBtn = document.getElementById("get-all-admin");
    const delBtn = document.getElementById("del-client");

    getAllAdminBtn.addEventListener("click", () => {
        const jwtToken = localStorage.getItem("adminJwtToken");

        axios.get("http://127.0.0.1:7000/api/v1/admin/getAllAdmin",{
            headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            }
        }).then(res => {
            displayAdmin(res.data.data.DataTransferItem);
        }).catch(err => {
            console.log(err);
        });

        const userCardsWrap = document.querySelector(".user-cards-wrap");
        const updateAdminDetailsForm = document.querySelector(".update-admin-details-form");
        const adminsCard = document.querySelector(".admins-card");
        const updateAdminPasswordForm = document.querySelector(".update-Admin-password-form");
        const UpdateCliInvestForm = document.querySelector(".update-cli-inv-form");

        userCardsWrap.style.display = "none";
        updateAdminDetailsForm.style.display = "none";
        updateAdminPasswordForm.style.display = "none";
        UpdateCliInvestForm.style.display = "none";

        getAllAdminBtn.style.display = "none";
        delBtn.style.display = "none";

        if(adminsCard.style.display === "none") adminsCard.style.display = "flex";
    });

    // UPDATE ADMIN DETAILS
    const updateAdminDetailsBtn = document.getElementById("update-admin-details");
    
    updateAdminDetailsBtn.addEventListener("click", () => {
        
        const adminsCard = document.querySelector(".admins-card");
        const userCardsWrap = document.querySelector(".user-cards-wrap");
        const getAllAdminBtn = document.getElementById("get-all-admin");
        const updateAdminDetailsForm = document.querySelector(".update-admin-details-form");
        const updateAdminPasswordForm = document.querySelector(".update-Admin-password-form");
        const UpdateCliInvestForm = document.querySelector(".update-cli-inv-form");
        const delBtn = document.getElementById("del-client");

        userCardsWrap.style.display = "none";
        adminsCard.style.display = "none";
        getAllAdminBtn.style.display = "block";
        updateAdminPasswordForm.style.display = "none";
        UpdateCliInvestForm.style.display = "none";
        delBtn.style.display = "none";
        updateAdminDetailsForm.style.display = "block";

        const jwtToken = localStorage.getItem("adminJwtToken");

        updateAdminDetailsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fullName = document.getElementById("full-name");
            const emailAddress = document.getElementById("email-address");

            console.log(fullName.value);
            console.log(emailAddress.value);

            axios.patch(`http://127.0.0.1:7000/api/v1/admin/`,{
                    name: fullName.value.trim(),
                    email: emailAddress.value.trim(),
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization" : `Bearer ${jwtToken}`
                    }
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        })
    })

    // UPDATE ADMIN PASSWORD
    const updateAdminPassword = document.getElementById("update-admin-password");

    updateAdminPassword.addEventListener("click", () => {

        const adminsCard = document.querySelector(".admins-card");
        const userCardsWrap = document.querySelector(".user-cards-wrap");
        const getAllAdminBtn = document.getElementById("get-all-admin");
        const updateAdminDetailsForm = document.querySelector(".update-admin-details-form");
        const updateAdminPasswordForm = document.querySelector(".update-Admin-password-form");
        const UpdateCliInvestForm = document.querySelector(".update-cli-inv-form");
        const delBtn = document.getElementById("del-client");

        userCardsWrap.style.display = "none";
        adminsCard.style.display = "none";
        getAllAdminBtn.style.display = "block";
        updateAdminDetailsForm.style.display = "none";
        updateAdminPasswordForm.style.display = "block";
        UpdateCliInvestForm.style.display = "none"; 
        delBtn.style.display = "none";

        const jwtToken = localStorage.getItem("adminJwtToken");

        updateAdminPasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const currentPassword = document.getElementById("current-password");
            const newPassword = document.getElementById("new-password");
            const confirmPassword = document.getElementById("confirm-password");

            axios.patch(`http://127.0.0.1:7000/api/v1/admin/adminUpdatePassword`,{
                    currentPassword: currentPassword.value.trim(),
                    password: newPassword.value.trim(),
                    passwordConfirm: confirmPassword.value.trim(),
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization" : `Bearer ${jwtToken}`
                    }
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
        });
    });

    // LOGOUT
    const logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("adminJwtToken");
        localStorage.removeItem("adminData");
        window.location.href =  'adminAuth.html';
    });
}
