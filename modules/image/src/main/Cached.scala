package lila.image

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.{Json, JsObject}
import reactivemongo.bson._

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }
import tube.imageTube


final class Cached(
                      nbTtl: FiniteDuration,
                      mongoCache: MongoCache.Builder) {

  private def twoWeeksAgo = DateTime.now minusWeeks 2

  private val countCache = mongoCache.single[Int](
    prefix = "user:nb",
    f = $count(Json.obj("enabled" -> true)),
    timeToLive = nbTtl)

  def countEnabled: Fu[Int] = countCache(true)

  val leaderboardSize = 10

  private implicit val imageHandler = Image.imageFormat


  private val count = mongoCache(
    prefix = "game:count",
    f = (o: JsObject) => $count(o),
    timeToLive = 1 day)

  def countCached(name: String): Fu[Int] =  count(Json.obj(
    "metadata.size" -> "small",
    "filename" -> Json.obj("$regex" -> (".*" + name + ".*"), "$options" -> "-i"))
  )
}

