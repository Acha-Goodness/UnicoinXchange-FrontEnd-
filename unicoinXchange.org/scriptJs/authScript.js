const fullname = document.getElementById("full-name");
const email = document.getElementById("email-address");
const password = document.getElementById("passcode");
const passwordConfirm = document.getElementById("passcodeConfirm");
const formOne = document.getElementById("registerForm");
const otpForm = document.getElementById("otpForm");
const otp = document.getElementById("user-otp");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("useremail");
const loginPassword = document.getElementById("login-passcode");
const forgotPassForm = document.getElementById("forgotPassword");
const forgotPassEmail = document.getElementById("user-email");
const resetPasswordForm = document.getElementById("resetPassword");
const resetPassOtp = document.getElementById("user-otp");
const resetPass = document.getElementById("user-password");
const confirmResetPass = document.getElementById("user-confirm-password");
const dashboardBtn = document.querySelector(".dashboard-btn");


// NOTIFICATION POPUP MODAL
const modal = document.getElementById("popup");
const closeModalBtn = document.getElementById("close-modal");

const openPopup = () => {
    const navigate = JSON.parse(sessionStorage.getItem("notificationMsg"));
    
    if(window.location.pathname === '/unicoinXchange.org/index.html'){
        modal.style.top = "64%";
    }

    if(navigate.status === "error"){
        modal.children[0].src = "./fronta/images/icons/error.png"
        modal.children[1].innerHTML = "Error!!!"
        modal.children[2].innerHTML = navigate.message
        modal.children[1].classList.add("error");
        modal.children[3].classList.add("btnErr");
        modal.classList.add("open-popup")
    }
    if(navigate.status === "success"){
        modal.children[0].src = "./fronta/images/icons/check.png"
        modal.children[1].innerHTML = "Thank You!"
        modal.children[2].innerHTML = navigate.message
        modal.children[1].classList.add("success");
        modal.children[3].classList.add("btnSuccess");
        modal.classList.add("open-popup");
    }
};

closeModalBtn && closeModalBtn.addEventListener("click", () => {
    const navigate = JSON.parse(sessionStorage.getItem("notificationMsg"))
    
    modal.classList.remove("open-popup");
    if(navigate.status === "error") return;
    window.location.href = navigate.location;  
});

// STORE JWT TO LOCAL STORAGE
const storeJWT = (JWTToken, userData) => {
    localStorage.setItem("jwtToken", JWTToken);
    localStorage.setItem("userData", JSON.stringify(userData));
};

// CHECK IS USER HAS LOGGED IN OR HIS LOGGED IN
window.addEventListener("load", () => {
    loadUser();
});

const loadUser = () => {
    const registerMenu = document.querySelector(".top-right");
    const dashMenu = document.querySelector(".dashboard-btn");
    const bannerBtn = document.querySelectorAll(".btn-box");
    const JwtToken = localStorage.getItem("jwtToken") !== null;
    const userInfo = JSON.parse(localStorage.getItem("userData"));

    if (JwtToken) {
        registerMenu && registerMenu.classList.add('auth-menu');
        Array.from(bannerBtn).map(btn => btn.classList.add("banner-btn"));
        if(dashMenu) dashMenu.children[1].innerHTML = userInfo.name;
        dashMenu && dashMenu.classList.add("flex-btn");
    }else{
        console.log("User is not logged in");
    };
};

// USER REGISTRATION
const eye = document.querySelector(".fa-eye");
const eyeSlash = document.querySelector(".fa-eye-slash");
const confirmEye = document.querySelector(".con-eye");
const confirmSlashEye = document.querySelector(".con-slash-eye");

    eye && eye.addEventListener("click", () => {
        password && password.setAttribute('type', 'text');
        loginPassword && loginPassword.setAttribute('type', 'text');
        resetPass && resetPass.setAttribute('type', 'text');

        eye.style.display = "none";
        eyeSlash.style.display = "block";
    });

    eyeSlash && eyeSlash.addEventListener("click", () => {
        password && password.setAttribute('type', 'password');
        loginPassword && loginPassword.setAttribute('type', 'password');
        resetPass && resetPass.setAttribute('type', 'password');
    
        eyeSlash.style.display = "none";
        eye.style.display = "block";
    });

    confirmEye && confirmEye.addEventListener("click", () => {
        passwordConfirm && passwordConfirm.setAttribute('type', 'text');
        confirmResetPass && confirmResetPass.setAttribute('type', 'text');

        confirmEye.style.display = "none";
        confirmSlashEye.style.display = "block";
    });

    confirmSlashEye && confirmSlashEye.addEventListener("click", () => {
        passwordConfirm && passwordConfirm.setAttribute('type', 'password');
        confirmResetPass && confirmResetPass.setAttribute('type', 'password');

        confirmSlashEye.style.display = "none";
        confirmEye.style.display = "block";
    })

