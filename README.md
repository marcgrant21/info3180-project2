# Photogram
INFO 3180 Project 2 Photogram

## Setup
**Note:** This app uses a PostgreSQL database along with Flask-SQLAlchemy and Flask-Migrate.

To begin using this app you can do the following:

1. Clone the repository to your local machine or Cloud9.
2. Create a Python virtual environment e.g. `virtualenv venv`
3. Enter the virtual environment using `source venv/bin/activate`
4. Install the dependencies using Pip. e.g. `pip install -r requirements.txt`. __Note:__ Ensure you have PostgreSQL already installed and a database created.
5. Edit the `app/__init__.py` file and enter your database credentials and database name.
6. Run the migrations by typing `python flask-migrate.py db upgrade`
7. Ensure you add a user to your database to test the login system.
8. Start the development server using `python run.py`.
