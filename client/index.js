const url = `http://localhost:3000`;
let user = {};
let allToDoList = [];
let filteredList = [];

let updateId = '';
let currentList = '';
let updateOrDeleteId = '';
let currentFilter = '';

navBar();
isSignIn();

function navBar(){
  $('#navbar').append(`<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Fancy To Do List</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item mr-auto mr-sm-2">
          <a id="signin" href="#" onclick="formSignin();">
            <button   class="btn btn-primary"> Sign In </button>  
          </a>    
        </li>
        <li class="nav-item mr-auto">
          <a id="signout" href="#" onclick="signOut();">
            <button   class="btn btn-danger"> Sign Out </button>  
          </a>
        </li>
        <li class="nav-item mr-auto mr-sm-2">
          <a id="signup" href="#" onclick="formSignup();">
            <button   class="btn btn-success"> Sign Up </button>  
          </a>
        </li>
        <li class="nav-item mr-auto mr-sm-2"">
          <div id="googleSignIn" class="g-signin2" data-onsuccess="onSignIn"></div>
        </li>
      </ul>
      <form id="search-todo" class="form-inline my-2 my-lg-0" onsubmit="searchToDo()">
        <input id="input-search" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>`);
  $('#search-todo').on('submit', function(event){
    event.preventDefault();
  })
}

//swal notif
function notif(position, type, title, timer = 4000) {
  Swal.fire({
    position: position,
    type: type,
    title: title,
    showConfirmButton: false,
    timer: timer
  })
}

function isSignIn(){
  userToken = localStorage.getItem('token');
  if(userToken){
    $('#signin').hide();
    $('#signup').hide();
    $('#googleSignIn').hide();
    
    $('#signout').show();
    $('#search-todo').show();
    $('#doughnut-chart').show();

    $('#form-signin').remove();
    $('#form-signout').remove();
    
    readTodo();  

  } else {
    $('#signin').show();
    $('#signup').show();
    $('#googleSignIn').show();

    $('#todo').remove();

    $('#signout').hide();
    $('#search-todo').hide();
    $('#doughnut-chart').hide();
  }
}

function formSignin() {
  $('#form-signup').remove();
  $('#form-signin').remove();
  $('#sign').append(`
    <div id="form-signin">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign In</h5>
            <form id="form-signin" class="form-signin" onsubmit="signIn()">
              <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
                <label for="inputEmail">Email address</label>
              </div>

              <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
                <label for="inputPassword">Password</label>
              </div>

              <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  `);
}

function formSignup() {
  $('#form-signin').remove();
  $('#form-signup').remove();
  $('#sign').append(`
    <div id="form-signup">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Sign Up</h5>
            <form id="form-signin" class="form-signin" onsubmit="signUp()">
              <div class="form-label-group">
                <input type="text" id="inputName" class="form-control" placeholder="Name" required autofocus>
                <label for="inputName">Name</label>
              </div>

              <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
                <label for="inputEmail">Email address</label>
              </div>

              <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
                <label for="inputPassword">Password</label>
              </div>

              <button class="btn btn-lg btn-success btn-block text-uppercase" type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  `);
}

//script for Google Sign In
function onSignIn(googleUser) {
  // const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url:`${url}/user/signin?loginVia=google`,
    method:'POST',
    headers:{
      token_id: id_token
    }
  })
  .done(response => {
    notif('top-end', 'success', 'Sign in Success');
    localStorage.setItem('token', response.token);
    user._id = response.userId;
    user.name = response.userName;
    isSignIn();
  })
  .fail(err => {
    notif('top-end', 'error', response.responseJSON.err)
  })
}

//script for Google Sign Out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token');
    user = {};
    notif('top-end', 'success', 'Sign out Success');
    isSignIn();
  });
}

//sign in from web
function signIn() {
  $('#form-signin').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url:`${url}/user/signin?loginVia=website`,
      method:'POST',
      data: {
        email: $('#inputEmail').val(),
        password: $('#inputPassword').val(),
        loginVia: 'website'
      }
    })
    .done(response => {
      notif('top-end', 'success', 'Sign in Success');
      localStorage.setItem('token', response.token);
      user._id = response.userId;
      user.name = response.userName;
      isSignIn();
    })
    .fail(response => {
      notif('top-end', 'error', response.responseJSON.err)
    }) 
  })
}

