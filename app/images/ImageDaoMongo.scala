package images


import java.io.File

import javax.inject.Inject
import lila.user.User
import play.api._

import play.modules.reactivemongo.json.JSONSerializationPack
import play.modules.reactivemongo.json.collection.JSONCollection
import play.modules.reactivemongo.{ReactiveMongoComponents, ReactiveMongoApi, MongoController, JSONFileToSave}
import play.mvc.Controller
import reactivemongo.api.indexes.{IndexType, Index}
import reactivemongo.api.{BSONSerializationPack, MongoDriver, MongoConnection}
import reactivemongo.api.gridfs.{DefaultFileToSave, GridFS, ReadFile}
import reactivemongo.bson._

import java.util.UUID

import com.sksamuel.scrimage.Image
import com.sksamuel.scrimage.ScaleMethod.Bicubic
import com.sksamuel.scrimage.nio.JpegWriter
import org.joda.time.DateTime
import play.api.libs.Files
import play.api.libs.iteratee.{Enumerator, Iteratee}
import play.api.libs.json.{JsObject, JsString, JsValue, Json}
import play.modules.reactivemongo.json._

import reactivemongo.api.BSONSerializationPack
import reactivemongo.api.gridfs.{DefaultFileToSave, FileToSave, ReadFile, GridFS}
import scala.concurrent.{Future, ExecutionContext}
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import reactivemongo.api.commands.bson.BSONFindAndModifyImplicits._
import ImplicitBSONHandlers._

import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import reactivemongo.api.commands.bson.BSONFindAndModifyImplicits._
import reactivemongo.api.gridfs.Implicits._
import ImplicitBSONHandlers._

import scala.concurrent.Future
import scala.util.Try

class ImagesDaoMongo extends ImagesDao {

  type JSONReadFile = ReadFile[JSONSerializationPack.type, JsString]

  type G = GridFS[BSONSerializationPack.type]

  override def save3size(gfs: G, f: File, uuid: String, filename: String, contentType: Option[String]): Future[ReadFile[BSONSerializationPack.type, BSONValue]] = {
    val enumerator = Enumerator.fromFile(f)
    val iterator1 = Enumerator.fromFile(f)
      .run(Iteratee.consume[Array[Byte]]())
    val iterator2 = Enumerator.fromFile(f)
      .run(Iteratee.consume[Array[Byte]]())

//    def data(size: String) = new JSONFileToSave(Some(filename), contentType, metadata = Json.obj("uuid" -> uuid, "size" -> size))

    def data(size: String) = DefaultFileToSave(
      id = BSONString(UUID.randomUUID().toString()),
      filename = Option(filename),
      contentType = contentType,
      uploadDate = Some(DateTime.now().getMillis),
      metadata =  BSONDocument(
        "uuid" -> uuid,
        "size" -> size
      )
    )


    iterator1.flatMap {
      bytes => {
        val enumerator: Enumerator[Array[Byte]] = Enumerator.outputStream(
          out => {
            implicit val writer = JpegWriter().withProgressive(true)
            Image(bytes).scaleTo(80, 80, Bicubic).forWriter(writer).write(out)
          }
        )
        gfs.save(enumerator, data("thumb"))
      }
    }

    iterator2.flatMap {
      bytes => {
        val enumerator: Enumerator[Array[Byte]] = Enumerator.outputStream(
          out => {
            implicit val writer = JpegWriter().withProgressive(true)
            Image(bytes).scaleTo(180, 150, Bicubic).forWriter(writer).write(out)
          }
        )
        gfs.save(enumerator, data("small"))
      }
    }

    gfs.save(enumerator, data("origin"))
  }

}

object ImagesDaoMongo {

}

