package controllers

import play.api.data._, Forms._
import play.api.i18n.Messages.Implicits._
import play.api.libs.json._
import play.api.mvc._, Results._
import play.api.Play.current

import lila.api.Context
import lila.app._
import lila.common.{ LilaCookie, HTTPRequest }
import lila.user.{ UserRepo, User => UserModel }
import views._
import lila.product.{DataForm, ProductRepo, InfoListRepo, CategoryRepo}
import scala.concurrent.Future



object Admin extends LilaController {
  private def env = Env.security
  private def api = env.api
  private def env2 = Env.product
  private def forms = env2.forms

  def adminDashboard = Open { implicit ctx =>
    Ok(views.html.admin.index()).fuccess
  }

  def listProduct(_page: Int = 1, _num: Int = 10) = Open { implicit ctx =>
    val listFu = ProductRepo.getProducts(_page, _num)
    val totalFu = ProductRepo.getTotalNum
    val resultFu = for{
      list <- listFu
      total <- totalFu
    } yield (list, total)
    resultFu map {
      r => Ok(views.html.admin.productL(r._1, _page, _num, r._2))
    }
  }

  def editProduct(code: String) = Open {implicit ctx =>

    val productFu = ProductRepo.getOneByCode(code)
    val cateFu = CategoryRepo.findSub
    val listBrandFu = Env.product.ILCached.getInfoListCached("brand")
    val listOriginFu = Env.product.ILCached.getInfoListCached("origin")
    val listLegTypeFu = Env.product.ILCached.getInfoListCached("legType")
    val listLegNumberFu = Env.product.ILCached.getInfoListCached("legNumber")
    val resultFu = for {
      product <- productFu
      cate <- cateFu
      listBrand <- listBrandFu
      listOrigin <- listOriginFu
      listLegType <- listLegTypeFu
      listLegNumber <- listLegNumberFu
    } yield (product, cate, listBrand, listOrigin, listLegType, listLegNumber)

    resultFu map {
      r => r._1 match {
        case Some(p) =>
          Ok(views.html.admin.productE(
            forms.productForm.edit.fill(lila.product.DataForm.Product(
              p._id,
              p.slug,
              p.sku.parent_id,
              p.core,
              p.info,
              p.extra,
              p.creationDate,
              p.updateDate)),
            r._2, r._3, r._4, r._5, r._6))
        case None => BadRequest
      }

    }
  }

  def editProductPost = OpenBody { implicit ctx =>
    implicit val req = ctx.body

    forms.productForm.edit.bindFromRequest.fold(
      err => {
        val cateFu = CategoryRepo.findSub
        val listBrandFu = Env.product.ILCached.getInfoListCached("brand")
        val listOriginFu = Env.product.ILCached.getInfoListCached("origin")
        val listLegTypeFu = Env.product.ILCached.getInfoListCached("legType")
        val listLegNumberFu = Env.product.ILCached.getInfoListCached("legNumber")
        val resultFu = for {
          cate <- cateFu
          listBrand <- listBrandFu
          listOrigin <- listOriginFu
          listLegType <- listLegTypeFu
          listLegNumber <- listLegNumberFu
        } yield (cate, listBrand, listOrigin, listLegType, listLegNumber)
        resultFu map {
          r => BadRequest(views.html.admin.productE(err, r._1, r._2, r._3, r._4, r._5))
        }
      },
      data => {
        ProductRepo.update(data)
        Redirect(routes.Admin.editProduct(data.core.code)).fuccess
      }
    )
  }


  def createCategory = Open {implicit ctx =>
    env2.cateCached.getSupCategoryCached map {
      list => Ok(views.html.admin.categoryC(forms.infoListForm.create, list))
    }
  }

