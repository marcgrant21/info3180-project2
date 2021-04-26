import os

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'Som3$ec5etK*y'
    UPLOAD_PROFILE = os.environ['UPLOAD_PROFILE'] = './app/static/uploads/profile' 
    UPLOAD_CARPHOTO = os.environ['UPLOAD_CARPHOTO'] = './app/static/uploads/carPhoto' 
    UPLOAD_VPROFILE = os.environ['UPLOAD_VPROFILE'] = 'static/uploads/profile' 
    UPLOAD_VCARPHOTO = os.environ['UPLOAD_VCARPHOTO'] = 'static/uploads/carPhoto'
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://cauhwnjeiczuys:ffda00ba97591dd7ae158a2e3012cf3b8f10f97fd9054dcc8f370360a49828ec@ec2-34-225-167-77.compute-1.amazonaws.com:5432/d6lnto66pign5j'
    #'postgresql://project2:mkm2021@localhost/project2'
  
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class DevelopmentConfig(Config):
    """Development Config that extends the Base Config Object"""
    DEVELOPMENT = True
    DEBUG = True

class ProductionConfig(Config):
    """Production Config that extends the Base Config Object"""
    DEBUG = False