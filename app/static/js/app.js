const app = Vue.createApp({
  data() {
    return {};
  },
});

app.component("app-header", {
  name: "AppHeader",
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <img src='static/images/car.png' class="small-logo"/>
      <a class="navbar-brand" href="#">United Auto Sale</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        </ul>
      </div>
      
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
           
            <li class="nav-item active">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
        </ul>
    </nav>
    `,
  data: function () {
    return {};
  },
});

app.component("app-footer", {
  name: "AppFooter",
  template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
});

const Home = {
  name: "Home",
  template: `
     <div class="row landing-container">
        
         <div class="col-md-4  landing-container-child float-clear">
           <div>
             <div class="card-body" style="padding-top: 0px;">
              <h1>Buy and Sell Cars Online</h1>
               <hr>
               <p class="card-text">United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online. find a Great Price on the Vehicle You Want.</p>
               <div style="margin-top: 10%;">
                   <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                   <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
               </div>
             </div>
           </div>  
         </div>
         <div class="col-md-4 landing-container-child" style="margin-left: 5%;">
             <img src="/static/images/download.png" id="landing-img"/>
         </div>
     </div>
    `,
  data: function () {
    return {};
  },
};

const Register={name: "Register",
   
  template:`
        <div>
          
          <h3 class="card-header center text-muted">Register</h3>
          <div class="card center">
           
            <form id="register" @submit.prevent="Register" enctype="multipart/form-data">
            <div>
                <label>Firstname:</label><br/>
                
               <input type='text' id='firstname' name='firstname' style="width: 100%;"/>
            </div>
            <div>
                <label>Lastname:</label><br/>
               <input type='text' id='lastname' name='lastname' style="width: 100%;"/>
            </div>
            <div>
                <label>Username:</label><br/>
               <input type='text' id='username' name='username' style="width: 100%;"/>
               
            </div>
            <div>
                <label>Password:</label><br/>
               <input type='password' id='password' name='password' style="width: 100%;"/>
            </div>
            <div>
                <label>Email:</label><br/>
               <input type='text' id='email' name='email' placeholder="jdoe@example.com" style="width: 100%;"/>
            </div>
            <div>
                <label>Location:</label><br/>
               <input type='text' id='location' name='location' style="width: 100%;"/>
            </div>
            <div>
                <label>Biography:</label><br/>
               <textarea name="biography" rows="3" style="width:100%"> </textarea><br/>
            </div>
            <div>
                <label for='photo' class='btn btn-primary'>Browse....</label> <span>{{ filename }}</span>
                
                <input id="photo" type="file" name='photo' style="display: none" v-on:change = "onFileSelected" /><br/>
                
            </div>
                
                 <div>
                      <input type="submit" id="submit" class="btn btn-success" value="Register" /> 
                    </div>
                
            </form>
            <div v-if='messageFlag' style="margin-top: 5%;">
            
                <div v-if="!errorFlag ">
                    <div class="alert alert-success" >
                        {{ message }}
                    </div>
                </div>
                <div v-else >
                    <ul class="alert alert-danger">
                        <li v-for="error in message">
                            {{ error }}
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
    </div>
  `,
   methods: {
      Register : function(){
          let self = this;
          let register = document.getElementById('register');
          let form_data = new FormData(register);
          
          fetch("/api/users/register", {
              method: "POST",
              body: form_data,
              headers: {
              'X-CSRFToken': token
              },
              credentials: 'same-origin'
          }).then(function(response){
              return response.json();
          }).then(function (jsonResponse) {
              // display a success message
              self.messageFlag = true
              
              if (jsonResponse.hasOwnProperty("errors")){
                  self.errorFlag=true;
                  self.message = jsonResponse.errors;
              }else if(jsonResponse.hasOwnProperty("message")){
                  router.push("/login");
              }
        });
      },
      onFileSelected: function(){
        let self = this
        let filenameArr = $("#photo")[0].value.split("\\");
        self.filename = filenameArr[filenameArr.length-1]
      }
   },
   data: function(){
     return {
        errorFlag: false,
        messageFlag: false,
        message: [],
        filename: "No File Selected"
    }
   }
};







const NotFound = {
  name: "NotFound",
  template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
  data() {
    return {};
  },
};

// Define Routes
const routes = [
  { path: "/", component: Home },
  // Put other routes here
  { path: "/register", component: Register},

  // This is a catch all route in case none of the above matches
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

app.use(router);

app.mount("#app");
