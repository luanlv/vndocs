package lila.product

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.JsObject
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }
import tube.infoListTube

final class ILCached(
                          nbTtl: FiniteDuration,
                          mongoCache: MongoCache.Builder) {


  private val cache: Cache[List[InfoList]] = LruCache(timeToLive = 10 second)

  def clearCache = fuccess(cache.clear)

  private implicit val categoryHandler = Category.categoryFormat

  private def getInfoList = mongoCache[String, List[String]](
    prefix = "InfoList:query",
    f = (name: String) => InfoListRepo.getListInfo(name),
    timeToLive = 1 day
    )

  private def getGroupList = mongoCache[String, List[String]](
    prefix = "InfoList:query:group",
    f = (name: String) => InfoListRepo.getGroup(name),
    timeToLive = 1 day
    )


  def getInfoListCached(name: String): Fu[List[String]] = getInfoList(name)

  def getGroupListCached(name: String): Fu[List[String]] = getGroupList(name)

  def clearMongoCache(prefix: String) = mongoCache.removePrefix(prefix)
}