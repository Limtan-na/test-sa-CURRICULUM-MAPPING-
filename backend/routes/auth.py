from flask import Blueprint, request, session, redirect, url_for
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if session.get('logged_in'):
            return redirect(url_for('pages.dashboard'))
        return redirect(url_for('pages.login_page'))

    username = request.form.get('username', '').strip()
    password = request.form.get('password', '')

    if not username or not password:
        session['error'] = 'Please enter username and password.'
        return redirect(url_for('pages.login_page'))

    user = User.query.filter_by(username=username, is_active=True).first()

    if not user or not User.validate_password(password, user.password_hash):
        session['error'] = 'Invalid username or password.'
        return redirect(url_for('pages.login_page'))

    session['user_id'] = user.id
    session['role'] = user.role
    session['full_name'] = user.full_name()
    session['logged_in'] = True
    session.pop('error', None)

    return redirect(url_for('pages.dashboard'))

@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('pages.login_page'))
