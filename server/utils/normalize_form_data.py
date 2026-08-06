def normalize_form_data(form_data):
   
   print("Normalizing form data...")
   id = form_data.get("id")
   code = form_data.get("code")
   status = form_data.get("status")
   host_name = form_data.get("hostName")
   players = form_data.get("players")
   words = form_data.get("words")
   available_words = form_data.get("availableWords")
   # print(teams)
   # print(settings)
   teams = form_data.get("teams")
   settings = form_data.get("settings")
   
   for team in teams:
      team["name"] = team.get("name")
      team["players"] = team.get("players")
      team["player_index"] = team.get("playerIndex")
      team["score"] = team.get("score")
      
   settings["round_index"] = settings.get("roundIndex")
   settings["team_index"] = settings.get("teamIndex")
   settings["words_per_player"] = settings.get("wordsPerPlayer")
   settings["time_per_round"] = {
      "minutes": settings.get("timePerRound", {}).get("minutes", 1),
      "seconds": settings.get("timePerRound", {}).get("seconds", 0),
   }
   settings["remaining_time"] = settings.get("remainingTime", 0)
   
   updated_game = {
      "id": id,
      "code": code,
      "status": status,
      "host_name": host_name,
      "players": players,
      "words": words,
      "available_words": available_words,
      "teams": teams,
      "settings": settings,
   }
   
   
   return updated_game