//sign up from web
function signUp() {
  $('#form-signup').on('submit', function(event){
    event.preventDefault();
    $.ajax({
      url:`${url}/user/signup?loginVia=website`,
      method:'POST',
      data: {
        name: $('#inputName').val(),
        email: $('#inputEmail').val(),
        password: $('#inputPassword').val(),
        loginVia: 'website'
      }
    })
    .done(response => {
      notif('top-end', 'success', 'Sign up Success');
      $('#form-signup').remove();
    })
    .fail(response => {
      notif('top-end', 'error', response.responseJSON.err)
    }) 
  })
}
 
async function readTodo(){
  return $.ajax({
    url:`${url}/todo/read`,
    method:'GET',
    headers: {
      token: localStorage.getItem('token'),
      userId: user._id
    }
  })
  .done(response => {
    allToDoList = response;
    filteredList = allToDoList.slice(0);
    showToDoForm();
    return true;
  })
  .fail(response => {
    if(response.responseJSON.err == `User Login Have Been Changed, Please Login Again`){
      signOut();
      notif('top-start', 'error', response.responseJSON.err);
    }
    else {
      notif('top-end', 'error', response.responseJSON.err);
    }
  })
}

function showToDoForm() {
  $('#todo').remove();
  $('#content').append(`
    <div id="todo">
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h5 class="card-title text-center">To Do Form</h5>
              <form id="form-todo" class="form-signin" onsubmit="createTodo()">
                <div class="form-label-group">
                  <input type="text" id="todoName" class="form-control" placeholder="To Do Name" required autofocus>
                  <label for="todoName">To Do Name</label>
                </div>

                <div class="form-label-group">
                  <input type="text" id="description" class="form-control" placeholder="Description" required autofocus>
                  <label for="description">Description</label>
                </div>
  
                <div id="status">
                  <div class="form-check-inline">
                    <label class="form-check-label" for="status">Complete
                      <input type="radio" class="form-check-input" value="complete" required name="optCreateStatus">
                    </label>  
                  </div>

                  <div class="form-check-inline">
                    <label class="form-check-label" for="status">Uncomplete
                      <input type="radio" id="status" class="form-check-input" value="uncomplete"  required name="optCreateStatus">
                    </label>  
                  </div>
                </div>

                <div class="form-label-group">
                  <input type="date" id="dueDate" class="form-control" placeholder="Due Date" required autofocus>
                  <label for="dueDate">Due Date</label>
                </div>
  
                <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Create a To Do</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div id="filterList">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h5 class="card-title text-center">Filter Own To Do</h5>
              <form id="filter-own-form-todo" class="form-signin" onsubmit="filterToDo()">
                <select id="filter-own-option" class="form-control select-filter" name="filter-own-todo">
                  <option value="newUpdated">New Updated</option>
                  <option value="dueDateAsc">Due Date Ascending</option>
                  <option value="dueDateDesc">Due Date Descending</option>
                  <option value="complete">Complete</option>
                  <option value="uncomplete">Uncomplete</option>
                  <option value="nameAsc">Name Ascending</option>
                  <option value="nameDesc">Name Descending</option>
                </select> 
                <button class="btn btn-lg btn-success btn-block text-uppercase" type="submit">Filter</button>
            </div>
          </div>
        </div>
      </div>
      <div id="todoList">
      </div>
    </div>
  `);
  $('#form-todo').on('submit', function(event){
    event.preventDefault();
  })
  $('#filter-own-form-todo').on('submit', function(event){
    event.preventDefault();
  })
  appendTodo();
}

