package controllers

import lila.product.ProductRepo
import play.api.data._, Forms._
import play.api.i18n.Messages.Implicits._
import play.api.libs.concurrent.Promise
import play.api.libs.json._
import play.api.mvc._, Results._
import play.api.Play.current

import lila.api.Context
import lila.app._
import lila.common.{ LilaCookie, HTTPRequest }
import lila.user.{ UserRepo, User => UserModel }
import views._
import scala.concurrent.Future
import play.modules.reactivemongo.json.BSONFormats._
//import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.duration._

object API extends LilaController {

  def getGroup(name: String) = Open { implicit ctx =>
    Env.product.ILCached.getGroupListCached(name) map {
      list => Ok(Json.toJson(list))
    }
  }

  def getProduct(url: String) = Open { implicit ctx =>
    ProductRepo.getOneBySlug(url).map{
      product => Ok(Json.toJson(product))
    }
  }

  def getProducts(category: String) = Open { implicit ctx =>
    val page = get("_page") match{
      case Some(int) => int.toInt
      case None      => 1
    }
    lila.product.Env.current.cached.getByCategoryCached(category, 20, page).map {
      products => {
        Ok(Json.toJson(products))
      }
    }
  }

  def getProductsForIndex = Open { implicit  ctx =>
    Env.product.cached.getAllForIndex.map {
      result => Ok(Json.toJson(result))
    }
  }

  def search = Open { implicit ctx =>
    var kw = get("_kw") match {
      case Some(st) => st
      case None      => ""
    }
    val page = get("_page") match{
      case Some(int) => int.toInt
      case None      => 1
    }
    ProductRepo.search(kw, 20, page) map {
      products => {
        Ok(Json.toJson(products))
      }
    }
  }

}
