# fancy-todo

### Route
Route | HTTP | Header(s) | Body | Response | Description
------|------|-----------|------|----------|------------
/user/sigin| POST | if loginVia google: <br> token_id:String(**Required**) <br> (token id from google) | loginVia:String(**Required**) <br> (value 'google' or 'website'), <br> if loginVia website: <br> email:String(**Required**), <br> password:String(**Required**) | Error: <br> Wrong username/password (fail signin via website) <br> Success: <br> Get a signin token, <br> automatic signup if the user haven't signup (if signin via google) | Signin into server
/user/signup | POST | none | name:String(**Required**), <br> email:String(**Required**), <br> password:String(**Required**), loginVia:String(**Default Value 'website'**) | Error: <br> Wrong email/format email <br> (if user type the wrong email format or the email has been taken by other users), <br> Success: <br> Register user into the web | Register user via website
/todo/read | GET | token:String(**Required**) <br> (token got from signin as a JWT token), <br> userId:String(**Required**) <br> (userId got from signin as an current User who online) | none | Error: <br> In authentication, only the current user who can access this feature <br> Success: <br> Authenticated user can view their to do lists | Get User To Do Lists (**Authenticated User Only**)
/todo/create | POST | token:String(**Required**) <br> (token got from signin as a JWT token), <br> userId:String(**Required**) <br> (userId got from signin as an current User who online) | name:String(**Required**) <br> description:String(**Required**) <br> status:String(**Required**) <br> dueDate:String(**Required**) | Error: <br> Only authenticated user that can create this to do <br> Validation didn't input all requirements <br> Success: <br> To do created | Create a to do (**Authenticated User Only**)
/todo/update | POST | token:String(**Required**) <br> (token got from signin as a JWT token), <br> userId:String(**Required**) <br> (userId got from signin as an current User who online) | name:String(**Required**) <br> description:String(**Required**) <br> status:String(**Required**) <br> dueDate:String(**Required**) | Error: <br> Only authenticated user that can update this to do <br> Validation didn't input all requirements <br> Success: <br> To do updated | Update a to do (**Authenticated User Only**)
/todo/delete | POST | token:String(**Required**) <br> (token got from signin as a JWT token), <br> userId:String(**Required**) <br> (userId got from signin as an current User who online) | none | Error: <br> Only authenticated user that can delete this to do <br> Success: <br> To do deleted | Delete a to do (**Authenticated User Only**)

### Usage
command |
------- |
$ npm install |
$ nodemon app |
$ live-server --host=localhost |

Access the Server via http://localhost:3000/
<br>
Access the Client via http://localhost:8080/