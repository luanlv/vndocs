package lila.user

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.JsObject
import reactivemongo.bson._

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }
import tube.userTube

final class Cached(
                      nbTtl: FiniteDuration,
                      onlineUserIdMemo: ExpireSetMemo,
                      mongoCache: MongoCache.Builder) {

  private def twoWeeksAgo = DateTime.now minusWeeks 2

  private val countCache = mongoCache.single[Int](
    prefix = "user:nb",
    f = $count(UserRepo.enabledSelect),
    timeToLive = nbTtl)

  def countEnabled: Fu[Int] = countCache(true)

  val leaderboardSize = 10

  private implicit val userHandler = User.userBSONHandler



  private case class UserPerf(user: User, perfKey: String)
  private implicit val UserPerfBSONHandler = reactivemongo.bson.Macros.handler[UserPerf]


  val topNbGame = mongoCache[Int, List[User]](
    prefix = "user:top:nbGame",
    f = UserRepo.topNbGame,
    timeToLive = 34 minutes)

  val topOnline = lila.memo.AsyncCache[Int, List[User]](
    f = UserRepo.byIdsSortRating(onlineUserIdMemo.keys, _),
    timeToLive = 10 seconds)

  val topToints = mongoCache[Int, List[User]](
    prefix = "user:toint:online",
    f = UserRepo.allSortToints,
    timeToLive = 21 minutes)

  object ranking {

  }

}
