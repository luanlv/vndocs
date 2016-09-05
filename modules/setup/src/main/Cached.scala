package lila.setup

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.{JsArray, JsObject}
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }

final class Cached(
                    nbTtl: FiniteDuration,
                    mongoCache: MongoCache.Builder) {

  private def oneWeekAgo = DateTime.now minusWeeks 1

  private val cache: Cache[String] = LruCache(timeToLive = 5 minute)

  def clearCache = fuccess(cache.clear)

  def getMenu(id: String) : Fu[String] = cache("menu"){
    Env.current.setupRepo.get(id).map {
      data => (data\"v").as[JsArray].toString
    }
  }

}