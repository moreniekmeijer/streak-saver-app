from datetime import date
import os
import random
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from models import db, bcrypt, User, Streak


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    "DATABASE_URL", "sqlite:///site.db")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'mysecretkey')
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

db.init_app(app)
bcrypt.init_app(app)


# User logic
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    difficulty = data.get("difficulty")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.flush()

    streak = Streak(difficulty=difficulty, current_streak=0)
    new_user.streak.append(streak)

    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user": user.to_dict()}), 200


@app.route("/delete-account", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = int(get_jwt_identity())
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    for streak in user.streak:
        db.session.delete(streak)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "Account deleted successfully"}), 200


# Streak logic
def generate_freezes(difficulty):
    lookup = {
        "easy": [1, 2, 3],
        "medium": [0, 1, 2],
        "hard": [0, 1]
    }
    return random.choice(lookup.get(difficulty, lookup["easy"]))


def handle_missed_days(streak):
    if not streak.last_action_date:
        return 0

    last = streak.last_action_date
    today = date.today()
    diff = (today - last).days
    if diff <= 1:
        return 0

    missed = diff - 1
    used = 0
    if streak.freezes >= missed:
        streak.freezes -= missed
        used = missed
    else:
        used = streak.freezes
        streak.current_streak = 0
        streak.freezes = 1
        streak.last_action_date = None
    return used


@app.route("/streak", methods=["GET"])
@jwt_required()
def get_streak():
    user_id = int(get_jwt_identity())
    streak = Streak.query.filter_by(user_id=user_id).first()

    if not streak:
        return jsonify({"error": "No streak found"}), 404

    return jsonify(streak.to_dict())


@app.route("/streak/add", methods=["POST"])
@jwt_required()
def add_streak():
    user_id = int(get_jwt_identity())
    streak = Streak.query.filter_by(user_id=user_id).first()
    if not streak:
        return jsonify({"error": "No streak data"}), 404

    used_freezes = handle_missed_days(streak)
    earned_freezes = 0

    today = date.today()
    last = streak.last_action_date
    if last == today:
        return jsonify({"error": "Already done today"}), 400

    streak.current_streak += 1
    streak.last_action_date = today

    if streak.current_streak % 5 == 0 and streak.freezes < 3:
        gained = generate_freezes(streak.difficulty)
        streak.freezes += gained
        earned_freezes = gained

    db.session.commit()

    return jsonify({
        **streak.to_dict(),
        "used_freezes": used_freezes,
        "earned_freezes": earned_freezes
    })


@app.route("/streak/reset", methods=["POST"])
@jwt_required()
def reset_streak():
    user_id = int(get_jwt_identity())
    streak = Streak.query.filter_by(user_id=user_id).first()
    if not streak:
        return jsonify({"error": "No streak data"}), 404

    streak.current_streak = 0
    streak.freezes = 1
    streak.start_date = date.today()
    streak.last_action_date = None

    db.session.commit()
    return jsonify(streak.to_dict())


@app.route("/streak/update_difficulty", methods=["PUT"])
@jwt_required()
def update_difficulty():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    new_difficulty = data.get("difficulty")

    if new_difficulty not in ["easy", "medium", "hard"]:
        return jsonify({"error": "Invalid difficulty"}), 400

    streak = Streak.query.filter_by(user_id=user_id).first()
    if not streak:
        return jsonify({"error": "No streak found"}), 404

    streak.difficulty = new_difficulty
    db.session.commit()

    return jsonify(streak.to_dict())


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    port = int(os.environ.get("PORT", 5500))
    app.run(host="0.0.0.0", port=port, debug=False)