const setPopUpMsg = (message, location, status) => {
    
    const notification = {
        status:status,
        message:message,
        location:location
    }
    sessionStorage.setItem("notificationMsg", JSON.stringify(notification));
    openPopup();
};

const register = () => {
    if(password.value !== passwordConfirm.value){
        const errMsg = document.querySelector(".pass-err-msg")
        errMsg.innerText = "Passwords must be the same";
        return;
    }

    axios.post("http://127.0.0.1:7000/api/v1/users/userSignUp", {
        name: fullname.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        passwordConfirm: passwordConfirm.value.trim(),
    }).then(res => {
        res.data.status === "success";
        const status = "success"
        const message = res.data.message;
        const location = 'otp.html'
        setPopUpMsg(message, location, status)
    }).catch(err => {
        console.log(err);
        const status = "error"
        const message = err.response.data.message;
        setPopUpMsg(message, null, status)
    });
};

formOne && formOne.addEventListener("submit", (e) => {
    e.preventDefault();
    register();
});

// USER VERIFY OTP TOKEN
const verifyOtp = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userVerifyOTP",{
        otp:otp.value.trim()
    }).then(res => {
        res.data.status === "success";
        storeJWT(res.data.JWTToken, res.data.data.user);
        const status = "success"
        const message = res.data.message;
        const location = 'index.html'
        setPopUpMsg(message, location, status)
    }).catch(err => {
        console.log(err);
        const status = "error"
        const message = err.response.data.message;
        setPopUpMsg(message, null, status)
    });
};

otpForm && otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    verifyOtp();
});

// USER LOGIN
const login = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userLogIn", {
        email: loginEmail.value.trim(),
        password: loginPassword.value.trim()
    }).then(res => {
        res.data.status === "success";
        storeJWT(res.data.JWTToken, res.data.data.user);
        const status = "success"
        const message = res.data.message;
        const location = 'index.html'
        setPopUpMsg(message, location, status)
    }).catch(err => {
        console.log(err);
        const status = "error"
        const message = err.response.data.message;
        setPopUpMsg(message, null, status)
    });
};

loginForm && loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

// FORGOT PASSWORD
const forgetPassword = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userForgetPassword", {
        email: forgotPassEmail.value.trim()
    }).then(res => {
        res.data.status === "success";
        window.location.href = "resetPassword.html";
    }).catch(res => {
        console.log(res);
    });
};

forgotPassForm && forgotPassForm.addEventListener("submit", (e) => {
    e.preventDefault();
    forgetPassword();
});

// RESET PASSWORD
const resetPassword = () => {
    if(resetPass.value !== confirmResetPass.value){
        const errMsg = document.querySelector(".pass-err-msg")
        errMsg.innerText = "Passwords must be the same";
        return;
    }

    axios.patch("http://127.0.0.1:7000/api/v1/users/userResetPassword", {
        otp: resetPassOtp.value.trim(),
        password: resetPass.value.trim(),
        passwordConfirm: confirmResetPass.value.trim()
    }).then(res => {
        res.data.status === "success"
        storeJWT(res.data.JWTToken, res.data.data.user);
        window.location.href = '../index.html';
    }).catch(err => {
        console.log(err);
    });
};

resetPasswordForm && resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    resetPassword();
});


