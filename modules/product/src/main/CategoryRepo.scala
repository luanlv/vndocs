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

import scala.annotation.tailrec
import scala.concurrent.Future
import play.modules.reactivemongo.json.BSONFormats._

object CategoryRepo extends CategoryRepo {
  protected def categoryTube = tube.categoryTube
  categoryTube.coll.indexesManager.ensure(
    Index(List("slug" -> IndexType.Ascending))
  )
}

trait CategoryRepo {

  lazy val cateCached =  Env.current.cateCached

  protected implicit def categoryTube: lila.db.BsTubeInColl[Category]

  val normalize = Category normalize _

  import Category.{ BSONFields => F }

  def getAllCategory = categoryTube.coll.find(BSONDocument()).cursor[BSONDocument]().collect[List]().map(Json.toJson(_))

  def getListSupId: Fu[List[String]] = categoryTube.coll.find(BSONDocument("sku.parent_id" -> "NONE"))
      .cursor[BSONDocument]()
      .collect[List]() map {
    items => items.map(_.getAs[String]("_id")).flatten
  }

  def getListSubId: Fu[List[String]] = categoryTube.coll.find(BSONDocument("sku.parent_id" -> BSONDocument("$ne" -> "NONE")))
      .cursor[BSONDocument]()
      .collect[List]() map {
    items => items.map(_.getAs[String]("_id")).flatten
  }

  def findOneBySlug(slug: String): Fu[Option[Category]]  = $find byId normalize(slug)

  def findSup: Fu[List[Category]] = $find(Json.obj("sku.parent_id" -> "NONE"))

  def findSub: Fu[List[Category]] = $find(Json.obj("sku.parent_id" -> Json.obj("$ne" -> "NONE")))

  def findParent(skuSlug: String) = $find one Json.obj("slug" -> skuSlug)

  def listSubBySupId(id: String): Fu[List[String]] =
    categoryTube.coll.find(BSONDocument("sku.parent_id" -> id))
    .cursor[BSONDocument]()
    .collect[List]() map {
      items => items.map(_.getAs[String]("_id")).flatten
    }


  def listIds(id: String): List[String] = {
    def listSubIds(id: String) = listSubBySupId(id).await
    @tailrec
    def getList(tmp: List[String], result: List[String]): List[String] = {
      if(tmp.isEmpty){
        result
      } else {
        getList(tmp.map{id =>listSubIds(id)}.flatten, result ++ tmp)
      }
    }
    getList(listSubIds(id), List(id))
  }


  def create(slug: String, cate: Option[Category], name: String, description: String): Fu[Option[Category]] =
    !slugExists(slug) flatMap {
      _ ?? {
        $insert.bson(newCategory(slug, cate, name, description)) >> cateCached.clearMongoCache("category:query") >> named(normalize(slug))
      }
    }
  def slugExists(slug: String): Fu[Boolean] = idExists(slug)
  def idExists(slug: String): Fu[Boolean] = $count exists Json.obj("slug" -> slug)
  def named(id: String): Fu[Option[Category]] = $find byId normalize(id)

  private def newCategory(slug: String, cate: Option[Category], name: String, description: String) = {
    val nor = normalize(slug)
    val skuBson = cate match {
      case Some(category) => BSONDocument(
        "parent_id" -> category.id.getOrElse("NONE"),
        "name" -> category.name,
        "slug" -> category.slug)
      case None => BSONDocument(
        "parent_id" -> "NONE",
        "name" -> "NONE",
        "slug" -> "NONE"
      )
    }

    BSONDocument(
      F.id -> nor,
      F.slug -> nor,
      F.sku -> skuBson,
      F.name -> name,
      F.description -> description)
  }

}
