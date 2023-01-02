 async function login(e) {
    try{
    e.preventDefault();
    console.log(e.target.email.value);

    const loginDetails = {

        email: e.target.email.value,
        password: e.target.password.value

    }

    console.log(loginDetails);
    const response = await axios.post('http://localhost:4000/login', loginDetails)
            alert(response.data.message);
            window.location.href = "../expenseTrackerUsingAxios.html"
            localStorage.setItem('token', response.data.token);
    }
    catch(err) {
        console.log(JSON.stringify(err));
        document.body.innerHTML += `<div style="color: red;">${err}</div>`
    }

}

function forgotpassword() {
    window.location.href = "./forgot.html"
}