function appendTodo(list = filteredList){
  $('#allToDoList').remove();
  $('#todoList').append('<div id="allToDoList"></div>');
  for(let i = list.length - 1; i >= 0 ; i--){
    $('#allToDoList').append(`
      <div id="${list[i]._id}" class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <div class="form-label-group">
                <input type="text" class="form-control" placeholder="To Do Name" autofocus readonly value="${list[i].name}">
                <label>To Do Name</label>
              </div>
              <div class="form-label-group">
                <input type="text" class="form-control" placeholder="Description" autofocus readonly value="${list[i].description}">
                <label>Description</label>
              </div>
              <div class="form-label-group">
                <input type="text" class="form-control" placeholder="Status" autofocus readonly value="${list[i].status}">
                <label>Status</label>
              </div>
              <div class="form-label-group">
                <input type="date" class="form-control" placeholder="To Do Name" autofocus readonly value="${list[i].dueDate}">
                <label>Due Date</label>
              </div>
              <button id="update" class="btn btn-lg btn-primary btn-block text-uppercase" onclick="showUpdateForm('${list[i]._id}', '${i}')">Update</button>
              <button id="remove" class="btn btn-lg btn-danger btn-block text-uppercase" onclick="showRemoveForm('${list[i]._id}', '${i}')">Remove</button>
            </div>
          </div>
        </div>   
      </div>
    `)
  }
  createChart();
}

function createTodo() {
  $.ajax({
    url:`${url}/todo/create`,
    method:'POST',
    data: {
      name: $('#todoName').val(),
      description: $('#description').val(),
      status: $("input[name='optCreateStatus']:checked").val(),
      dueDate: $('#dueDate').val(),
    },
    headers: {
      token: localStorage.getItem('token'),
      userId: user._id
    }
  })
  .done(response => {
    notif('top-end', 'success', 'To Do Added to the List');
    filteredList.push(response);
    allToDoList.push(response)
    
    showToDoForm();
  })
  .fail(response => {
    notif('top-end', 'error', response.responseJSON.err)
  })
}

function showUpdateForm(id, index){
  updateId = updateId || null;
  cancelEditOrDelete();
  updateId = id;
  currentList = $(`#${updateId}`);
  const updateData = allToDoList.slice(index)[0];
  const formEditOrDelete = `
  <div id="${updateId}" class="row">
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <div class="card card-signin my-5">
        <div class="card-body">
          <h5 class="card-title text-center">Update Form</h5>
          <form id="form-todo-update" class="form-signin">
            <div class="form-label-group">
              <input id=updateName type="text" class="form-control" value="${updateData.name}" required autofocus>
              <label for="todoName">To Do Name</label>
            </div>

            <div class="form-label-group">
              <input id=updateDescription type="text" id="description" class="form-control" value="${updateData.description}" required autofocus>
              <label for="description">Description</label>
            </div>

            <div id="status">
              <div class="form-check-inline">
                <label class="form-check-label" for="status">Complete
                  <input type="radio" class="form-check-input" value="complete" required name="optCreateStatus" ${updateData.status === 'complete' ? 'checked': ''}>
                </label>  
              </div>

              <div class="form-check-inline">
                <label class="form-check-label" for="status">Uncomplete
                  <input type="radio" id="status" class="form-check-input" value="uncomplete"  required name="optCreateStatus" ${updateData.status === 'uncomplete' ? 'checked': ''}>
                </label>  
              </div>
            </div>

            <div class="form-label-group">
              <input id=updateDueDate type="date" id="dueDate" class="form-control" value="${updateData.dueDate}" required autofocus>
              <label for="dueDate">Due Date</label>
            </div>

            <button class="btn btn-lg btn-success btn-block text-uppercase" type="submit" onclick="update('${index}')">Update</button>
            <button type="button" id="cancelChange" class="btn btn-lg btn-danger btn-block text-uppercase" onclick="cancelEditOrDelete()">Cancel</button>
          </form>
        </div>
      </div>
    </div> 
  </div>`;
  $(currentList).replaceWith(formEditOrDelete);
}

function cancelEditOrDelete(){
  $(`#${updateId}`).replaceWith(currentList);
  updateId = '';
}

function update(index){
  $('#form-todo-update').on('submit', function(event){
    event.preventDefault();
  })
  $.ajax({
    url: `${url}/todo/update`,
    method:'POST',
    data: {
      id: updateId,
      name: $('#updateName').val(),
      description: $('#updateDescription').val(),
      status: $("input[name='optCreateStatus']:checked").val(),
      dueDate: $('#updateDueDate').val(),
    },
    headers: {
      token: localStorage.getItem('token'),
      userId: user._id
    }
  })
  .done(response => {
    notif('top-end', 'success', 'List Have Been Update');
    filteredList.splice(index, 1);
    filteredList.push(response);
    allToDoList.splice(allToDoList.map(list => list._id).indexOf(updateId), 1);
    allToDoList.push(response);

    appendTodo();
  })
  .fail(response => {
    notif('top-end', 'error', response.responseJSON.err)
  })
}

