from . import db
from werkzeug.security import generate_password_hash

class Cars(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    description = db.Column(db.String(950))
    make = db.Column(db.String(200))
    model = db.Column(db.String(200))
    colour = db.Column(db.String(200))
    year = db.Column(db.String(100))
    transmission = db.Column(db.String(200))
    car_type = db.Column(db.String(200))
    price = db.Column(db.Float)
    photo= db.Column(db.String(300))
    user_id = db.Column(db.Integer)
    
    __tablename__ = "cars"
    
    def __init__(self,description,make,model,colour,year,transmission,car_type,price,photo,user_id):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.year = year
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo= photo
        self.user_id = user_id

class Favourites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    
    __tablename__ = "favourites"

    def __init__(self,car_id,user_id):
        self.car_id = post_id
        self.user_id = user_id
        


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    name = db.Column(db.String(80))
    email = db.Column(db.String(255))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(255))
    profile_photo = db.Column(db.String(255))
    date_joined = db.Column(db.String(100))
    
    __tablename__ = "users"
    
    def __init__(self, username, password, name, email, location, biography, profile_photo, date_joined):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.name = name
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_photo = profile_photo
        self.date_joined = date_joined
    
                         
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support


                         
    
    def __repr__(self):
        return "User: {0} {1}".format(self.firstname, self.lastname)
