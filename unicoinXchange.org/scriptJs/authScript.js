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


// STORE JWT TO LOCAL STORAGE
const storeJWT = (JWTToken, userData) => {
    localStorage.setItem("jwtToken", JWTToken);
    localStorage.setItem("userData", JSON.stringify(userData));
}

// CHECK IS USER HAS LOGGED IN OR HIS LOGGED IN
window.addEventListener("load", () => {
    // localStorage.removeItem("jwtToken");
    loadUser();
})

const loadUser = () => {
    const registerMenu = document.querySelector(".top-right");
    const dashMenu = document.querySelector(".dashboard-btn") 
    const JwtToken = localStorage.getItem("jwtToken") !== null;
    const userInfo = JSON.parse(localStorage.getItem("userData"));

    if (JwtToken) {
        registerMenu && registerMenu.classList.add('auth-menu');
        if(dashMenu) dashMenu.children[1].innerHTML = userInfo.name;
        dashMenu && dashMenu.classList.add("flex-btn");
    }else{
        console.log("User is not logged in");
    }
}

// USER REGISTRATION
const register = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userSignUp", {
        name: fullname.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        passwordConfirm: passwordConfirm.value.trim(),
    }).then(res => {
        res.data.status === "success"
        window.location.href = 'otp.html';
    }).catch(err => {
        console.log(err)
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
        res.data.status === "success"
        storeJWT(res.data.JWTToken, res.data.data.user);
        window.location.href = 'index.html';
    }).catch(err => {
        console.log(err)
    })
}

otpForm && otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        verifyOtp()
    });

// USER LOGIN
const login = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userLogIn", {
        email: loginEmail.value.trim(),
        password: loginPassword.value.trim()
    }).then(res => {
        res.data.status === "success"
        storeJWT(res.data.JWTToken, res.data.data.user);
        window.location.href = 'index.html';
    }).catch(err => {
        console.log(err)
    })
};

loginForm && loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
})

// FORGOT PASSWORD
const forgetPassword = () => {
    axios.post("http://127.0.0.1:7000/api/v1/users/userForgetPassword", {
        email: forgotPassEmail.value.trim()
    }).then(res => {
        res.data.status === "success"
        window.location.href = "resetPassword.html"
    }).catch(res => {
        console.log(res)
    })
};

forgotPassForm && forgotPassForm.addEventListener("submit", (e) => {
    e.preventDefault();
    forgetPassword();
});

// RESET PASSWORD
const resetPassword = () => {
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
    })
}

resetPasswordForm && resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    resetPassword();
})


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
}

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

const populateDashboard = (data) => {
    
    const profileName = document.getElementById("profile_name");
    const investMentStatus = document.querySelector(".global");
    const acctBlc = document.getElementById("acct-blc");
    const bonus = document.getElementById("bonus");
    const totalDeposit = document.getElementById("total-deposit");
    const totalWithdraw = document.getElementById("total-withdraw");

    let totAmt = 0;
    data.data.transactionHistory.map(el => totAmt += el.amount);

    profileName.innerHTML = data.data.name;
    acctBlc.children[1].firstElementChild.innerHTML = data.data.investmentPlan.amount;
    bonus.children[1].firstElementChild.innerHTML = data.data.investmentPlan.referralBonus;
    totalDeposit.children[1].firstElementChild.innerHTML = totAmt;
    totalWithdraw.children[1].firstElementChild.innerHTML = data.data.investmentPlan.amount;
    
    if(data.data.investmentStatus === false){
        investMentStatus.firstElementChild.innerHTML = "You do not have an Active Investment"
    }else{
        investMentStatus.firstElementChild.innerHTML = "Your Investment is Active"
    }
};

