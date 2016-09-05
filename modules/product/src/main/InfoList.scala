package lila.product

import play.api.libs.json.Json
import reactivemongo.bson.{Macros, BSONString, BSONHandler, BSONArray}

import scala.concurrent.duration._

import org.joda.time.DateTime



case class InfoList(id: Option[String], name: String, value: String, kind: String)
object InfoList {

  type ID = String
  import lila.db.BSON.BSONJodaDateTimeHandler

  def normalize(st: String) = st.toLowerCase

  object BSONFields {
    val id = "_id"
    val name = "name"
    val value = "value"
    val kind = "kind"
  }

  import lila.db.BSON

  val infoListBSONHandler = new BSON[InfoList] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): InfoList = InfoList(
      id = r strO id,
      name = r str name,
      value = r str value,
      kind = r str kind)

    def writes(w: BSON.Writer, o: InfoList) = BSONDocument(
      id -> o.id,
      name -> o.name,
      value -> o.value,
      kind -> o.kind)
  }
  private[product] lazy val tube = lila.db.BsTube(infoListBSONHandler)

  import reactivemongo.bson.Macros

  implicit val infoFormat = Macros.handler[InfoList]
}
