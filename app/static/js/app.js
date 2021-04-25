const app = Vue.createApp({
  data: function () { 
    return{};
  }
});

app.component("app-header", {
  name: "AppHeader",
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <img src='static/images/car.png' class="small-logo"/> &nbsp  &nbsp
      <a class="navbar-brand" href="#" v-if="auth"> United Auto Sale</a>
      <a class="navbar-brand" href="/" v-else> United Auto Sale</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" style="margin-left: 5%;" v-if="auth">
        <ul class="navbar-nav mr-auto" >
            <li class="nav-item active">
              <router-link class="nav-link" to="/cars/new">Add Car</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" :to="{name: 'users', params: {user_id: cu_id}}">My Profile</router-link>
            </li>
        </ul>
        <ul class="navbar-nav mr-auto" style="margin-left: 70%;" >
            <li  class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
        </ul>
      </div>
      <div class="collapse navbar-collapse" style="margin-left: 75%;" v-else>
        <ul class="navbar-nav">
            <li class="nav-item active">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li  class="nav-item">
              <router-link class="nav-link active" to="/login">Login</router-link>
            </li> 
        </ul>
      </div>
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
     <div class="row back" style="" id="b">
      <div class="col-md-4  landing-container-child float-clear" style="margin-top: 6%;">
        <div>
          <div class="card-body">
            <h1>Buy and Sell Cars Online</h1>
            <hr>
            <p class="card-text">United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online. find a Great Price on the Vehicle You Want.</p>
            <div style="margin-top: 15%;">
              <router-link class="btn btn-primary col-md-5" to="/register">Register</router-link> &nbsp
              <router-link class="btn btn-success col-md-5" to="/login">Login</router-link>
            </div>
          </div>
        </div>  
      </div>
      <div class="col-md-4 " style="margin-left: 20%;">
        <img src="/static/images/download.png" id="landing-img" style="height: 540px; width: 625px;"/>
      </div>
    </div>
    `,
    
  created: function () { localStorage.removeItem("current_user")},
  data: function () {
    return {
     

    };
  },
};

const Register = {
  name: "Register",

  template: `
        <div>
          -
          <h2 class="card-header center headr">Register New User</h2>
          <div class="cardf center">
           
            <form id="register" @submit.prevent="Register" enctype="multipart/form-data">
            
            <div class="row " style="padding-left:12px; margin-bottom: 13px;">
            <div>
                <label>Username:</label><br/>
               <input type='text' id='username' name='username' style="width:250px;"/>
             
            </div>
            <div class="spacebetween">
                <label>Password:</label><br/>
               <input type='password' id='password' name='password' style="width: 250px;"/>
            </div>
            </div>

            <div class="row " style="padding-left:12px; margin-bottom: 13px; ">
            <div>
                <label>Fullname:</label><br/>
                
               <input type='text' id='name' name='name' placeholder="john doe" style="width: 250px;"/>
            </div>
            <div class="spacebetween">
                <label>Email:</label><br/>
               <input type='text' id='email' name='email' placeholder="jdoe@example.com" style="width: 250px;"/>
            </div>
            </div>

            <div style="margin-bottom: 13px; ">
                <label>Location:</label><br/>
               <input type='text' id='location' name='location' style="width: 530px;"/>
            </div>
            <div style="margin-bottom: 13px; ">
                <label>Biography:</label><br/>
               <textarea name="biography" rows="3" style="width:530px; height:100px"> </textarea><br/>
            </div>
            <div>
                <label for='photo' class='btn' style="border: 0.5px solid black; width: 75px;">Browse</label> <span>{{ filename }}</span>
                
                <input id="photo" type="file" name='photo' style="display: none" v-on:change = "onFileSelected" /><br/>
                
            </div>
                
                 <div style="width: 270px;">
                      <input type="submit" id="submit" class="btn btn-success"  value="Register" /> 
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
          <div class="card-header center headr">
            <strong>Login to your account</strong>
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
                <button id="submit" v-on:click="toggleBackground" class="btn btn-success">Login</button> 
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
      <div style="margin-bottom:5%;">
        <div class="card-header headr" style="padding-left:148px;">
            <strong>Explore</strong>
        </div>
        <div class="cardS center">
          <div class="row">
            <div style="margin-bottom:3%; margin-left:3%;">
              <label for='make'><strong>Make</strong></label><br>
              <input type="search"  v-model="make" id='make' name='make' style="width: 250px;"/>
            </div>
            <div class="spacebetween" style="margin-bottom:3%;">
              <label for='model'><strong>Model</strong></label><br>
              <input type="search" v-model="model" id='model' name='model' style="width: 250px;"/>
            </div>
            <div class="spacebetween" style="margin-top:3%;">
              <button id="submit" style="width: 150px;" v-on:click="search" class="btn btn-success">Search</button> 
            </div>
          </div>
        </div>
      </div>
      
      
      
      <div v-if="postFlag" class="col-md-7" style="padding-left:148px;">
        <div class="grid-container">
          <div class="prop" v-for="(car, index) in cars">
            <img id="pro-photo" v-bind:src=car.photo class="display-grid-pic"/>
            <div class="text-paddding">
		          <div class="row" style="margin-left:1px;">
                <div class="margin-top" style="width:125px;">
                  <span class="texts">{{ car.year }} {{ car.make }}</span>
                </div>
                <div class="margin-top btn-style row" style="margin-left:6px; width:100px;">
                  <img src='static/images/tag.png' class="icon-size" style="margin-top:5%;"/> 
                  $<span class="">{{ car.price }}</span>
			          </div> 
			        </div>
			        <div class="">
                <span class="faide">{{ car.model }}</span> 
			        </div>
            </div>
		        <div class="view-btn margin-top2" >
              <router-link class="txt" :to="{name: 'cars', params: {car_id: car.id}}">View more detail</router-link>
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
      fetch("/api/search"+"?make="+make+"&model="+model, {
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
      <div class="card-header headr" style="margin-left: 240px;"><strong>Add New Car</strong></div>
        <div class="cardf center">
          <div class="card-body">
            <div class="row " style="padding-left:12px; margin-bottom: 13px;">
              <div>
                <label>Make:</label><br/>
                <input type='text' id='make' name='make' style="width: 250px;"/>
              </div>
              <div class="spacebetween">
                <label>model:</label><br/>
                <input type='text' id='model' name='model' style="width: 250px;"/>
              </div>
            </div>

            <div class="row " style="padding-left:12px; margin-bottom: 13px;">
              <div>
                <label>colour:</label><br/>
                <input type='text' id='colour' name='colour' style="width: 250px;"/>
              </div>
              <div class="spacebetween">
                <label>year:</label><br/>
                <input type='text' id='year' name='year' placeholder="2000" style="width: 250px;"/>
              </div>
            </div>

            <div class="row " style="padding-left:12px; margin-bottom: 13px;">
              <div>
                <label>price:</label><br/>
                <input type='text' id='price' name='price' style="width: 250px;"/>
              </div>
              <div class="spacebetween">
                <label>car_type:</label><br/>
                <select name="car_type" id="car_type" placeholder="Choose Car Type" style="width: 250px;">
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
            </div>
     
            <div>
              <label>transmission:</label><br/>
              <select name="transmission" id="transmission" placeholder="Choose Transmission" style="width: 250px;">
                <option value=""></option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Automated Manual">Automated Manual</option>
              </select> 
            </div>
            <div>
              <label>description:</label><br/>
              <textarea name="description" rows="3" style="width:530px; height:100px"> </textarea><br/>
            </div>

          	<label><strong>Upload Photo</strong></label><br>
          	<input id="user_id" name="user_id" v-bind:value="cu_id" style="display: none;"/>
            <label class="btn" style="border: 0.5px solid black; width: 75px;" for="photo"><strong>Browse</strong></label>
            <label>{{ filename }}</label>
            <br>
            <input type = "file" id="photo" name="photo" style="display: none;" v-on:change="updateFilename"/>
            <button id="submit" class = "btn btn-success" style="width: 270px;">Submit</button>
            
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
  <div class="margin-top" style="margin-top: 60px;">
    <div v-if="postFlag" class="col-md-8 margin-top" style="margin: 0 auto;">
      <div class="cardS row" style="">
        <div class="card-body row profile-haeder" style="padding: 24px;" >
          <img id="" class=" " v-bind:src="user.profile_image" style="width: 180px; height: 180px; border-radius: 100px; border: 1px solid #999999;" />
          <div id="profile_info" class="" style="margin-left: 30px;">
        
            
            <label class="headr ">{{ user.name }}</label><br>
            <label class="faideUp ">{{ user.username }}</label><br>
            <p id="bio" style="color: gray;" class="text-box">
              {{ user.bio }}
            </p>
            <label style="padding-right: 60px;color: gray;">Email</label><label>{{ user.email }}</label><br>
            <label style="padding-right: 40px;color: gray;">Location</label><label>{{ user.location }}</label><br>
            <label style="padding-right: 60px;color: gray;">Joined </label><label>{{ user.date_joined }}</label>
    
          </div>
        
        </div>
      </div>
      <div class="headr margin-top2" style=" ">
        <strong>Cars Favourited</strong>
      </div>
      <div v-if="postFlag" class="margin-top2">
        <div class="grid-container">
          <div class="prop2" v-for="(car, index) in cars">
            <img id="pro-photo" v-bind:src=car.photo class="display-grid-pic"/>
            <div class="text-paddding">
              <div class="row" style="margin-left:1px;">
                <div class="margin-top" style="width:125px;">
                  <span class="texts">{{ car.year }} {{ car.make }}</span>
                </div>
                <div class="margin-top btn-style row" style="margin-left:6px; width:100px;">
                  <img src='static/images/tag.png' class="icon-size" style="margin-top:5%;"/> 
                  $<span class="">{{ car.price }}</span>
                </div> 
              </div>
              <div class="">
                <span class="faide">{{ car.model }}</span> 
              </div>
            </div>
            <div class="view-btn margin-top2" >
              <router-link class="txt" :to="{name: 'cars', params: {car_id: car.id}}">View more detail</router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="alert alert-primary" >
         
        </div>
      </div>
    </div>
    <div v-else>
      <div class="alert alert-primary" >
        
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
    <div v-if="postFlag" style="margin-top: 60px;">
      
        <div class="ind-prop Row">
          
            <img class="prop_pic"  v-bind:src="car.photo"/> 
          
          <div class="text-paddding2">
            <label class="headr ">{{car.year}} {{car.make}}</label><br/>
            <label class="faideUp">{{car.model}}</label>
            <label class="blk margin-top text-box">{{car.description}}</label>
            <div class="margin-top2 ">
              
              <label style="padding-right: 15px;color: gray;">Color</label><label style="padding-right: 50px; width:120px;"> {{car.colour}} </label>
             
              <label style="padding-right: 15px;color: gray;">Body Type</label><label style="">{{car.car_type}}</label>
              <br/>
              <label style="padding-right: 15px;color: gray;">Price</label><label style="padding-right: 20px; width:120px;">{{ car.price }}</label>
              <label style="padding-right: 15px;color: gray;">Transmission</label><label class="">{{car.transmission}}</label>
            </div>
            <div class="Row" style="margin-top: 110px;">
              <div class="margin-top2 view-btn2 color margin-bottom">	
                <a href="#" class="color">Send Realtor</a>
              </div>
              <div class="space">
              <div  style="border: 1px solid black; width:35px; height: 35px; border-radius: 100px; margin-left: 200px; background-color: #999999;">
                <img class="like-ico liked" src="../static/images/liked.png"  v-on:click="like" style="width:15px; display: none; margin: 9px;"/>
                <img class="like-ico like" src="../static/images/like.png"  v-on:click="like" style="width:15px; margin: 9px;"/>
              </div>
              </div>
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
