package lila.product

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json.{JsArray, Json, JsObject}
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.{ ExpireSetMemo, MongoCache }
import tube.productTube
import play.modules.reactivemongo.json.BSONFormats._

final class Cached(
                      nbTtl: FiniteDuration,
                      mongoCache: MongoCache.Builder) {

  private def oneWeekAgo = DateTime.now minusWeeks 1

  private val cache: Cache[BSONDocument] = LruCache(timeToLive = 12 hour)
  private val cacheForIndex: Cache[List[JsObject]] = LruCache(timeToLive = 12 hour)

  def clearCache = fuccess(cache.clear)

  private implicit val productHandler = Product.productBSONHandler


  def getByCategoryCached(cate: String, nb: Int, page: Int): Fu[BSONDocument]= cache(cate + ":" + nb + ":" + page){
     ProductRepo.getByCategory(cate, nb, page)
  }

  def getAllForIndex : Fu[List[JsObject]] = cacheForIndex(true){
    Env.current.cateCached.getListSupId.map{
      supIds => supIds.map {
        item =>  Json.obj("id" -> item, "value" -> ProductRepo.getByCategory(item, 12, 1).map(products => Json.toJson(products)).await)
      }
    }
  }

}