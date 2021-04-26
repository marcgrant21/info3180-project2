from app import app, db
from flask import render_template, request, redirect, url_for, jsonify
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from app.forms import *
from app.models import *
import os, datetime
import jwt
from functools import wraps
from sqlalchemy import or_



###
# Routing for your application.
###

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """Render website's home page."""
    return render_template('index.html')


     
def token_authenticate(t):
    @wraps(t)
    def decorated(*args, **kwargs):
        
        auth = request.headers.get('Authorization', None)
        
        if not auth:
            return jsonify({'error': 'Access Denied : No Token Found'}), 401
        else:
            try:
                userdata = jwt.decode(auth.split(" ")[1], app.config['SECRET_KEY'])
                currentUser = Users.query.filter_by(username = userdata['user']).first()
                
                if currentUser is None:
                    return jsonify({'error': 'Access Denied'}), 401
                
            except jwt.exceptions.InvalidSignatureError as e:
                print (e)
                return jsonify({'error':'Invalid Token'})
            except jwt.exceptions.DecodeError as e:
                print (e)
                return jsonify({'error': 'Invalid Token'})
            return t(*args, **kwargs)
    return decorated
    

@app.route('/api/register',methods=["POST"])
def register():
    form = User()
    
    if form.validate_on_submit():
        
        try:
            uname = form.username.data
            pword = form.password.data
            location=form.location.data
            bio=form.biography.data
            name=form.name.data
            mail=form.email.data
            photo = form.photo.data

            date = str(datetime.date.today())
            filename = uname+secure_filename(photo.filename)
            
            user = Users(username=uname, password=pword, name=name, email=mail, location=location, biography=bio, profile_photo=filename, date_joined=date)
            photo.save(os.path.join(app.config["UPLOAD_PROFILE"], filename))
            db.session.add(user)
            db.session.commit()
            
            return jsonify(message = "User successfully registered")
            
            
        except Exception as e:
            db.session.rollback()
            print (e)
            return jsonify(errors=["Internal Error"])
    
    return jsonify(errors=form_errors(form))
    

@app.route('/api/auth/login',methods=["POST"])
def login():
    form = LoginForm()
    
    if request.method == "POST" and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        
        user = Users.query.filter_by(username=username).first()
        
        if user != None and check_password_hash(user.password, password):
            payload = {'user': user.username}
            jwt_token = jwt.encode(payload,app.config['SECRET_KEY'],algorithm = "HS256").decode('utf-8')
            response = {'message': 'User successfully logged in','token':jwt_token, "user_id": user.id}
            
            return jsonify(response)
            
            
        return jsonify(errors="Username or password is incorrect")
    
    return jsonify(errors=form_errors(form))


@app.route('/api/auth/logout', methods = ['GET'])
@token_authenticate
def logout():
    return jsonify(message= "User successfully logged out.")
    
        
@app.route('/api/cars', methods = ['GET','POST'])
@token_authenticate
def allcars():
    if request.method == 'GET':
        

        allcars = Cars.query.all()
        vcars = []
        for car in allcars:
            carObj = {"id": car.id, "user_id": car.user_id, "color": car.colour,"make": car.make,"model": car.model,"year": car.year,"price": car.price,"photo": os.path.join(app.config['UPLOAD_VCARPHOTO'],car.photo) }
            vcars.append(carObj)
        
        return jsonify(cars=vcars)

    if request.method == 'POST':
        
        form = Car()
        
        if form.validate_on_submit():
            
            description = form.description.data
            make = form.make.data
            model = form.model.data
            colour = form.colour.data
            year = form.year.data
            transmission = form.transmission.data
            car_type = form.car_type.data
            price = form.price.data
            photo= form.photo.data
            u_id = form.user_id.data
            
            user = Users.query.filter_by(id=u_id).first()
            
            filename = user.username+secure_filename(photo.filename)
            
            
            car = Cars(description=description,make=make,model=model,colour=colour,year=year,transmission=transmission,car_type=car_type,price=price,photo=filename,user_id=u_id)

            photo.save(os.path.join(app.config['UPLOAD_CARPHOTO'],filename))
            db.session.add(car)
            db.session.commit()
            
            return jsonify(status=201, message="Car Created")
            
            
        print (form.errors.items())
        return jsonify(status=200, errors=form_errors(form))

    

