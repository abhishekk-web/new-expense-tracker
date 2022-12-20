async function signup(e){

    try {

        e.preventDefault();
        console.log("hello world", e.target.name.value);

        const signupDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        console.log(signupDetails);

        const response = await axios.post("http://localhost:4000/signup", signupDetails);
        console.log(response);
        if(response.status === 201){

            window.location.href = "../expenseTrackerUsingAxios.html"

        }
        else{
            throw new Error('Failed to login');
        }
        
    }

    catch(err) {

        document.body.innerHTML += `<div style="color: red">${err}</div>`;
        console.log(err);

    }

}