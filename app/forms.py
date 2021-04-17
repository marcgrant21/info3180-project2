from app import app
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import  StringField
from wtforms.fields import TextAreaField
from wtforms.validators import DataRequired

class Cars(FlaskForm):
    description = StringField('description', validators=[InputRequired()])
    make = PasswordField('make', validators=[InputRequired()])
    model = StringField('model', validators=[InputRequired()])
    colour = StringField('colour', validators=[InputRequired()])
    year = StringField('year', validators=[InputRequired()])
    transmission = StringField('transmission', validators=[InputRequired()])
    car_type = StringField('car_type', validators=[InputRequired()])
    price = StringField('price', validators=[InputRequired()])
    photo= FileField('Car Photo',validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    user_id = StringField("", validators=[InputRequired()])

class Favourites(FlaskForm):
    car_id = StringField("", validators=[InputRequired()])
    user_id = StringField("", validators=[InputRequired()])
    
class Users(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    name = StringField('First-name', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography',validators=[InputRequired()])
    photo= FileField('Profile Photo',validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    date_joined = StringField('date_joined', validators=[InputRequired()])
    

