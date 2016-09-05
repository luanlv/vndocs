package lila.product

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.{JsValue, JsObject}
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }
import tube.categoryTube

final class CateCached(
                      nbTtl: FiniteDuration,
                      mongoCache: MongoCache.Builder) {


  private val cache: Cache[List[Category]] = LruCache(timeToLive = 1 day)
  private val cacheIds: Cache[List[String]] = LruCache(timeToLive = 1 day)
  private val cacheAllCategory: Cache[JsValue] = LruCache(timeToLive = 1 day)

  def clearAllCache = clearCache >> clearCacheIds
  def clearCache = fuccess(cache.clear)
  def clearCacheIds = fuccess(cacheIds.clear)

  def getAllCategoryCached : Fu[JsValue] = cacheAllCategory(true) {
    CategoryRepo.getAllCategory
  }

  def listIdsRamCached(id: String): Fu[List[String]] = cacheIds(id) {
    CategoryRepo.listIds(id)
  }


  private implicit val categoryHandler = Category.categoryFormat

  private def getSupCategory = mongoCache.single[List[Category]](
    prefix = "category:query:sup",
    f = CategoryRepo.findSup,
    timeToLive = 1 day
    )

  private def getSubCategory = mongoCache.single[List[Category]](
    prefix = "category:query:sub",
    f = CategoryRepo.findSub,
    timeToLive = 1 day
    )

  private def getListSupIdCaching = mongoCache.single[List[String]](
    prefix = "category:query:listSup",
    f = CategoryRepo.getListSupId,
    timeToLive = 1 day
  )

  private def getListSubIdCaching = mongoCache.single[List[String]](
    prefix = "category:query:listSub",
    f = CategoryRepo.getListSubId,
    timeToLive = 1 day
  )

  def getSupCategoryCached: Fu[List[Category]] = getSupCategory(true)
  def getSubCategoryCached: Fu[List[Category]] = getSubCategory(true)
  def getListSupId: Fu[List[String]] = getListSupIdCaching(true)
  def getListSubId: Fu[List[String]] = getListSubIdCaching(true)

  def clearMongoCache(prefix: String) = mongoCache.removePrefix(prefix)
}