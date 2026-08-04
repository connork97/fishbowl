from flask import jsonify, request
from config import app, db
from uuid import uuid4 as uuid
from models import Game
import json

RED = "\033[31m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
BLUE = "\033[34m"
RESET = "\033[0m"

def pretty_print_json(data, color=YELLOW):
    print(f"{color}JSON Data:")
    print(json.dumps(data, indent=3))
    print(RESET)

@app.route("/")
def hello_world():
    return jsonify({"message": "Hello, World!"})


@app.route("/games/create", methods=["POST"])
def create_game():
    form_data = request.get_json()
    pretty_print_json(form_data)
    
    host_name = form_data.get("hostName")
    form_data_settings = form_data.get("settings")
    teams = form_data_settings.get("teams")
    settings = {
        "rounds": form_data_settings.get("rounds"),
        "words_per_player": form_data_settings.get("wordsPerPlayer"),
        "time_per_round": form_data_settings.get("timePerRound"),
    }
    new_game = Game(
        id=uuid().hex,
        code=uuid().hex[:4].upper(),
        host_name=host_name,
        players=[host_name],
        teams=teams,
        settings=settings,
    )
    # while ("O" in new_game.code) or ("0" in new_game.code):
    #     print("Code contains O or 0, generating a new code...", new_game.code)
    #     new_game.code = uuid().hex[:4].upper().replace("O" or "0", uuid().hex[:1].upper())
    
    db.session.add(new_game)
    db.session.commit()
    
    pretty_print_json(new_game.to_dict(), GREEN)
    return jsonify(new_game.to_dict())

@app.route('/games/<string:game_code>', methods=['GET'])
def get_game(game_code):
    # form_data = request.get_json()
    # pretty_print_json(form_data)
    
    game = Game.query.filter_by(code=game_code).first()
    
    if not game:
        return jsonify({"error": "Game not found"}), 404
    
    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())

@app.route('/games/<string:game_code>/join', methods=['POST'])
def join_game(game_code):
    form_data = request.get_json()
    pretty_print_json(form_data)
    
    player_name = form_data.get("playerName")
    
    game = Game.query.filter_by(code=game_code).first()
    
    if not game:
        return jsonify({"error": "Game not found"}), 404
    
    if player_name in game.players:
        return jsonify({"error": "Player already in the game"}), 400
    
    game.players = game.players + [player_name]
    db.session.commit()
    
    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())

@app.route('/games/<string:game_code>/join-team', methods=['PATCH'])
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
    
    pretty_print_json(game.to_dict(), GREEN)
    return jsonify(game.to_dict())

if __name__ == "__main__":
    app.run(debug=True, port=5555)