@app.route('/api/users/<user_id>', methods =['GET'])
@token_authenticate
def profile(user_id):
        user = Users.query.filter_by(id=user_id).first()
        c_y = int(user.date_joined.split("-")[0])
        c_m = int(user.date_joined.split("-")[1])
        c_d = int(user.date_joined.split("-")[2])
    
        user.date_joined = format_date_joined(c_y, c_m, c_d)
      
        response = {"status": "ok", "ur_data":{"name":user.name, "location": user.location,"email": user.email,"username": "@"+user.username, "date_joined":user.date_joined , "bio": user.biography, "profile_image": os.path.join("../", app.config['UPLOAD_VPROFILE'],user.profile_photo)}}
        
        return jsonify(response)



@app.route('/api/cars/<car_id>', methods =['GET'])
@token_authenticate
def car(car_id):

        car = Cars.query.filter_by(id=car_id).first()
      
        response = {"status": "ok", "car_data":{"id": car.id, "make": car.make,"model": car.model,"year": car.year,"price": car.price,"photo": os.path.join("../", app.config['UPLOAD_VCARPHOTO'],car.photo), "description":car.description,"colour": car.colour, "transmission":car.transmission,"car_type": car.car_type, "user_id": car.user_id}}
        return jsonify(response)


@app.route('/api/cars/<car_id>/favourite',methods = ['POST'])
@token_authenticate
def like(car_id):
    
    request_payload = request.get_json()
    user_id = request_payload["user_id"]
    car_id = request_payload["car_id"]
    
    car = Cars.query.filter_by(id=car_id).first()
    favourite = Favourites.query.filter_by(car_id=car_id).all()
    
    if car is None:
        return jsonify(staus="", message="Post does not exist")
        
    if favourite is not None:
        for like in favourite:
            if like.user_id == user_id:
                return jsonify(status=200, message="already liked")
        
    Fav = Favourites(car_id = car_id, user_id = user_id)
    
    db.session.add(Fav)
    db.session.commit()
    
    return jsonify({"status":201,'message': 'add favourite'})


@app.route('/api/users/<user_id>/favourites',methods = ['GET'])
@token_authenticate
def favourites(user_id):
    favcars = Favourites.query.filter_by(user_id = user_id).all()
    fvcars = []
    for fv in favcars:
        car = Cars.query.filter_by(id=fv.car_id).first()
        Obj = {"id": car.id, "user_id": car.user_id,"make": car.make,"model": car.model,"year": car.year,"price": car.price,"photo": os.path.join("../",app.config['UPLOAD_VCARPHOTO'],car.photo) }
        fvcars.append(Obj)
        
    return jsonify(cars=fvcars)

@app.route('/api/search', methods = ['GET'])
@token_authenticate
def search():
    make = request.args.get("make")
    model = request.args.get("model")

    filcars = Cars.query.filter((Cars.model.lower()==model.lower()) | (Cars.make.lower()==make.lower()))
    vcars = []
    for car in filcars:
        carObj = {"id": car.id, "user_id": car.user_id,"make": car.make,"model": car.model,"year": car.year,"price": car.price,"photo": os.path.join(app.config['UPLOAD_VCARPHOTO'],car.photo) }
        vcars.append(carObj)
        
    return jsonify(cars=vcars)



def format_date_joined(yy,mm,dd):
    return datetime.date(yy,mm,dd).strftime("%B %d,%Y")


# errors from the form if validation fails
def form_errors(form):
    Cars.query.all()
    errorArr = []
    
    for field, errors in form.errors.items():
        for error in errors:
            errorArr.append(error)
            
    return errorArr

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404





if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")