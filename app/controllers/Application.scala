package controllers

import lila.app._
import lila.hub.actorApi.{GetUserIds, GetUids}
import lila.user.{ Cached, UserRepo, User => UserModel }
import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.http.ContentTypes
import play.api.libs.json.{JsString, JsArray, JsObject, Json}
import play.api.mvc._
import views.html.helper.form
import scala.annotation.tailrec
import scala.concurrent.Future
import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions
import com.ybrikman.ping.scalaapi.bigpipe._
import com.ybrikman.ping.scalaapi.bigpipe.HtmlStreamImplicits._

import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions._
import scala.concurrent.ExecutionContext
import lila.product.{DataForm, ProductRepo, InfoListRepo, CategoryRepo}
import play.modules.reactivemongo.json.BSONFormats._


object Application extends LilaController{

  private def env = lila.app.Env.current

  def index = Action.async {
    val products = Env.product.cached.getAllForIndex.await
    val allCategorys = lila.product.Env.current.cateCached.getAllCategoryCached.await.toString
    lila.setup.Env.current.cached.getMenu("listMenu").map {
      menu => Ok(views.html.index.index(menu, allCategorys, Json.toJson(products).toString))
    }
  }

  def product(path: String) = Action.async {
    val slug = path.split('/').last
    val product = ProductRepo.getOneBySlug(slug).map(Json.toJson(_)).await.toString
    val allCategorys = lila.product.Env.current.cateCached.getAllCategoryCached.await.toString
    lila.setup.Env.current.cached.getMenu("listMenu").map {
      menu =>
        Ok(views.html.index.product(menu, allCategorys, product))
    }
  }

  def category(slug: String, slug2: String, slug3: String) = Open {  implicit cxt =>
    val page = get("_page") match{
      case Some(int) => int.toInt
      case None      => 1
    }
    val products = lila.product.Env.current.cached.getByCategoryCached(slug, 20, page).map(Json.toJson(_)).await.toString
    val allCategorys = lila.product.Env.current.cateCached.getAllCategoryCached.await.toString
    lila.setup.Env.current.cached.getMenu("listMenu").map {
      menu => Ok(views.html.index.category(menu, allCategorys, products))
    }
  }

  def search = Open { implicit ctx =>
    val page = get("_page") match{
      case Some(int) => int.toInt
      case None      => 1
    }
    var kw = get("_kw") match {
      case Some(st) => st
      case None      => ""
    }

    val products = ProductRepo.search(kw, 20, page).map(Json.toJson(_)).await.toString
    val allCategorys = lila.product.Env.current.cateCached.getAllCategoryCached.await.toString
    lila.setup.Env.current.cached.getMenu("listMenu").map {
      menu => Ok(views.html.index.search(menu, allCategorys, products, kw))
    }
  }

}



