from flask import Blueprint, session, redirect, url_for, render_template, abort
from models import User, Course, Outcome

pages_bp = Blueprint('pages', __name__)

def require_auth():
    if not session.get('logged_in'):
        return redirect(url_for('pages.login_page'))
    return None

def require_role(*roles):
    redirect_resp = require_auth()
    if redirect_resp:
        return redirect_resp
    if session.get('role') not in roles:
        abort(403)
    return None

@pages_bp.route('/')
@pages_bp.route('/login')
def login_page():
    if session.get('logged_in'):
        return redirect(url_for('pages.dashboard'))
    error = session.pop('error', None)
    return render_template('login.html', error=error)

@pages_bp.route('/dashboard')
def dashboard():
    resp = require_auth()
    if resp:
        return resp
    return render_template('dashboard.html')

@pages_bp.route('/curriculum')
def curriculum():
    resp = require_auth()
    if resp:
        return resp
    courses = Course.query.filter_by(is_active=True).order_by(Course.year_level, Course.semester, Course.code).all()
    return render_template('curriculum.html', courses=courses)

@pages_bp.route('/outcomes')
def outcomes():
    resp = require_auth()
    if resp:
        return resp
    outcomes = Outcome.query.filter_by(is_active=True).order_by(Outcome.type, Outcome.code).all()
    return render_template('outcomes.html', outcomes=outcomes)

@pages_bp.route('/mapping')
def mapping():
    resp = require_auth()
    if resp:
        return resp
    return render_template('mapping.html')

@pages_bp.route('/reports')
def reports():
    resp = require_auth()
    if resp:
        return resp
    return render_template('reports.html')

@pages_bp.route('/admin')
def admin():
    resp = require_role('admin', 'manager')
    if resp:
        return resp
    users = User.query.order_by(User.username).all()
    return render_template('admin.html', users=users)
