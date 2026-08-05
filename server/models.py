from datetime import datetime, timezone

from config import db


# * Helper function to serialize datetime objects in ISO 8601 format with 'Z' for UTC
def serialize_datetime(dt):
    if not dt:
        return None

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    return dt.isoformat(timespec="seconds").replace("+00:00", "Z")


def created_at_column():
    return db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


def updated_at_column():
    return db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class Game(db.Model):
    __tablename__ = "games"
    id = db.Column(db.String, primary_key=True, unique=True, nullable=False)
    code = db.Column(db.String, nullable=False)
    status = db.Column(
        db.String, default="Pre-Game", server_default="Pre-Game"
    )  # Possible values: 'Pre-Game', 'Loading', 'In Progress', 'Completed'
    host_name = db.Column(db.String)
    players = db.Column(db.JSON, default=list)
    words = db.Column(db.JSON, default=list)
    available_words = db.Column(db.JSON, default=list)
    teams = db.Column(db.JSON, default=list)
    settings = db.Column(db.JSON, default=dict)
    created_at = created_at_column()
    updated_at = updated_at_column()

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "status": self.status,
            "host_name": self.host_name,
            "players": self.players,
            "words": self.words,
            "available_words": self.available_words,
            "teams": self.teams,
            "settings": self.settings,
            "created_at": serialize_datetime(self.created_at),
            "updated_at": serialize_datetime(self.updated_at),
        }
