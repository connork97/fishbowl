from datetime import datetime, timezone

from config import db

class Game(db.Model):
   __tablename__ = 'games'
   id = db.Column(db.Integer, primary_key=True)
   code = db.Column(db.String, unique=True, nullable=False)
   host_name = db.Column(db.String)
   players = db.Column(db.JSON, default=[])
   words = db.Column(db.JSON, default=[])
   teams = db.Column(db.JSON, default=[])
   rounds = db.Column(db.JSON, default=[])
   
   def to_dict(self):
       return {
           'id': self.id,
           'code': self.code,
           'host_name': self.host_name,
           'players': self.players,
           'words': self.words,
           'teams': self.teams,
           'rounds': self.rounds
       }
   