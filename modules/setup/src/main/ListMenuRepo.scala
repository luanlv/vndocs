package lila.setup

import java.util.UUID

import lila.setup._
import org.joda.time.DateTime
import play.api.libs.json._
import play.modules.reactivemongo.json.BSONFormats.toJSON
import play.modules.reactivemongo.json.ImplicitBSONHandlers.{JsObjectReader, JsObjectWriter}
import reactivemongo.api._
import reactivemongo.api.commands.CollStats
import reactivemongo.api.indexes.{Index, IndexType}
import reactivemongo.bson._

import lila.common.PimpedJson._
import lila.db.api._
import lila.db.Implicits._


import scala.concurrent.Future
import scala.util.Random

object ListMenuRepo extends ListMenuRepo {
  protected def listMenuTube =  tube.listMenuTube
}

trait ListMenuRepo {

  protected implicit def listMenuTube: lila.db.BsTubeInColl[ListMenu]

  //lazy val ILCached = Env.current.ILCached

  val normalize = ListMenu normalize _

  import ListMenu.{ BSONFields => F }


}
