const token = localStorage.getItem("token");


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

    const token = localStorage.getItem('token')
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

  // for get

  const getPost = window.addEventListener("DOMContentLoaded",() => {

    const token = localStorage.getItem('token')
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
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/purchase/premiummembership', {headers: {"Authorization": token}});
      console.log("the response is ",response);

      var options = 
      {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function(response) {
          await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },{headers: {"Authorization": token }})
          
            alert('You are a Premium User Now')
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