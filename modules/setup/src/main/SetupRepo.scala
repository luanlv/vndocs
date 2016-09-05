package lila.setup

import play.modules.reactivemongo.json.BSONFormats

import scala.concurrent.duration._

import org.joda.time.DateTime
import play.api.libs.json._
import reactivemongo.bson._

import spray.caching.{ LruCache, Cache }

import lila.common.LightUser
import lila.db.api.{ $count, $primitive }
import lila.db.BSON._
import lila.db.Implicits._
import lila.memo.Setup
import play.modules.reactivemongo.json.BSONFormats

final class SetupRepo(setup: Setup.Builder) {

  def insert(id: String, o: JsObject) = {
    val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]
    setup.insert(id, bson)
  }

  def insert(id: String, a: JsArray) = {
    val bsonArray = BSONFormats.toBSON(a).get.asInstanceOf[BSONArray]
    setup.insert(id, bsonArray)
  }

  def get(id: String) = setup.get(id).map {
    listDoc =>
      if(listDoc.isEmpty)
        Json.obj()
      else
        BSONFormats.BSONDocumentFormat.writes(listDoc.head).as[JsObject]
  }


  def update(id: String, a: JsArray) = {
    val bsonArray = BSONFormats.toBSON(a).get.asInstanceOf[BSONArray]
    setup.update(id, bsonArray)
  }

}


//val bson = BSONFormats.toBSON(o).get.asInstanceOf[BSONDocument]