  def createCategoryPost = OpenBody { implicit ctx =>
    implicit val req = ctx.body
    forms.categoryForm.create.bindFromRequest.fold(
      err => {
        env2.cateCached.getSupCategoryCached map {
          list => BadRequest(views.html.admin.categoryC(err, list))
        }
      },
      data => {
        val sku = CategoryRepo.findOneBySlug(data.parent_id)
        sku map {
          _ match {
            case Some(cate) => {
              CategoryRepo.create(data.slug, Some(cate), data.name, data.description)
              Redirect(routes.Admin.createCategory())
            }
            case _ => {
              CategoryRepo.create(data.slug, None, data.name, data.description)
              Redirect(routes.Admin.createCategory())
            }
          }
        }
      }
    )
  }

  def createInfoList = Open { implicit ctx =>
    Ok(views.html.admin.infolistC(forms.infoListForm.create)).fuccess
  }

  def createInfoListPost = OpenBody { implicit ctx => {
    implicit val req = ctx.body
    forms.infoListForm.create.bindFromRequest.fold(
      err => BadRequest(views.html.admin.infolistC(err)).fuccess,
      data => {
        InfoListRepo.create(data.name, data.value)
        Redirect(routes.Admin.createInfoList()).fuccess
      }
    )
  }
  }

  def createGroup = Open {implicit  ctx =>
    env2.cateCached.getSubCategoryCached map {
      list => Ok(views.html.admin.groupC(forms.categoryForm.create, list))
    }
  }

  def createGroupPost = OpenBody{implicit ctx =>
    implicit val req = ctx.body
    forms.infoListForm.create.bindFromRequest.fold(
      err => BadRequest(views.html.admin.infolistC(err)).fuccess,
      data => {
        InfoListRepo.create(data.name, data.value, "group")
        Redirect(routes.Admin.createGroup()).fuccess
      }
    )
  }


  def createProduct = Open { implicit ctx =>
    val resultFu = for {
      cate <- CategoryRepo.findSub
      listBrand <- Env.product.ILCached.getInfoListCached("brand")
      listOrigin <- Env.product.ILCached.getInfoListCached("origin")
      listLegType <- Env.product.ILCached.getInfoListCached("legType")
      listLegNumber <- Env.product.ILCached.getInfoListCached("legNumber")
    } yield (cate, listBrand, listOrigin, listLegType, listLegNumber)
    resultFu map {
      result => Ok(views.html.admin.productC(forms.productForm.create, result._1, result._2, result._3, result._4, result._5))
    }
  }

  def createProductPost = OpenBody { implicit ctx =>
    implicit val req = ctx.body
    forms.productForm.create.bindFromRequest.fold(
      err => {
        println(err.toString)
        val resultFu = for {
          cate <- CategoryRepo.findSub
          listBrand <- Env.product.ILCached.getInfoListCached("brand")
          listOrigin <- Env.product.ILCached.getInfoListCached("origin")
          listLegType <- Env.product.ILCached.getInfoListCached("legType")
          listLegNumber <- Env.product.ILCached.getInfoListCached("legNumber")
        } yield (cate, listBrand, listOrigin, listLegType, listLegNumber)
        resultFu map {
          result => BadRequest(views.html.admin.productC(err, result._1, result._2, result._3, result._4, result._5))
        }
      },
      data => {
        ProductRepo.create(data)
        Redirect(routes.Admin.createProduct()).fuccess
      }
    )
  }

  def updateMenu = Open { implicit  ctx =>
    lila.setup.Env.current.setupRepo.get("listMenu").map {
      data => {
        val arr = (data\"v").as[JsArray]
        Ok(views.html.admin.menuC(arr))
      }
    }
  }

  def updateMenuPost(id: String, preview: Boolean) =  OpenBody(BodyParsers.parse.tolerantJson) { implicit ctx =>
    implicit val req = ctx.body
    val jsArray = Json.parse(req.body.toString).as[JsArray]
    if(preview){
      Ok(views.html.index.partial.menu(jsArray.as[List[JsObject]])).fuccess
    } else {
      lila.setup.Env.current.setupRepo.update(id, jsArray)
      Ok("Menu udpated").fuccess
    }
  }

}