// VIEW DASH BOARD
const launchAnimation = () => {
    // DASHBOARD SCROLLER EFFECT
    const scrollers = document.querySelectorAll(".scroller");

    const addAnimation = () => {
        scrollers.forEach((scroller) => {
            scroller.setAttribute("data-animated", true);
            
            const scrollerInner = scroller.querySelector(".scroller_inner");
            const scrollerContent = Array.from(scrollerInner.children);
        
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                console.log(duplicatedItem);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    };  

    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        addAnimation();
    };
};

const displayCryptoPrice = (cryptoData) => {
    const scrollerInner = document.querySelector(".scroller_inner");
    const btcPrice = document.querySelector(".main-balance");
 
    btcPrice.children[0].innerText = cryptoData[0].current_price

    Array.from(cryptoData).slice(0, 100).map(coin => {
        const divTag = document.createElement("div")
        const imgTag = document.createElement("img");
        const nameTag = document.createElement("p");
        const priceTag = document.createElement("p");

        divTag.classList.add("price_wrap");

        imgTag.src = coin.image;
        nameTag.innerText = coin.name;
        priceTag.innerText = coin.current_price

        divTag.appendChild(imgTag);
        divTag.appendChild(nameTag);
        divTag.appendChild(priceTag);
        scrollerInner.appendChild(divTag);
    });
};

const callCryptoApi = () => {
    axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",{
        headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': 'CG-zGftTZgAAAyggEeVzoFogaob'
        }
    })
    .then(res => {
        res.data.status === 200;
        displayCryptoPrice(res.data);
    }).catch(err => {
        console.log(err);
    });
};

const  populateHistory = (data) => {
    const historyBoard = document.querySelector(".history-board");
    data.data.transactionHistory.map(transc => {
        const div = document.createElement("div");
        const currTag = document.createElement("p");
        const dateTag = document.createElement("p");
        const amtTag = document.createElement("p");

        div.classList.add("transactions")

        currTag.innerText = transc.paymentMode;
        dateTag.innerText = transc.TransactionDate;
        amtTag.innerText =  transc.amount;

        div.appendChild(currTag);
        div.appendChild(dateTag);
        div.appendChild(amtTag)
        historyBoard.appendChild(div);
    });
};

const populateDashboard = (data) => {
    const profileName = document.getElementById("profile_name");
    const investMentStatus = document.querySelector(".global");
    const acctBlc = document.getElementById("acct-blc");
    const bonus = document.getElementById("bonus");
    const totalDeposit = document.getElementById("total-deposit");
    const totalWithdraw = document.getElementById("total-withdraw");
    const availableProfit = document.getElementById("total-profit");


    let totAmt = 0;
    data.data.transactionHistory.map(el => totAmt += el.amount);

    profileName.innerHTML = data.data.name;
    totalDeposit.children[1].firstElementChild.innerHTML = totAmt;

    if(data.data.investmentPlan !== undefined){
        acctBlc.children[1].firstElementChild.innerHTML = data.data.investmentPlan.amount;
        bonus.children[1].firstElementChild.innerHTML = data.data.investmentPlan.referralBonus;
        totalWithdraw.children[1].firstElementChild.innerHTML = data.data.investmentPlan.amount;
        availableProfit.children[1].firstElementChild.innerHTML = data.data.investmentPlan.amount - 2000;
    };
    
    if(data.data.investmentStatus === false){
        investMentStatus.firstElementChild.innerHTML = "You do not have an Active Investment"
    }else{
        investMentStatus.firstElementChild.innerHTML = "Your Investment is Active"
    }

    populateHistory(data);
};

const authenticateEditForms = (editUserDetailsForm, editUserPasswordForm) => {
    
    editUserDetailsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");

        const fullName = document.getElementById("full-name");
        const emailAddress = document.getElementById("email-address");

        axios.patch("http://127.0.0.1:7000/api/v1/users/", {
            name: fullName.value.trim(),
            email: emailAddress.value.trim(),
        },{
            headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
        }}
        ).then(res => {
            localStorage.removeItem("userData");
            localStorage.setItem("userData", JSON.stringify(res.data.data.user));
            loadUser();
            editUserDetailsForm.classList.remove("active-password-form");
        }).catch(err => {
            console.log(err);
        });
    });

    editUserPasswordForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const jwtToken = localStorage.getItem("jwtToken");

        const currentPass = document.getElementById("current-password");
        const newPassword = document.getElementById("new-password");
        const confirmPassword = document.getElementById("confirm-password");

        if(newPassword.value !== confirmPassword.value){
            const errMsg = document.querySelector(".pass-err-msg")
            errMsg.innerText = "Passwords must be the same";
            return;
        }

        axios.patch("http://127.0.0.1:7000/api/v1/users/userUpdatePassword", {
                currentPassword: currentPass.value.trim(),
                password: newPassword.value.trim(),
                passwordConfirm: confirmPassword.value.trim(),
            },{headers: {
                "Content-Type": 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            }}
        ).then(res => {
            localStorage.setItem("jwtToken", res.data.JWTToken);
            editUserPasswordForm.classList.remove("active-password-form");
        }).catch(err => {
            console.log(err);
        });
    });
};

