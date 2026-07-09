from flask import Flask
from config import APP_NAME, SECRET_KEY, SQLALCHEMY_DATABASE_URI
from database import db, init_db
from routes.auth import auth_bp
from routes.api import api_bp
from routes.pages import pages_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

    init_db(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(pages_bp)

    @app.context_processor
    def inject_globals():
        return {'app_name': APP_NAME}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='127.0.0.1', port=5000, debug=True)
