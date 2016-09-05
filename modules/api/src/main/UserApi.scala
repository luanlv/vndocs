package lila.api

import play.api.libs.json._

import lila.common.PimpedJson._
import lila.db.api._
import lila.db.Implicits._
import lila.hub.actorApi.{ router => R }
import lila.user.tube.userTube
import lila.user.{ UserRepo, User, Profile }
import makeTimeout.short

private[api] final class  UserApi(
                                    jsonView: lila.user.JsonView,
                                    makeUrl: String => String,
                                    apiToken: String) {


  private def makeNb(nb: Option[Int], token: Option[String]) = math.min(check(token) ? 1000 | 100, nb | 10)

  private def check(token: Option[String]) = token ?? (apiToken==)
}
