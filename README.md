# CQI Monitoring System

A **data-driven Continuous Quality Improvement (CQI) monitoring system** for curriculum mapping and outcomes alignment. Built for higher education institutions to manage program outcomes, course mapping, and accreditation reporting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12 + Flask |
| Database | MySQL (via XAMPP) |
| ORM | SQLAlchemy |
| Frontend | HTML, CSS, JavaScript + D3.js |
| Desktop | Electron (Chromium wrapper) |

## Features

- **Role-based access** — ADMIN, MANAGER, USER roles with granular permissions
- **Curriculum management** — Programs, courses, and curriculum structure
- **Outcomes bank** — Define PEOs, Program Outcomes (POs), and Course Learning Outcomes (CLOs)
- **Curriculum mapping** — D3.js heatmap matrix showing course-to-outcome coverage levels (I/E/D)
- **Dashboard** — Real-time stats cards and D3.js visualizations (coverage bar chart, mapping pie chart)
- **Admin panel** — User management and system oversight
- **Desktop app** — Electron wrapper with auto-starting Flask server

## Quick Start

```bash
# 1. Setup database
#    - Start MySQL from XAMPP
#    - Import backend/sql/schema.sql via phpMyAdmin

# 2. Install Python deps
pip install -r requirements.txt

# 3. Run web app
cd backend
python run.py

# 4. Open http://localhost:5000
#    Login: admin / password
```

## Test Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | password | ADMIN |
| manager | password | MANAGER |
| user1 | password | USER |

## License

MIT — BSIT, ICS Department, Northern Bukidnon State College