function showRemoveForm(id, index){
  updateId = updateId || null;
  cancelEditOrDelete();
  updateId = id;
  currentList = $(`#${updateId}`);
  const currentData = allToDoList.slice(index)[0];
  const formEditOrDelete = `
  <div id="${updateId}" class="row">
    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Are You Sure Want To Delete This To Do?</h5>
            <div class="form-label-group">
              <input type="text" class="form-control" placeholder="To Do Name" autofocus readonly value="${currentData.name}">
              <label>To Do Name</label>
            </div>
            <div class="form-label-group">
              <input type="text" class="form-control" placeholder="Description" autofocus readonly value="${currentData.description}">
              <label>Description</label>
            </div>
            <div class="form-label-group">
              <input type="text" class="form-control" placeholder="Status" autofocus readonly value="${currentData.status}">
              <label>Status</label>
            </div>
            <div class="form-label-group">
              <input type="date" class="form-control" placeholder="To Do Name" autofocus readonly value="${currentData.dueDate}">
              <label>Due Date</label>
            </div>
            <button type="button" id="deleteToDo" class="btn btn-lg btn-danger btn-block text-uppercase" onclick="remove('${index}')">Yes</button>
            <button type="button" id="cancelChange" class="btn btn-lg btn-primary btn-block text-uppercase" onclick="cancelEditOrDelete()">No</button>
          </div>
        </div>
      </div> 
    </div>`
  $(currentList).replaceWith(formEditOrDelete);
}

function remove(index){
  $('#deleteToDo').on('click', function(event){
    event.preventDefault();
  })
  $.ajax({
    url: `${url}/todo/delete`,
    method:'POST',
    data: {
      id: updateId
    },
    headers: {
      token: localStorage.getItem('token'),
      userId: user._id
    }
  })
  .done(response => {
    notif('top-end', 'success', response);
    filteredList.splice(index, 1);
    allToDoList.splice(allToDoList.map(list => list._id).indexOf(updateId), 1);
    appendTodo();
  })
  .fail(response => {
    notif('top-end', 'error', response.responseJSON.err)
  })
}

function searchToDo(){
  const filteredToDo = allToDoList.filter(todo => (todo.name.indexOf($('#input-search').val()) + 1));
  if(filteredToDo.length){
    appendTodo(filteredToDo);
    notif('top-start', 'success', 'To Do Found');
  } else {
    notif('top-start', 'error', "To Do Didn't Found")
  }
}

function filterToDo(){
  const option = $('#filter-own-option').val();
  currentFilter = currentFilter || 'newUpdated';

  
  if(currentFilter !== option){
    currentFilter = option;
    if(option === 'newUpdated'){
      filteredList = allToDoList.slice(0);
      
    } else if(option === 'dueDateAsc'){
      filteredList = filteredList.sort((listA, listB) => listA.dueDate < listB.dueDate);
    } else if(option === 'dueDateDesc'){
      filteredList = filteredList.sort((listA, listB) => listB.dueDate < listA.dueDate);
    } else if(option === 'complete'){
      filteredList = filteredList.sort((listA, listB) => listA.status < listB.status);
    } else if(option === 'uncomplete'){
      filteredList = filteredList.sort((listA, listB) => listB.status < listA.status);
    } else if(option === 'nameAsc'){
      filteredList = filteredList.sort((listA, listB) => listA.name < listB.name);
    } else if(option === 'nameDesc'){
      filteredList = filteredList.sort((listA, listB) => listB.name < listA.name);
    }
    appendTodo();
    notif('top-end', 'success', 'Filtered Own List Success');
  }
  else{
    notif('top-end', 'error', 'The List Have Been Already Filtered');
  }

}

function createChart() {
  new Chart(document.getElementById("doughnut-chart"), {
    type: 'doughnut',
    data: {
      labels: ["Complete", "Uncomplete"],
      datasets: [
        {
          label: "To Do (Count)",
          backgroundColor: ["skyblue", "orange"],
          data: [allToDoList.map(data => data.status==='complete').filter(data => data).length, allToDoList.map(data => data.status==='uncomplete').filter(data => data).length]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Statistical Completion To Do History'
      }
    }
  });
}