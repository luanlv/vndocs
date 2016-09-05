package lila.product

import org.joda.time.DateTime
import org.specs2.specification.core.Description
import play.api.data._
import play.api.data.Forms._
import play.api.data.validation.Constraints
import play.api.data.validation.Constraints._
import play.api.data.validation.Constraints.pattern
import lila.common.LameName
import lila.db.api.$count
import lila.db.api.$find

import play.api.data.format.Formats._
import play.api.libs.json.Json

import scala.concurrent.Future

final class DataForm {

  object productForm {
    import lila.product.tube.productTube
    private val slug = nonEmptyText
        .verifying("Url này đã tồn tại", u => !$count.exists(Json.obj("slug" -> u)).await)

    private val code = nonEmptyText
        .verifying("Mã sản phẩm đã tồn tại", u => !$count.exists(Json.obj("core.code" -> u)).await)
    val create : Form[DataForm.Product] = Form(mapping(
      "_id" -> optional(text verifying pattern(
        """[a-fA-F0-9]{24}""".r, error = "error.objectId")),
      "slug" -> slug,
      "sku_id" -> nonEmptyText,
      "core" -> mapping(
        "code" -> nonEmptyText,
        "name" -> nonEmptyText,
        "price" -> list(mapping(
          "num" -> number.verifying(min(0)),
          "price" -> number.verifying(min(0))
        )(ListPrice.apply)(ListPrice.unapply))

      )(Core.apply)(Core.unapply),
      "info" -> mapping(
        "group" -> nonEmptyText,
        "image" -> list(mapping(
          "origin" -> text,
          "small" -> text,
          "thumb" -> text
        )(ImageUrl.apply)(ImageUrl.unapply)),
        "unit" -> text,
        "stock" -> number.verifying(min(0)),
        "sold" -> number.verifying(min(0)),
        "brand" -> text,
        "origin" -> text,
        "legType" -> text,
        "legNumber" -> text
      )(Info.apply)(Info.unapply),
      "extra" -> mapping(
        "saleOff1" -> number.verifying(min(0)),
        "saleOff1" -> number.verifying(min(0)),
        "info" -> text,
        "note" -> text
      )(Extra.apply)(Extra.unapply),
      "creationDate" -> optional(longNumber),
      "updateDate" -> optional(longNumber)
     ){
      (_id, slug, sku_id, core, info, extra, creationDate, updateDate) =>
        DataForm.Product(
          _id,
          slug,
          sku_id,
          core,
          info,
          extra,
          creationDate.map(new DateTime(_)),
          updateDate.map(new DateTime(_))
        )
    } {
      product =>
        Some(
          product._id,
          product.slug,
          product.sku_id,
          product.core,
          product.info,
          product.extra,
          product.creationDate.map(_.getMillis),
          product.updateDate.map(_.getMillis)
        )
    })

    val edit : Form[DataForm.Product] = Form(mapping(
      "_id" -> optional(text),
      "slug" -> nonEmptyText,
      "sku_id" -> nonEmptyText,
      "core" -> mapping(
        "code" -> nonEmptyText,
        "name" -> nonEmptyText,
        "price" -> list(mapping(
          "num" -> number.verifying(min(0)),
          "price" -> number.verifying(min(0))
        )(ListPrice.apply)(ListPrice.unapply))

      )(Core.apply)(Core.unapply),
      "info" -> mapping(
        "group" -> nonEmptyText,
        "image" -> list(mapping(
          "origin" -> text,
          "small" -> text,
          "thumb" -> text
        )(ImageUrl.apply)(ImageUrl.unapply)),
        "unit" -> text,
        "stock" -> number.verifying(min(0)),
        "sold" -> number.verifying(min(0)),
        "brand" -> text,
        "origin" -> text,
        "legType" -> text,
        "legNumber" -> text
      )(Info.apply)(Info.unapply),
      "extra" -> mapping(
        "saleOff1" -> number.verifying(min(0)),
        "saleOff1" -> number.verifying(min(0)),
        "info" -> text,
        "note" -> text
      )(Extra.apply)(Extra.unapply),
      "creationDate" -> optional(longNumber),
      "updateDate" -> optional(longNumber)
    ){
      (_id, slug, sku_id, core, info, extra, creationDate, updateDate) =>
        DataForm.Product(
          _id,
          slug,
          sku_id,
          core,
          info,
          extra,
          creationDate.map(new DateTime(_)),
          updateDate.map(new DateTime(_))
        )
    } {
      product =>
        Some(
          product._id,
          product.slug,
          product.sku_id,
          product.core,
          product.info,
          product.extra,
          product.creationDate.map(_.getMillis),
          product.updateDate.map(_.getMillis)
        )
    })
  }

  object categoryForm {
    import lila.product.tube.categoryTube
    private val slug = nonEmptyText
        .verifying("Url này đã tồn tại", u => !$count.exists(Json.obj("slug" -> u)).await)

    val create  : Form[DataForm.Category]  = Form(mapping(
      "slug" -> slug,
      "parent_id" -> nonEmptyText,
      "name" -> nonEmptyText,
      "description" -> nonEmptyText
    )(DataForm.Category.apply)(_ => None))
  }

  object infoListForm {
    import lila.product.tube.infoListTube
    private val value = nonEmptyText

    val create  : Form[DataForm.InfoList]  = Form(mapping(
      "name" -> nonEmptyText,
      "value" -> value
    )(DataForm.InfoList.apply)(_ => None))
  }
}

object DataForm {


  case class ImageUrl(origin: String, small: String, thumb: String)


  case class Product(_id: Option[String], slug: String, sku_id: String, core: Core, info: Info, extra: Extra, creationDate: Option[DateTime], updateDate: Option[DateTime]) {

    def fill(p: lila.product.Product) = new Product(
      _id = p._id,
      slug = p.slug,
      sku_id = p.sku.parent_id,
      core = p.core,
      info = p.info,
      extra = p.extra,
      creationDate = p.creationDate,
      updateDate = p.updateDate
    )
  }

  case class Category(slug: String, parent_id: String, name: String, description: String)

  case class InfoList(name: String, value: String)
}