if(window.location.pathname === '/unicoinXchange.org/page/dashboard.html'){
// GET USER 
let data;
document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = localStorage.getItem("jwtToken")
    axios.get("http://127.0.0.1:7000/api/v1/users/", {
        headers: {
            "Content-Type": 'application/json',
            "Authorization" : `Bearer ${jwtToken}`
        }
    })
    .then(res => {
        res.data.status === "successful";
        data = res.data.data
        populateDashboard(res.data.data)
    }).catch(err => {
        console.log(err);
    });

    callCryptoApi();
    launchAnimation();
  });

    // EDIT USER DETAILS FUNCTION
    const dashNavigationBtn = document.querySelector(".dashboard-nav");
    const subMenu = document.querySelector(".update-details");

    dashNavigationBtn.children[3].addEventListener("click", () => {
        subMenu.classList.toggle("active-sub-menu");
    });

    // DISPLAY EDIT DETAILS FORM
    const updateDetailsForm = document.querySelector(".details-form");
    const updatePasswordForm = document.querySelector(".password-form");
    const historyBoard = document.querySelector(".history-board");

    subMenu.children[0].addEventListener("click", () => {
        const nameInput = document.getElementById("full-name");
        const emailInput = document.getElementById("email-address");

        nameInput.placeholder = data.data.name;
        emailInput.placeholder = data.data.email;

        updateDetailsForm.classList.toggle("active-password-form");
        updatePasswordForm.classList.remove("active-password-form");
        historyBoard.classList.remove("active-his-board");
    });

    subMenu.children[1].addEventListener("click", () => {
        updatePasswordForm.classList.toggle("active-password-form");
        updateDetailsForm.classList.remove("active-password-form");
        historyBoard.classList.remove("active-his-board");
    });

    dashNavigationBtn.children[2].addEventListener("click", () => {
        historyBoard.classList.toggle("active-his-board");
        subMenu.classList.remove("active-sub-menu");
        updateDetailsForm.classList.remove("active-password-form");
        updatePasswordForm.classList.remove("active-password-form");
    });


    // CLOSE USER EDIT PANEL
    const detailsPanelExit = document.getElementById("details-exit");

    detailsPanelExit.addEventListener("click", () => {
        updateDetailsForm.classList.remove("active-password-form");
    });

    // CLOSE USER EDIT PASSWORD PANEL
    const passwordPanelExit = document.getElementById("exit-Password");

    passwordPanelExit.addEventListener("click", () => {
        updatePasswordForm.classList.remove("active-password-form");
    });

    // LOGOUT
    const logoutBtn = document.getElementById("logout");

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("jwtToken");
        window.location.href =  '../index.html';
    });

     // AUTHENTICATE EDIT FORMS
     authenticateEditForms(updateDetailsForm, updatePasswordForm);

    // USER DASHBOARD SHOW PASSWORD

    // CURRENT PASS WORD
    const currentPassEye = document.querySelector(".fa-eye");
    const currPassSlashEye = document.querySelector(".fa-eye-slash");
    const currentPassInput = document.getElementById("current-password");

    currentPassEye && currentPassEye.addEventListener("click", () => {
        currentPassInput.setAttribute("type", "text");
        currentPassEye.style.display = "none";
        currPassSlashEye.style.display = "block"
    });

    currPassSlashEye && currPassSlashEye.addEventListener("click", () => {
        currentPassInput.setAttribute("type", "password");
        currPassSlashEye.style.display = "none"
        currentPassEye.style.display = "block";
        
    })

    // // NEW PASSWORD
    const newPassEye = document.querySelector(".new-pass-eye");
    const newPassSlashEye = document.querySelector(".new-pass-slash-eye");
    const newPasswordInput = document.getElementById("new-password");

    newPassEye && newPassEye.addEventListener("click", () => {
        newPasswordInput.setAttribute("type", "text");
        newPassEye.style.display = "none";
        newPassSlashEye.style.display = "block"
    });

    newPassSlashEye && newPassSlashEye.addEventListener("click", () => {
        newPasswordInput.setAttribute("type", "password");
        newPassSlashEye.style.display = "none"
        newPassEye.style.display = "block";
        
    })

    // // CONFIRM PASSWORD
    const confirmEyePass = document.querySelector(".confirm-eye-pass");
    const confirmEyePassSlash = document.querySelector(".confirm-eye-pass-slash");
    const confirmPasswordInput = document.getElementById("confirm-password");

    confirmEyePass && confirmEyePass.addEventListener("click", () => {
        confirmPasswordInput.setAttribute("type", "text");
        confirmEyePass.style.display = "none";
        confirmEyePassSlash.style.display = "block"
    });

    confirmEyePassSlash && confirmEyePassSlash.addEventListener("click", () => {
        confirmPasswordInput.setAttribute("type", "password");
        confirmEyePassSlash.style.display = "none"
        confirmEyePass.style.display = "block"; 
    })
};

