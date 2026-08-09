from flask import jsonify, request
from flask_socketio import emit, join_room
from config import app, db, socketio
from uuid import uuid4 as uuid
from models import Game
import json

from utils.normalize_form_data import normalize_form_data

RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
RESET = "\033[0m"


def pretty_print_json(data, color=YELLOW):
    print(f"{color}JSON Data:")
    print(json.dumps(data, indent=3))
    print(RESET)


def pretty_print_message(message, color=YELLOW):
    print(f"{color}{message}{RESET}")


def publish_game_data(game_code: str):
    game = Game.query.filter_by(code=game_code).first()
    if not game:
        socketio.emit(
            "game_error", {"error": f"Game '{game_code}' not found"}, to=game_code
        )
        return
    socketio.emit("game_data", game.to_dict(), to=game_code)


@app.route("/")
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route("/health")
def health():
    return jsonify({"status": "Server is healthy and running"}), 200


@app.route("/games/create", methods=["POST"])
def create_game():
    form_data = request.get_json()
    pretty_print_json(form_data)

    host_name = form_data.get("hostName")
    form_data_settings = form_data.get("settings")
    teams = form_data_settings.get("teams")
    time_per_round = form_data_settings.get("timePerRound")
    minutes = time_per_round.get("minutes")
    seconds = time_per_round.get("seconds")

    settings = {
        "rounds": form_data_settings.get("rounds"),
        "round_index": 0,
        "team_index": 0,
        "words_per_player": form_data_settings.get("wordsPerPlayer"),
        "time_per_round": {
            "minutes": minutes,
            "seconds": seconds,
        },
        "remaining_time": 0,
    }

    new_game = Game(
        id=uuid().hex,
        code=uuid().hex[:4].upper(),
        host_name=host_name,
        players=[host_name],
        teams=teams,
        settings=settings,
    )

    for team in new_game.teams:
        team["player_index"] = 0
        team["score"] = 0
    # while ("O" in new_game.code) or ("0" in new_game.code):
    #     print("Code contains O or 0, generating a new code...", new_game.code)
    #     new_game.code = uuid().hex[:4].upper().replace("O" or "0", uuid().hex[:1].upper())
    new_game.teams[0]["players"] = [host_name]
    db.session.add(new_game)
    db.session.commit()
    publish_game_data(new_game.code)

    pretty_print_json(new_game.to_dict(), GREEN)
    return jsonify(new_game.to_dict())


@app.route("/games/<string:game_code>", methods=["GET"])
def get_game(game_code):
    pretty_print_message(f"Received GET request for game code {game_code}")

    game = Game.query.filter_by(code=game_code).first()

    if not game:
        return jsonify({"error": "Game not found"}), 404

    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())


@app.route("/games/<string:game_code>/join", methods=["PATCH"])
def join_game(game_code):
    form_data = request.get_json()
    pretty_print_json(form_data)

    player_name = form_data.get("playerName")

    game = Game.query.filter_by(code=game_code).first()

    if not game:
        return jsonify({"error": "Game not found"}), 404

    if player_name in game.players:
        return jsonify({"error": f"Player '{player_name}' already in the game"}), 400

    game.players = game.players + [player_name]
    db.session.commit()
    publish_game_data(game_code)

    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())


@app.route("/games/<string:game_code>/join-team", methods=["PATCH"])
def add_player_to_team(game_code):
    form_data = request.get_json()
    pretty_print_json(form_data)

    player_name = form_data.get("playerName")
    team_name = form_data.get("teamName")

    game = Game.query.filter_by(code=game_code).first()

    if not game:
        return jsonify({"error": "Game not found"}), 404

    if player_name not in game.players:
        return jsonify({"error": "Player not in the game"}), 400

    team_exists = any(team["name"] == team_name for team in game.teams)

    if not team_exists:
        return jsonify({"error": "Team not found"}), 404

    updated_teams = []

    for team in game.teams:
        updated_team = dict(team)

        if team["name"] != team_name and player_name in updated_team["players"]:
            updated_team["players"] = [
                p for p in updated_team["players"] if p != player_name
            ]

        if team["name"] == team_name and player_name not in updated_team["players"]:
            updated_team["players"] = updated_team["players"] + [player_name]

        updated_teams.append(updated_team)

    game.teams = updated_teams
    db.session.add(game)
    db.session.commit()
    publish_game_data(game_code)

    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())

@app.route("/games/<string:game_code>/update", methods=["PATCH"])
def update_game(game_code):
    form_data = request.get_json() or {}

    normalized_game_data = normalize_form_data(form_data)
    
    game_to_update = Game.query.filter_by(code=game_code).order_by(Game.created_at.desc()).first()
    
    if not game_to_update:
        return jsonify({"error": "Game not found"}), 404
    
    for key, value in normalized_game_data.items():
        setattr(game_to_update, key, value)

    db.session.commit()
    publish_game_data(game_code)
    
    return jsonify(game_to_update.to_dict()), 200
    
@app.route("/games/<string:game_code>/add-word", methods=["PATCH"])
def add_word_to_game(game_code):
    form_data = request.get_json()
    pretty_print_json(form_data)

    word = form_data.get("word")

    game = Game.query.filter_by(code=game_code).first()

    if not game:
        return jsonify({"error": "Game not found"}), 404

    if word in game.words:
        return jsonify({"error": "Word already in the game"}), 400

    game.words = game.words + [word]
    game.available_words = game.available_words + [word]
    db.session.commit()
    publish_game_data(game_code)

    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())


@app.route("/games/<string:game_code>/status", methods=["PATCH"])
def set_status(game_code):
    form_data = request.get_json()
    pretty_print_json(form_data)

    user = form_data.get("user")
    updated_game_status = form_data.get("status")

    if not user:
        return jsonify({"error": "User not provided"}), 400
    if not updated_game_status:
        return jsonify({"error": "Status not provided"}), 400

    game = Game.query.filter_by(code=game_code).first()

    if not game:
        return jsonify({"error": "Game not found"}), 404
    if user not in game.players:
        return jsonify({"error": "User not in the game"}), 403
    if user != game.host_name:
        return jsonify({"error": "Only the host can start the game"}), 403

    game.status = updated_game_status
    db.session.commit()
    publish_game_data(game_code)

    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())


@socketio.on("connect")
def handle_connect():
    pretty_print_message("Client connected", color=GREEN)


@socketio.on("disconnect")
def handle_disconnect():
    pretty_print_message("Client disconnected", color=RED)


@socketio.on("join_game")
def handle_join_game(game_code):
    pretty_print_message(f"Client joined game {game_code}", color=GREEN)
    join_room(game_code)
    publish_game_data(game_code)

if __name__ == "__main__":
    # app.run(debug=True, port=5555)
    socketio.run(app)
