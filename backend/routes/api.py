from flask import Blueprint, jsonify
from models import Program, Course, Outcome, Mapping
from sqlalchemy import func

api_bp = Blueprint('api', __name__)

@api_bp.route('/stats')
def stats():
    programs = Program.query.filter_by(is_active=True).count()
    courses = Course.query.filter_by(is_active=True).count()
    outcomes = Outcome.query.filter_by(is_active=True).count()
    mappings = Mapping.query.count()

    return jsonify({
        'programs': programs,
        'courses': courses,
        'outcomes': outcomes,
        'mappings': mappings,
    })

@api_bp.route('/charts/coverage')
def coverage():
    from models import Outcome, Mapping
    outcomes = Outcome.query.filter_by(type='po', is_active=True).all()
    result = []
    for o in outcomes:
        total = Mapping.query.filter_by(outcome_id=o.id).count()
        result.append({
            'outcome': o.code,
            'coverage': min(total * 25, 100),
        })
    if not result:
        result = [
            {'outcome': 'PO1', 'coverage': 85},
            {'outcome': 'PO2', 'coverage': 70},
            {'outcome': 'PO3', 'coverage': 90},
            {'outcome': 'PO4', 'coverage': 60},
            {'outcome': 'PO5', 'coverage': 75},
        ]
    return jsonify(result)

@api_bp.route('/charts/mapping-status')
def mapping_status():
    levels = ['I', 'E', 'D']
    labels = {'I': 'Introductory', 'E': 'Enabling', 'D': 'Demonstrative'}
    colors = {'I': '#d69e2e', 'E': '#38a169', 'D': '#2d6a9f'}
    result = []
    total = Mapping.query.count()
    if total == 0:
        return jsonify([
            {'label': 'Mapped', 'value': 65, 'color': '#38a169'},
            {'label': 'Partial', 'value': 25, 'color': '#d69e2e'},
            {'label': 'Unmapped', 'value': 10, 'color': '#e53e3e'},
        ])
    for level in levels:
        count = Mapping.query.filter_by(coverage_level=level).count()
        result.append({
            'label': labels[level],
            'value': round(count / total * 100),
            'color': colors[level],
        })
    return jsonify(result)

@api_bp.route('/mapping-matrix')
def mapping_matrix():
    courses = Course.query.filter_by(is_active=True).order_by(Course.code).all()
    outcomes = Outcome.query.filter_by(type='po', is_active=True).order_by(Outcome.code).all()
    mappings = Mapping.query.all()
    mapping_dict = {}
    for m in mappings:
        mapping_dict[(m.course_id, m.outcome_id)] = m.coverage_level

    return jsonify({
        'courses': [{'id': c.id, 'code': c.code, 'name': c.name} for c in courses],
        'outcomes': [{'id': o.id, 'code': o.code, 'description': o.description} for o in outcomes],
        'mappings': {f'{m.course_id}-{m.outcome_id}': m.coverage_level for m in mappings},
    })
