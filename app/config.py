import os

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Som3$ec5etK*y'
    UPLOAD_PROFILE = os.environ['UPLOAD_PROFILE'] = './app/static/uploads/profile' 
    UPLOAD_CARPHOTO = os.environ['UPLOAD_CARPHOTO'] = './app/static/uploads/carPhoto' 
    UPLOAD_VPROFILE = os.environ['UPLOAD_VPROFILE'] = 'static/uploads/profile' 
    UPLOAD_VCARPHOTO = os.environ['UPLOAD_VCARPHOTO'] = 'static/uploads/carPhoto'
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://project2:mkm2021@localhost/project2'
    #'postgresql://lxoeryfjfttxwv:b238acaf7ee1ea8c6c1b44765c2f0377b9079332191a6593c7acee51153da13f@ec2-52-205-3-3.compute-1.amazonaws.com:5432/da1riu584cl0p7'
    #
    #'postgresql://qjfvlgfydfwhrs:7b9a737d0dc3370cbc16032a0d91e5721c8449e71064ca41e63dbe8c7a2f6a78@ec2-34-225-167-77.compute-1.amazonaws.com:5432/d6b1u73jbtm9ht'
    #
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class DevelopmentConfig(Config):
    """Development Config that extends the Base Config Object"""
    DEVELOPMENT = True
    DEBUG = True

class ProductionConfig(Config):
    """Production Config that extends the Base Config Object"""
    DEBUG = False