dashboardBtn && dashboardBtn.addEventListener("click", () => {
    if(window.location.pathname === '/unicoinXchange.org/index.html' || window.location.pathname === '/unicoinXchange.org/investments.html'){
        window.location.href = 'page/dashboard.html';
    }else if(window.location.pathname === '/unicoinXchange.org/page/about-us.html' || 
             window.location.pathname === '/unicoinXchange.org/page/faqs.html' || 
             window.location.pathname === '/unicoinXchange.org/page/contact-us.html' || 
             window.location.pathname === '/unicoinXchange.org/page/privacy-policy.html' || 
             window.location.pathname === '/unicoinXchange.org/page/terms-and-condition.html' ||
             window.location.pathname === '/unicoinXchange.org/page/dashboard.html' ||
             window.location.pathname === '/unicoinXchange.org/page/select-wallet.html' ||
             window.location.pathname === '/unicoinXchange.org/page/copy-crypto-address.html'
            ){
        window.location.href = './dashboard.html';
    };
});

// CREATE INVESTMENT
const investNowBtn = document.querySelectorAll(".table-footer");

const postInvetment = (name, duration, referralBonus, totalReturn) => {
    const jwtToken = localStorage.getItem("jwtToken");
    axios.post("http://127.0.0.1:7000/api/v1/investment/createInvestment", {
        name:name.innerText.trim(),
        duration: duration[0].trim(),
        referralBonus: referralBonus.trim(),
        totalReturn: totalReturn.trim()
    },{
    headers: {
        "Content-Type": 'application/json',
        "Authorization" : `Bearer ${jwtToken}`
    }}).then(res => {
        res.data.status === "success";
        console.log(res.data.message)
        const status = "success"
        const message = res.data.message;
        const location = './page/select-wallet.html'
        setPopUpMsg(message, location, status)
    }).catch(err => {
        console.log(err);
        const status = "error"
        const message = err.response.data.message;
        setPopUpMsg(message, null, status)
    });
};

