package lila.product

import play.api.libs.json.Json
import reactivemongo.bson.{Macros, BSONString, BSONHandler, BSONArray}

import scala.concurrent.duration._

import org.joda.time.DateTime


case class Category(id: Option[String], slug: String, sku: Sku, name: String, description: String)

object Category {

  type ID = String
  import lila.db.BSON.BSONJodaDateTimeHandler

  def normalize(st: String) = st.toLowerCase

  object BSONFields {
    val id = "_id"
    val slug = "slug"
    val sku = "sku"
    val name = "name"
    val description = "description"
  }

  import lila.db.BSON

  val categoryBSONHandler = new BSON[Category] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Category = Category(
      id = r strO id,
      slug = r str slug,
      sku = r get[Sku] sku,
      name = r str name,
      description = r str description)

    def writes(w: BSON.Writer, o: Category) = BSONDocument(
      id -> o.id,
      slug -> o.slug,
      sku -> o.sku,
      name -> o.name,
      description -> o.description
    )
  }
  private[product] lazy val tube = lila.db.BsTube(categoryBSONHandler)

  import reactivemongo.bson.Macros

  implicit val categoryFormat = Macros.handler[Category]
}
