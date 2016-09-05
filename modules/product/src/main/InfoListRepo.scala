package lila.product

import java.util.UUID

import lila.product._
import lila.product.Category.BSONFields
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

import scala.concurrent.Future

object InfoListRepo extends InfoListRepo {
  protected def infoListTube = tube.infoListTube
  infoListTube.coll.indexesManager.ensure(
    Index(List("name" -> IndexType.Ascending, "value" -> IndexType.Ascending), unique = true)
  )

  infoListTube.coll.indexesManager.ensure(
    Index(List("kind" -> IndexType.Ascending))
  )

}

trait InfoListRepo {

  protected implicit def infoListTube: lila.db.BsTubeInColl[InfoList]

  lazy val ILCached = Env.current.ILCached

  val normalize = Category normalize _

  import InfoList.{ BSONFields => F }

  def getListInfo(name: String) = infoListTube.coll.find(BSONDocument("name" -> name, "kind" -> "cate"))
      .cursor[BSONDocument]()
      .collect[List]()map {
    items => items.map(_.getAs[String]("value")).flatten
  }

  def getGroup(name: String) = infoListTube.coll.find(BSONDocument("name" -> name, "kind" -> "group"))
      .cursor[BSONDocument]()
      .collect[List]()map {
    items => items.map(_.getAs[String]("value")).flatten
  }

  def create(name: String, value: String, kind: String = "cate") = $insert(Json.obj(F.name -> name, F.value -> value, F.kind -> kind)) >> ILCached.clearMongoCache("InfoList:query")
  def create(o: JsObject) = $insert(o)

}
