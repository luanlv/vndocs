package lila.image

import lila.image._
import lila.image.Image.BSONFields
import org.joda.time.DateTime
import play.api.libs.json._
import play.modules.reactivemongo.json.BSONFormats.toJSON
import play.modules.reactivemongo.json.ImplicitBSONHandlers.JsObjectWriter
import reactivemongo.api._
import reactivemongo.api.indexes.{Index, IndexType}
import reactivemongo.bson._

import lila.common.PimpedJson._
import lila.db.api._
import lila.db.Implicits._
import reactivemongo.core.commands.SumValue

object ImageRepo extends ImageRepo {
  protected def imageTube = tube.imageTube
  imageTube.coll.indexesManager.ensure(
    Index(List("metadata.uuid" -> IndexType.Ascending))
  )
  imageTube.coll.indexesManager.ensure(
    Index(List("username" -> IndexType.Ascending))
  )
}

trait ImageRepo {

  protected implicit def imageTube: lila.db.BsTubeInColl[Image]

  import Image.{ BSONFields => F }

  val normalize = Image normalize _

  def objectWithName(name: String) = Json.obj("filename" -> Json.obj("$regex" -> (".*" + name + ".*"), "$options" -> "-i"))

  def count(name: String): Fu[Int] = $count(objectWithName(name))

  def all: Fu[List[Image]] = $find.all

  def find(name: String, page: Int) = imageTube.coll.find(BSONDocument(
      "metadata.size" -> "small",
      "filename" -> BSONDocument("$regex" -> (".*" + name + ".*"), "$options" -> "-i")
    ))
      .sort(BSONDocument("uploadDate" -> -1))
      .options(QueryOpts((page-1) * 12))
      .cursor[Image]()
      .collect[List](12)

  val enabledQuery = Json.obj("enabled" -> true)
}
