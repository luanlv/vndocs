package lila.user

import lila.common.PimpedJson._
import play.api.libs.json._
import User.PlayTime

final class JsonView(isOnline: String => Boolean) {

  private implicit val profileWrites = Json.writes[Profile]
  private implicit val playTimeWrites = Json.writes[PlayTime]

  def apply(u: User, extended: Boolean) = Json.obj(
    "id" -> u.id,
    "username" -> u.username
  ) ++ extended.??(Json.obj(
      "title" -> u.title,
      "online" -> isOnline(u.id),
      "engine" -> u.engine,
      "booster" -> u.booster,
      "language" -> u.lang,
      "profile" -> u.profile.??(profileWrites.writes).noNull,
      "createdAt" -> u.createdAt,
      "seenAt" -> u.seenAt,
      "playTime" -> u.playTime
    )).noNull
}
