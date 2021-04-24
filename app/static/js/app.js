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
        
        <ul class="navbar-nav" v-if="auth">
            <li class="nav-item active">
              <router-link class="nav-link" to="/cars/new">Add Car</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" :to="{name: 'users', params: {user_id: cu_id}}">My Profile</router-link>
            </li>
            <li  class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
        </ul>
        <ul class="navbar-nav" v-else>
            <li class="nav-item active">
              <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li  class="nav-item">
              <router-link class="nav-link active" to="/login">Login</router-link>
            </li>
       
           
        </ul>
    </nav>
    `,
  data: function () {
    return {
      auth: localStorage.hasOwnProperty("current_user"),
      cu_id: localStorage.hasOwnProperty("current_user")
        ? JSON.parse(localStorage.current_user).id
        : null,
    };
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

const Register = {
  name: "Register",

  template: `
        <div>
          -
          <h3 class="card-header center text-muted">Register</h3>
          <div class="card center">
           
            <form id="register" @submit.prevent="Register" enctype="multipart/form-data">
            <div>
                <label>Fullname:</label><br/>
                
               <input type='text' id='name' name='name' style="width: 100%;"/>
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
    Register: function () {
      let self = this;
      let register = document.getElementById("register");
      let form_data = new FormData(register);

      fetch("/api/register", {
        method: "POST",
        body: form_data,
        headers: {
          "X-CSRFToken": token,
        },
        credentials: "same-origin",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          // display a success message
          self.messageFlag = true;

          if (jsonResponse.hasOwnProperty("errors")) {
            self.errorFlag = true;
            self.message = jsonResponse.errors;
          } else if (jsonResponse.hasOwnProperty("message")) {
            router.push("/login");
          }
        });
    },
    onFileSelected: function () {
      let self = this;
      let filenameArr = $("#photo")[0].value.split("\\");
      self.filename = filenameArr[filenameArr.length - 1];
    },
  },
  data: function () {
    return {
      errorFlag: false,
      messageFlag: false,
      message: [],
      filename: "No File Selected",
    };
  },
};

const Login = {
  name: "Login",
  template: `
    <div>
      <form id="login-form" @submit.prevent="login">
          <div class="card-header center">
            <strong>Login</strong>
          </div>
          <div class="card center">
            <div class="card-body login">
              <div style="margin-top:5%;">
                <label for='username'><strong>Username</strong></label><br>
                <input type='text' id='username' name='username' style="width: 100%;"/>
              </div>
              <div style="margin-top:5%;">
                <label for='password'><strong>Password</strong></label><br>
                <input type='password' id='password' name='password' style="width: 100%;"/>
              </div>
              <div style="margin-top:5%;">
                <button id="submit" class="btn btn-success">Login</button> 
              </div>
              <div v-if='messageFlag' style="margin-top:5%;">
                <div class="alert alert-danger center" style="width: 100%; margin-top: 5%;">
                  {{ message }}
                </div>
              </div>
            </div>
          </div>
      </form>
    </div>
  `,
  methods: {
    login: function () {
      const self = this;

      let login_data = document.getElementById("login-form");
      let login_form = new FormData(login_data);

      fetch("/api/auth/login", {
        method: "POST",
        body: login_form,
        headers: {
          "X-CSRFToken": token,
        },
        credentials: "same-origin",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          self.messageFlag = true;

          if (jsonResponse.hasOwnProperty("token")) {
            cuser = { token: jsonResponse.token, id: jsonResponse.user_id };
            localStorage.current_user = JSON.stringify(cuser);

            router.go();
            router.push("/explore");
          } else {
            self.message = jsonResponse.errors;
          }
        })
        .catch(function (error) {
          self.messageFlag = false;
          console.log(error);
        });
    },
  },
  data: function () {
    return {
      messageFlag: false,
      message: "",
    };
  },
};