const rookiePlan = () => {
    const name = document.getElementById("rookie-plan");
    const durationDays = document.getElementById("rookie-duration");
    const referralBonusPercent = document.getElementById("rookie-bonus");
    const totalReturnPercent = document.getElementById("rookie-return");

    const duration = durationDays.innerText.split(' ');
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const intermediatePlan = () => {
    const name = document.getElementById("Intermediate-plan");
    const durationDays = document.getElementById("intermediate-duration");
    const referralBonusPercent = document.getElementById("intermediate-bonus");
    const totalReturnPercent = document.getElementById("intermediate-return");

    const duration = durationDays.innerText.split(' ');
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const professionalPlan = () => {
    const name = document.getElementById("professional-plan");
    const durationDays = document.getElementById("professional-duration");
    const referralBonusPercent = document.getElementById("professional-bonus");
    const totalReturnPercent = document.getElementById("professional-return");

    const duration = durationDays.innerText.split(' ');
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const masterPlan = () => {
    const name = document.getElementById("master-plan");
    const durationDays = document.getElementById("master-duration");
    const referralBonusPercent = document.getElementById("master-bonus");
    const totalReturnPercent = document.getElementById("master-return");

    const duration = durationDays.innerText.split(' ');
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

Array.from(investNowBtn).map((btn, idx) => {
    btn.addEventListener("click", () => {
        if(localStorage.getItem("jwtToken") === null) {
            const status = "error"
            const message = "you are not logged in";
            setPopUpMsg(message, null, status);
            return;
        };
        if(idx === 0) rookiePlan();
        if(idx === 1) intermediatePlan();
        if(idx === 2) professionalPlan();
        if(idx === 3) masterPlan();
    });
});

// SELECT CRYPTO WALLET ADDRESS
if(window.location.pathname === '/unicoinXchange.org/page/copy-crypto-address.html'){
        const barContainer = document.getElementById("bar-code-container");
        const cryptoInput = document.getElementById("coin-address");
        const coinName = document.getElementById("coin-name");

        const cryptoCoin = sessionStorage.getItem("coin");

        const imgTag = document.createElement("img");
        
        imgTag.classList.add("bar-code");
    
        if(cryptoCoin === "bitcoin"){
            const bitcoinAddress = "bc1qcpesecg6vnpzpz5pxvw58v2jequmnnptlxpt65";

            coinName.innerText = cryptoCoin;
            imgTag.src = "../fronta/images/barcodes/bitcoin.jpeg";
            barContainer.appendChild(imgTag);
            cryptoInput.value = bitcoinAddress;
        }else if(cryptoCoin === "litecoin"){
            const litecoinAddress = "ltc1qqekqwan2cwuzmfylh5jkxd0ypmf5pgat43fgah";

            coinName.innerText = cryptoCoin;
            imgTag.src = "../fronta/images/barcodes/litecoin.jpeg";
            barContainer.appendChild(imgTag);
            cryptoInput.value = litecoinAddress;
        }else if(cryptoCoin === "ethereum"){
            const ethereumAddress = "0xd82fdA8bb8381784BC26778B81694cD59Ae4c605";

            coinName.innerText = cryptoCoin;
            imgTag.src = "../fronta/images/barcodes/ethereum.jpeg";
            barContainer.appendChild(imgTag);
            cryptoInput.value = ethereumAddress;
        }else if(cryptoCoin === "binance"){
            const binanceAddress = "0xd82fdA8bb8381784BC26778B81694cD59Ae4c605";

            coinName.innerText = cryptoCoin;
            imgTag.src = "../fronta/images/barcodes/binance.jpeg";
            barContainer.appendChild(imgTag);
            cryptoInput.value = binanceAddress;
        }
};

if(window.location.pathname === '/unicoinXchange.org/page/select-wallet.html'){
    document.addEventListener('DOMContentLoaded', () => {
       const cryptoCard = document.querySelectorAll(".wallet-card");

       Array.from(cryptoCard).map((card, idx) => {
        cryptoCard && card.addEventListener("click", () => {
            window.location.href = 'copy-crypto-address.html';
            if(idx === 0) sessionStorage.setItem("coin", "bitcoin");
            if(idx === 1) sessionStorage.setItem("coin", "litecoin");
            if(idx === 2) sessionStorage.setItem("coin", "ethereum");
            if(idx === 3) sessionStorage.setItem("coin", "binance");
         });
       });
  });
};

// COPY ADDRESS FUNCTION
const copyBtn = document.getElementById("copy-icon");

copyBtn && copyBtn.addEventListener("click", () => {
    const cryptoInput = document.getElementById("coin-address");

    cryptoInput.select();

    navigator.clipboard.writeText(cryptoInput.value)
    .then(() => {
        const msg = document.getElementById("message");
        msg.innerText = "Text copied to clipboard";
    });
});

// CONTACT PAGE FORM INTEGRATION
if(window.location.pathname === '/unicoinXchange.org/page/contact-us.html'){
    const contactForm = document.querySelector(".contact-form");
    const contactSubBtn = document.querySelector(".submit-form")
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const number = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        contactSubBtn.children[0].style.display = "inline-block"

        axios.post("http://127.0.0.1:7000/api/v1/admin/createContact", {
            name:name.value.trim(),
            email:email.value.trim(),
            phoneNumber:number.value.trim(),
            subject:subject.value.trim(),
            message:message.value.trim()
        }).then(res => {
            console.log(res)
            name.value = ""
            email.value = ""
            number.value = ""
            subject.value = ""
            message.value = ""
            contactSubBtn.children[0].style.display = "none"
        }).catch(err => {
            console.log(err)
            contactSubBtn.children[0].style.display = "none"
        })
    });
}


