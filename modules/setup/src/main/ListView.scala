package lila.setup

import play.api.libs.json.Json
import reactivemongo.bson.{Macros, BSONString, BSONHandler, BSONArray}

import scala.concurrent.duration._

import org.joda.time.DateTime



case class ListView(id: Option[String], name: String, value: String, kind: String)
object ListView {

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

  val listViewBSONHandler = new BSON[ListView] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): ListView = ListView(
      id = r strO id,
      name = r str name,
      value = r str value,
      kind = r str kind)

    def writes(w: BSON.Writer, o: ListView) = BSONDocument(
      id -> o.id,
      name -> o.name,
      value -> o.value,
      kind -> o.kind)
  }

  private[setup] lazy val tube = lila.db.BsTube(listViewBSONHandler)

  import reactivemongo.bson.Macros

  implicit val infoFormat = Macros.handler[ListView]
}