const Logout = {
  name: "Logout",
  template: `
<div>
<div/>`,
  created: function () {
    const self = this;

    fetch("api/auth/logout", {
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        localStorage.removeItem("current_user");
        router.go();
        router.push("/");
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};

const Explore = {
  name: "Explore",
  template: `
    <div>
          <div class="card-header center">
            <strong>Explore</strong>
          </div>
          <div class="card center">
          
              <div style="margin-top:5%;">
                <label for='make'><strong>Make</strong></label><br>
                <input type="search"  v-model="make" id='make' name='make' style="width: 100%;"/>
              </div>
              <div style="margin-top:5%;">
                <label for='model'><strong>Model</strong></label><br>
                <input type="search" v-model="model" id='model' name='model' style="width: 100%;"/>
              </div>
              <div style="margin-top:5%;">
                <button id="submit"  v-on:click="search" class="btn btn-success">Search</button> 
              </div>
          </div>
      
      



      
      <div v-if="postFlag" class="col-md-7" style="margin: 0 auto;">
        <div class="grid-container">
        <div class="prop" v-for="(car, index) in cars">
        <img id="pro-photo" v-bind:src=car.photo class="display-grid-pic"/>
        <div class="text-paddding">
		    <div class="margin Row">
            <span class="headr ">{{ car.year }}</span>
            <span class="faide">{{ car.make }}</span> 
			  </div>
			  <div class="">
            <span class="faide">{{ car.model }}</span> 
			  </div>
			  <div class="margin-top">
            <span class="btn-style">{{ car.price }}</span>
			  </div>
          </div>
		    <div class="view-btn margin-top2" >
            <router-link class="btn btn-success col-md-5" :to="{name: 'cars', params: {car_id: car.id}}">View Property</router-link>
        </div>
        </div>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-primary" >
          We Couldnt find any posts Anywhere. Be the first user to post on our site.
        </div>
      </div>
      
    </div>
  `,
  created: function () {
    self = this;
    

    fetch("/api/cars", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.current_user).token}`,
        "X-CSRFToken": token,
      },
      credentials: "same-origin",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        if (jsonResponse.hasOwnProperty("cars")) {
          if (jsonResponse.cars.length != 0) {
            self.cars = jsonResponse.cars.reverse();
            self.postFlag = true;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    search:function() {
      let self = this;
      let make = self.make;
      let model = self.model;
      let params={"make":make,"model":model};
      fetch("/api/search"+"?make="+make, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.current_user).token}`,
          "X-CSRFToken": token,
        },
        credentials: "same-origin",
       
        })
        .then(function (response) {
           return response.json();
        })
        .then(function (jsonResponse) {
          if (jsonResponse.hasOwnProperty("cars")) {
            if (jsonResponse.cars.length != 0) {
              self.cars = jsonResponse.cars;
              self.postFlag = true;
            }
          }

        });
    }
  },
  data: function () {
    return {
      cars: [],
      make:"",
      model:"",
      postFlag: false,
    };
  },
};