if(window.location.pathname === '/unicoinXchange.org/page/dashboard.html'){

// GET USER 
document.addEventListener('DOMContentLoaded', () => {
    const jwtToken = localStorage.getItem("jwtToken")
    axios.get("http://127.0.0.1:7000/api/v1/users/", {
        headers: {
            'Content-Type': 'application/json',
            "Authorization" : `Bearer ${jwtToken}`
        }
    })
    .then(res => {
        res.data.status === "successful";
        populateDashboard(res.data.data)
    }).catch(err => {
        console.log(err);
    });

    // callCryptoApi();
    launchAnimation();
  });

    // EDIT USER DETAILS FUNCTION
    const dashNavigationBtn = document.querySelector(".dashboard-nav");
    const subMenu = document.querySelector(".update-details")

    dashNavigationBtn.children[3].addEventListener("click", () => {
        subMenu.classList.toggle("active-sub-menu")
    })

    // DISPLAY EDIT DETAILS FORM
    subMenu.children[0].addEventListener("click", () => {
        console.log("CLICK IS WORKING");
    });

    subMenu.children[1].addEventListener("click", () => {
        console.log("CLICK IS WORKING !!!");
    });
}

dashboardBtn && dashboardBtn.addEventListener("click", () => {
    window.location.href = 'page/dashboard.html';
});

// CREATE INVESTMENT
const investNowBtn = document.querySelectorAll(".table-footer");

const postInvetment = (name, duration, referralBonus, totalReturn) => {
    const jwtToken = localStorage.getItem("jwtToken")
    axios.post("http://127.0.0.1:7000/api/v1/investment/createInvestment", {
        name:name.innerText,
        duration: duration[0],
        referralBonus: referralBonus,
        totalReturn: totalReturn
    },{
    headers: {
        'Content-Type': 'application/json',
        "Authorization" : `Bearer ${jwtToken}`
    }}).then(res => {
        res.data.status = "success";
        window.location.href = 'page/selectWallet.html';
    }).catch(err => {
        console.log(err);
    });
}

const rookiePlan = () => {
    const name = document.getElementById("rookie-plan");
    const durationDays = document.getElementById("rookie-duration");
    const referralBonusPercent = document.getElementById("rookie-bonus");
    const totalReturnPercent = document.getElementById("rookie-return");

    const duration = durationDays.innerText.split(' ')
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const intermediatePlan = () => {
    const name = document.getElementById("Intermediate-plan");
    const durationDays = document.getElementById("intermediate-duration");
    const referralBonusPercent = document.getElementById("intermediate-bonus");
    const totalReturnPercent = document.getElementById("intermediate-return");

    const duration = durationDays.innerText.split(' ')
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const professionalPlan = () => {
    const name = document.getElementById("professional-plan");
    const durationDays = document.getElementById("professional-duration");
    const referralBonusPercent = document.getElementById("professional-bonus");
    const totalReturnPercent = document.getElementById("professional-return");

    const duration = durationDays.innerText.split(' ')
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

const masterPlan = () => {
    const name = document.getElementById("master-plan");
    const durationDays = document.getElementById("master-duration");
    const referralBonusPercent = document.getElementById("master-bonus");
    const totalReturnPercent = document.getElementById("master-return");

    const duration = durationDays.innerText.split(' ')
    const referralBonus = referralBonusPercent.innerText.substring(0, referralBonusPercent.innerText.length - 1);
    const totalReturn = totalReturnPercent.innerText.substring(0, totalReturnPercent.innerText.length - 1);

    postInvetment(name, duration, referralBonus, totalReturn);
};

Array.from(investNowBtn).map((btn, idx) => {
    btn.addEventListener("click", () => {
        if(localStorage.getItem("jwtToken") === null) {
            alert("you are not logged in");
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
        
        
        imgTag.classList.add("bar-code")
    
        if(cryptoCoin === "bitcoin"){
            const bitcoinAddress = "bc1qcpesecg6vnpzpz5pxvw58v2jequmnnptlxpt65"

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
            const ethereumAddress = "0xd82fdA8bb8381784BC26778B81694cD59Ae4c605"

            coinName.innerText = cryptoCoin;
            imgTag.src = "../fronta/images/barcodes/ethereum.jpeg";
            barContainer.appendChild(imgTag);
            cryptoInput.value = ethereumAddress;
        }else if(cryptoCoin === "binance"){
            const binanceAddress = "0xd82fdA8bb8381784BC26778B81694cD59Ae4c605"

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
    })

})




