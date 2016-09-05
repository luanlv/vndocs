package lila.memo

import org.joda.time.DateTime
import play.api.libs.json.{JsObject, Json}
import reactivemongo.api.indexes.{IndexType, Index}
import reactivemongo.bson._
import reactivemongo.bson.Macros
import scala.concurrent.duration._
import spray.caching.{ LruCache, Cache }

import lila.db.BSON.BSONJodaDateTimeHandler
import lila.db.Types._

object Setup {

  private type Handler[T] = BSONHandler[_ <: BSONValue, T]

  final class Builder(coll: Coll) {

    def removePrefix(prefix: String) = coll.remove(BSONDocument("_id" -> BSONDocument("$regex" -> (prefix + ".*"))))
    def insert(id: String, bs: BSONDocument) = coll.insert(BSONDocument("_id" -> id, "v" -> bs))
    def insert(id: String, bs: BSONArray) = coll.insert(BSONDocument("_id" -> id, "v" -> bs))
    def update(id: String, bs: BSONArray) = {
      coll.find(BSONDocument("_id" -> id)).one[BSONDocument].await match {
        case None => insert(id, bs)
        case _ => coll.remove(BSONDocument("_id" -> id)) >> insert(id, bs)
      }
    }
    def get(id: String) = {
      coll.find(BSONDocument("_id" -> id)).one[BSONDocument].await match {
        case None => insert(id, BSONArray()) >> coll.find(BSONDocument("_id" -> id)).cursor[BSONDocument]().collect[List]()
        case _ => coll.find(BSONDocument("_id" -> id)).cursor[BSONDocument]().collect[List]()
      }
    }

  }

  def apply(coll: Coll) = new Builder(coll)
}
