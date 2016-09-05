package controllers

import java.io.File
import javax.inject.Inject


import lila.image.{ ImageRepo, Image => ImageModel }
import play.api.i18n.MessagesApi

import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.iteratee.{Iteratee, Enumerator}
import play.api.libs.json._
import play.api.mvc.{Action, Controller, Request}

import play.modules.reactivemongo.json.collection.JSONCollection
import play.modules.reactivemongo.{JSONFileToSave, MongoController, ReactiveMongoApi, ReactiveMongoComponents}
import MongoController.readFileReads

import play.modules.reactivemongo.json.JSONSerializationPack
import reactivemongo.api.indexes.{IndexType, Index}
import reactivemongo.api.{BSONSerializationPack, QueryOpts}
import reactivemongo.api.gridfs.{DefaultFileToSave, GridFS, ReadFile}
import reactivemongo.bson.BSONDocument

import reactivemongo.api.gridfs.Implicits._
import java.util.UUID
import play.modules.reactivemongo.json._
import reactivemongo.bson._
import play.api.libs.json._
import lila.image.Image
import reactivemongo.api.commands.bson.BSONFindAndModifyImplicits._
import play.modules.reactivemongo.json._, ImplicitBSONHandlers._

import scala.concurrent.Future
import images.{ImagesDaoMongo, ImagesDao}
import scala.concurrent.ExecutionContext.Implicits.global

class ImageCtrl @Inject() (
                            val messagesApi: MessagesApi,
                            val reactiveMongoApi: ReactiveMongoApi,
                            val imagesDao: ImagesDao)
  extends Controller with MongoController with ReactiveMongoComponents {

  type JSONReadFile = ReadFile[JSONSerializationPack.type, JsString]
  type BSONReadFile = ReadFile[BSONSerializationPack.type, BSONValue]

  val gridFS = reactiveMongoApi.gridFS

  gridFS.files.indexesManager.ensure(
    Index(List("metadata.uuid" -> IndexType.Ascending))
  )
  gridFS.files.indexesManager.ensure(
    Index(List("username" -> IndexType.Ascending))
  )

  def gfs = {
    import play.modules.reactivemongo.json.collection._
    GridFS[BSONSerializationPack.type](db)
  }

  gfs.files.indexesManager.ensure(
    Index(List("metadata.uuid" -> IndexType.Ascending))
  )
  gfs.files.indexesManager.ensure(
    Index(List("username" -> IndexType.Ascending))
  )

  def getList(name: String, page: Int) = Action.async { request =>
    val futureList = ImageRepo.find(name, page)
    val total = lila.image.Env.current.cached.countCached(name).map(x => Math.ceil(x/12.0).toInt)

    val FuResult = for {
      list <- futureList
      total <- total
    } yield (list, total)
    FuResult map {
      data => Ok(views.html.admin.imagesList(data._1, data._2, page, name))
    }
  }


  def uploadView = Action.async { request =>
    Future(Ok(views.html.image.upload()))
  }


  def upload = Action.async(parse.multipartFormData) { request =>
      val uuid = UUID.randomUUID().toString
      request.body.file("files[]").map { picture =>
        val file = picture.ref.file
        import java.io.File
        val filename = picture.filename
        val contentType = picture.contentType
        val length = picture.ref.file.length()

      imagesDao.save3size(gfs, file, uuid, filename, contentType) map {
        file => Ok(Json.obj("files" -> Seq(Json.obj(
          "id" -> "",
          "name" -> filename,
          "size" -> length,
          "url" -> routes.ImageCtrl.get("origin", uuid).url,
          "thumbnailUrl" -> routes.ImageCtrl.get("thumb", uuid).url,
          "deleteUrl" -> "",
          "deleteType" -> "DELETE"
        ))))
      }

    }.getOrElse {
      Future(Ok("error"))
    }
  }

  def get(size: String, uuid: String) = Action.async { request =>
    import play.modules.reactivemongo.json._
    val image = gridFS.find[BSONDocument, JSONReadFile](BSONDocument("metadata.uuid" -> uuid, "metadata.size" -> size))
    serve[JsString, JSONReadFile](gridFS)(image, CONTENT_DISPOSITION_INLINE)
  }

//  def get(size: String, uuid: String) = Action { request =>
//    Ok("OK")
//  }
}