const AddCar = {
  name: "AddCar",
  template: `
  <div>
    <form class="center" id="npostform" @submit.prevent="submit" enctype="multipart/form-data">
      <div class="card-header center"><strong>New Post</strong></div>
      <div class="card center">
        <div class="card-body">
        <div>
            <label>Make:</label><br/>
            
           <input type='text' id='make' name='make' style="width: 100%;"/>
        </div>
        <div>
            <label>model:</label><br/>
           <input type='text' id='model' name='model' style="width: 100%;"/>
           
        </div>
        <div>
            <label>colour:</label><br/>
           <input type='text' id='colour' name='colour' style="width: 100%;"/>
        </div>
        <div>
            <label>year:</label><br/>
           <input type='text' id='year' name='year' placeholder="2000" style="width: 100%;"/>
        </div>
        <div>
            <label>price:</label><br/>
           <input type='text' id='price' name='price' style="width: 100%;"/>
        </div>
        <div>
            <label>car_type:</label><br/>
            <select name="car_type" id="car_type" placeholder="Choose Car Type" style="width: 100%;">
              <option value=""></option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Wagon">Wagon</option>
              <option value="Convertible">Convertible</option>
              <option value="Sports Car">Sports Car</option>
              <option value="Hybrid/Electric">Hybrid/Electric</option>
            </select>
        </div>
        <div>
            <label>transmission:</label><br/>
            <select name="transmission" id="transmission" placeholder="Choose Transmission" style="width: 100%;">
              <option value=""></option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Automated Manual">Automated Manual</option>
            </select> 
        </div>
        <div>
            <label>description:</label><br/>
           <textarea name="description" rows="3" style="width:100%"> </textarea><br/>
        </div>

          	<label><strong>Photo</strong></label><br>
          	<input id="user_id" name="user_id" v-bind:value="cu_id" style="display: none;"/>
            <label class="btn" style="border: 0.5px solid black" for="photo"><strong>Browse</strong></label>
            <label>{{ filename }}</label>
            <br>
            <input type = "file" id="photo" name="photo" style="display: none;" v-on:change="updateFilename"/>
            <button id="submit" class = "btn btn-success">Submit</button>
            
            <div v-if='messageFlag' >
              <div v-if="errorFlag">
                <div style="width: 100%; margin-top: 5%;">
                  <ul class="alert alert-danger">
                    <li v-for="error in message">
                        {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else class="alert alert-success" style="width: 100%; margin-top: 5%;">
                {{ message }}
              </div>
            </div>
        </div>    
      </div>
    </form>
  </div>
  `,
  methods: {
    updateFilename: function () {
      const self = this;
      let filenameArr = $("#photo")[0].value.split("\\");
      self.filename = filenameArr[filenameArr.length - 1];
    },
    submit: function () {
      self = this;
      self.messageFlag = true;
      self.message = "Saveing......";

      fetch("/api/cars", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.current_user).token
          }`,
          "X-CSRFToken": token,
        },
        body: new FormData(document.getElementById("npostform")),
        credentials: "same-origin",
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (jsonResponse) {
          if (jsonResponse.hasOwnProperty("status")) {
            if (jsonResponse.status == 201) {
              self.errorFlag = false;
              self.message = jsonResponse.message;
            } else {
              self.errorFlag = true;
              self.message = jsonResponse.errors;
            }
          }
        })
        .catch(function (error) {
          self.message = "Unexpected Error";
          console.log(error);
        });
    },
  },
  data: function () {
    return {
      filename: "No File Selected",
      messageFlag: false,
      errorFlag: false,
      message: "",
      cu_id: JSON.parse(localStorage.current_user).id,
    };
  },
};


const Profile = {
  name: "Profile",
  template: `
  <div>
    <div v-if="postFlag" class="col-md-7" style="margin: 0 auto;">
      <div class="card row" style="width:100%">
        <div class="card-body row profile-haeder" style="padding: 0;" >
          <img id="profile_image" class="col-md-2" v-bind:src="user.profile_image" style="width: 100%; height: 15%" />
          <div id="profile_info" class="col-md-7" style="margin-top: 0px;padding-right: 0;">
        
            <label>{{ user.profile_image }}</label><br>
            <label>{{ user.name }}</label><br>
            <label>{{ user.username }}</label><br>
            <p id="bio" style="color: gray;">
              {{ user.bio }}
            </p>
            <label>{{ user.email }}</label><br>
            <label>{{ user.location }}</label><br>
            <label>{{ user.date_joined }}</label>
    
          </div>
        
        </div>
      </div>
      <h3>Cars Favourited</h3>
      <div v-if="postFlag" class="col-md-7" style="margin: 0 auto;">
        <div class="grid-container">
          <div class="prop" v-for="(car, index) in cars">
            <img id="pro-photo" v-bind:src=car.photo class="display-grid-pic"/>
            <div class="text-paddding">
		          <div class="margin Row">
                <span class="headr ">{{ car.year }}</span>
                <span class="faide">{{ car.make }}</span> 
			        </div>
			        <div class="">
                <span class="faide">{{ car.model }}</span> 
			        </div>
			        <div class="margin-top">
                <span class="btn-style">{{ car.price }}</span>
			        </div>
            </div>
		        <div class="view-btn margin-top2" >
              <router-link class="btn btn-success col-md-5" :to="{name: 'cars', params: {car_id: car.id}}">View Property</router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-primary" >
          hi
        </div>
      </div>


    </div>
    <div v-else>
      <div class="alert alert-primary" >
        no
      </div>
    </div>
  </div>
  
  `,
  created: function(){
    self = this;
    
    fetch(`/api/users/${self.$route.params.user_id}`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
      }
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      self.user = jsonResponse.ur_data;
      self.postFlag = true;
    }).catch(function(error){
      console.log(error);
    });

    fetch(`/api/users/${self.$route.params.user_id}/favourites`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.current_user).token}`,
        "X-CSRFToken": token,
      },
      credentials: "same-origin",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonResponse) {
        if (jsonResponse.hasOwnProperty("cars")) {
          if (jsonResponse.cars.length != 0) {
            self.cars = jsonResponse.cars.reverse();
            self.postFlag = true;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });


  } 
  ,
  data: function(){
    return {
      user: null,
      postFlag: false,
      cu_id: (this.$route.params.user_id == JSON.parse(localStorage.current_user).id) ? true : false,
      cars: [],
    }
  }
};


