from app import app
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import  StringField, PasswordField
from wtforms.fields import TextAreaField, SelectField
from wtforms.validators import DataRequired, InputRequired

class Car(FlaskForm):
    description = StringField('description', validators=[InputRequired()])
    make = StringField('make', validators=[InputRequired()])
    model = StringField('model', validators=[InputRequired()])
    colour = StringField('colour', validators=[InputRequired()])
    year = StringField('year', validators=[InputRequired()])
    transmission = StringField('transmission', validators=[InputRequired()])
    car_type = StringField('car_type', validators=[InputRequired()])
    price = StringField('price', validators=[InputRequired()])
    photo= FileField('Car Photo',validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    user_id = StringField("", validators=[InputRequired()])

    
class User(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    name = StringField('Name', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography',validators=[InputRequired()])
    photo= FileField('Profile Photo',validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])

    
class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])


