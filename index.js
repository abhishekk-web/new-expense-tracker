const token = localStorage.getItem("token");
// const jwt = require('jsonwebtoken');


function mySave(e){

    //s

    e.preventDefault();



    const expense = e.target.expense.value;

    const description = e.target.description.value;

    const category = e.target.category.value;

    const userId = 1

    const object = {

      expense,
      description,
      category,
      userId

    }


    // for post

    
    
    axios.post("http://localhost:4000/data", object, {headers: {"Authorization": token}})
    .then((response)=>{

        showUser(response.data.allData);
        console.log(response.data.allData);
    })
    .catch((err)=>{

      document.body.innerHTML = document.body.innerHTML + `<h4>Something went wrong</h4>`
      console.log(err);

      })

    }

    function premiumUser(){
      document.getElementById("rzp-button1").style.visibility = "hidden";
      document.getElementById("message").innerHTML = "<h1>You are a premium user</h1>";
  }

    function parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
  }

  
  
  // for get

  const getPost = window.addEventListener("DOMContentLoaded",() => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const ispremiumuser = decodeToken.ispremiumuser;
    console.log(ispremiumuser);
    if(ispremiumuser){

      premiumUser();
      showLeaderboard()

    }
    
    const data2 = axios.get("http://localhost:4000/getData", {headers: {"Authorization": token}})
      
    

        .then((response)=>{


          console.log(response);

          for(var i=0;i<response.data.allData.length;i++){

            showUser(response.data.allData[i]);

          }


      })
      .catch((err)=>{

          console.log(err);

      })

    
  })

  function showUser(user) {

    const parentNode = document.getElementById("listOfUsers");
    const childHTML = `<li style="text-decoration: none; font-weight: bold; color: black; border: 3px solid black; border-radius: 5px; margin-left: 350px; padding-top: 7px; width: 500px; height: 50px; margin-top: 20px;" id=${user.id}>${user.expense} ${user.description} ${user.category}
              
              <button style="background-color: #00d1b2; border-radius: 10%; border: 2px solid #00d1b2; color: white;" onclick=deleteUser('${user.id}')>delete</button>
              <button style="background-color: #00d1b2; border-radius: 10%; border: 2px solid #00d1b2; color: white;" onclick=editUser('${user.expense}','${user.description}','${user.category}','${user.id}')>Edit the User </button>

            </li>`;

    parentNode.innerHTML = parentNode.innerHTML + childHTML;

  }

  // for delete
  //
  function deleteUser(userId) {

      const token = localStorage.getItem('token');
      axios.delete(`http://localhost:4000/deletedata/${userId}`, {headers: {"Authorization": token}})
      .then((response)=>{
         
          removeuser(userId);
          console.log('just deleted the user');
        })
        .catch((err)=>{
          console.log(err);
        })

  }


  function showLeaderboard(){
    const inputElement = document.createElement("input");
    inputElement.type="button";
    inputElement.value = 'Show Leaderboard';
    inputElement.style = "background-color: #008CBA; color: white; border: none; border-radius: 4px; height: 40px;"
    inputElement.onclick = async() => {
      const token = localStorage.getItem('token');
      const userLeaderBoardArray = await axios.get("http://localhost:4000/premium/showLeaderBoard", {headers: {"Authorization": token}});
      console.log(userLeaderBoardArray);

      var leaderboardElem = document.getElementById('leaderboard');
      leaderboardElem.innerHTML += '<h1>Leader Board</h1>';
      userLeaderBoardArray.data.forEach((userDetails) => {
        leaderboardElem.innerHTML += `<li style="text-decoration: none; font-weight: bold; color: black; border: 3px solid black; border-radius: 5px; margin-left: 350px; padding-top: 7px; width: 500px; height: 50px; margin-top: 20px;">Name - ${userDetails.name} Expense - ${userDetails.total_cost}</li>`;
      })
    }
    document.getElementById("message").appendChild(inputElement);
  }
  

  function removeuser(userId){

  const parentNode = document.getElementById("listOfUsers");
  const childNodeToBeDeleted = document.getElementById(userId);

  parentNode.removeChild(childNodeToBeDeleted);

  }




  function editUser(expense, description, category, userId) {

    

      document.getElementById("expense").value = expense;
      document.getElementById("description").value = description;
      document.getElementById("category").value = category;


      deleteUser(userId);
      console.log(userId);

    }

  

    document.getElementById('rzp-button1').onclick = async function(e) {
      // const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/purchase/premiummembership', {headers: {"Authorization": token}});
      console.log("the response is ",response);

      var options = 
      {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response) {
          const res = await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },{headers: {"Authorization": token }})
          
            alert('You are a Premium User Now')
            document.getElementById("rzp-button1").style.visibility = "hidden";
            document.getElementById("message").innerHTML = "<h1>You are a premium user</h1>";
            localStorage.setItem('token', res.data.token);
            console.log(res.data.token);
            showLeaderboard()
        }
      };

      const rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();

      rzp1.on('payment.failed', function (response) {
        console.log("the response is ", response);
        alert('Something went wrong');
      })
    }

    function showError(err){
      document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
  }

    function download(){
      axios.get('http://localhost:4000/user/download', { headers: {"Authorization" : token} })
      .then((response) => {
          if(response.status === 201){
              //the bcakend is essentially sending a download link
              //  which if we open in browser, the file would download
              var a = document.createElement("a");
              a.href = response.data.fileURL;
              a.download = 'myexpense.csv';
              a.click();
          } else {
              throw new Error(response.data.message)
          }
  
      })
      .catch((err) => {
          showError(err)
      });
  }
  