const ViewCar = {
  name: "ViewCar",
  template: `
  <div>
    <div v-if="postFlag" class="col-md-7" style="margin: 0 auto;">
    <div class="">
    <div class="ind-prop Row">
        <div class="">
        <img class="prop_pic"  v-bind:src="car.photo"/> 
            </div>
        <div class="text-paddding2">
          <span class="ind-headr ">{{car.year}}</span>
            <div class="Row margin-top{">
            <span class="btn-style2 blk">{{car.make}}</span>
          <span class="blk btn-style3 margin-left">{{car.model}}</span>
                 </div>
          <span class="blk margin-top text-box">{{car.description}}</span>
          <div class="Row margin-top2 ">
          <div class="Row">
          <span class="blk">color {{car.color}} </span>
                 </div>
           <div class="Row  margin-left">
        
          <span class="blk">body type {{car.car_type}}</span>
                 </div>
           </div>
           <div class="Row margin-top2">
           <span class="btn-style">price {{ car.price }}</span>
          <span class="blk">transmission {{car.transmission}}</span>
          </div>
        <div class="margin-top2 view-btn2 color margin-bottom">	
            <a href="#" class="color">Send Realtor</a>
        </div>
            <img class="like-ico liked" src="../static/images/liked.png"  v-on:click="like" style="width:20px; display: none;"/>
            <img class="like-ico like" src="../static/images/like.png"  v-on:click="like" style="width:20px;"/>

         </div>
        
    </div>
    </div>
    </div>
    <div v-else>
      <div class="alert alert-primary" >
        error
      </div>
    </div>
  </div>
  
  `,methods: {
    like: function(event){
      self = this;
      let node_list = event.target.parentElement.children;
      let car_id = self.$route.params.car_id;
      
      fetch(`/api/cars/${car_id}/favourite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`,
          'X-CSRFToken': token,
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({"user_id": JSON.parse(localStorage.current_user).id, "car_id": car_id})
      }).then(function(response){
        return response.json();
      }).then(function(jsonResponse){
        
        if(jsonResponse.hasOwnProperty("status")){
          if(jsonResponse.status == 201){
            event.target.style.display="none"
            event.target.previousElementSibling.style.display="";
          }
        }
      }).catch(function(error){
        console.log(error);
      });
    }
  },
  created: function(){
    self = this;
    
    fetch(`/api/cars/${self.$route.params.car_id}`,{
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.current_user).token}`
      }
    }).then(function(response){
      return response.json();
    }).then(function(jsonResponse){
      self.car = jsonResponse.car_data;
      self.postFlag = true;
    }).catch(function(error){
      console.log(error);
    });
  },
  data: function(){
    return {
      car: null,
      postFlag: false,
      cr_id: this.$route.params.car_id
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
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/explore", component: Explore },
  { path: "/cars/new", component: AddCar },
  { path: "/users/:user_id", name:"users", component: Profile },
  { path: "/cars/:car_id", name:"cars", component: ViewCar },
  // This is a catch all route in case none of the above matches
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes, // short for `routes: routes`
});

app.use(router);

app.mount("#app");
