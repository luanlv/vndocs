package lila.product

import java.util.UUID

import lila.product._
import lila.product.Category.BSONFields
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

object ProductRepo extends ProductRepo {
  protected def productTube = {
    val productTube1 = tube.productTube
    //initIndexes
    productTube1
  }


  def getTypeIndex(nb: Int) = {
    nb match {
      case 1 => IndexType.Ascending
      case 2 => IndexType.Descending
      case 3 => IndexType.Text
    }
  }

  val jsObject = Json.obj(
        "name" -> "index1",
        "fields" -> Json.arr(Json.obj("field" -> "core.code", "type" -> 1))
  )

  val test = (jsObject\"fields").as[List[JsObject]].map {
    obj => (obj\"field").as[String] -> getTypeIndex((obj\"type").as[Int])
  }

  def initIndexes = {
    productTube.coll.indexesManager.ensure(
      Index(test, unique = true, name =  "index1".some)
    )
  }

  def dropIndex = {
    productTube.coll.indexesManager.dropAll()
  }

  import reactivemongo.core.commands.{Count, Status, RawCommand, SumValue}
  import reactivemongo.api.commands.CollStats

  def getStats = lila.db.Env.current.db.command(Status) map { bsonMap =>
    val status = JsObjectReader read BSONDocument(bsonMap)
    status
  }

  //val command = BSONDocument( "collStats" -> "product" , "scale" -> 1, "verbose" -> true )
  //val command = BSONDocument( "dbStats" -> 1 , "scale" -> 1024*1024)
  val command = BSONDocument( "explain" -> BSONDocument("find" -> "product", "filter" -> BSONDocument("core.code" -> 1)))


  def getStats2 = lila.db.Env.current.db.command(RawCommand(command)) map { bsonMap =>
    val status = JsObjectReader read bsonMap
    status
  }

  initIndexes
}

trait ProductRepo {

  protected implicit def productTube: lila.db.BsTubeInColl[Product]

  //lazy val ILCached = Env.current.ILCached

  val normalize = Product normalize _

  import Product.{ BSONFields => F }

  def search(kw: String, nb: Int, page: Int) = {
    for {
      products <- {
        productTube.coll.find(

          BSONDocument("$or" -> BSONArray(
            BSONDocument("core.code" -> BSONDocument("$regex" -> (".*" + kw + ".*"), "$options" -> "-i")),
            BSONDocument("core.name" -> BSONDocument("$regex" -> (".*" + kw + ".*"), "$options" -> "-i"))
          ))
        )
          .options(QueryOpts((page - 1) * nb))
          .cursor[BSONDocument]()
          .collect[List](nb)
      }
      number <- {
        productTube.coll.count(
          Some(BSONDocument("$or" -> BSONArray(
            BSONDocument("core.code" -> BSONDocument("$regex" -> (".*" + kw + ".*"), "$options" -> "-i")),
            BSONDocument("core.name" -> BSONDocument("$regex" -> (".*" + kw + ".*"), "$options" -> "-i"))
          )))
        )
      }
    } yield BSONDocument("products" -> products, "total" -> number, "page" -> page, "totalPage" -> Math.ceil(number.toDouble/nb))
  }

  def getByCategory(cate: String, nb: Int, page: Int)= {
    val listIds = Env.current.cateCached.listIdsRamCached(cate).await
    for {
      products <- {
        productTube.coll.find(
          BSONDocument("sku.parent_id" -> BSONDocument("$in" -> listIds)),
          BSONDocument("_id" -> 0, "slug" -> 1, "sku.slug" -> 1, "core" -> 1, "info.image" -> BSONDocument("$slice" -> 1), "extra.saleOff1" -> 1, "extra.saleOff2" -> 1, "extra.note" -> 1)
        )
          .options(QueryOpts((page - 1) * nb))
          .cursor[BSONDocument]()
          .collect[List](nb)
      }
      number <- {
        productTube.coll.count(
          Some(BSONDocument("sku.parent_id" -> BSONDocument("$in" -> listIds)))
        )
      }
    } yield BSONDocument("products" -> products, "total" -> number, "page" -> page, "totalPage" -> Math.ceil(number.toDouble/nb))
  }

  def countByCategory(cate: String) = {
    val listIds = Env.current.cateCached.listIdsRamCached(cate).await
    productTube.coll.count(
      Some(BSONDocument("sku.parent_id" -> BSONDocument("$in" -> listIds)))
    )
  }

  def getProductByCate(cate: String, nb: Int): Fu[List[Product]] =
    productTube.coll.find(Json.obj("sku.parent_id" -> cate))
      .cursor[Product]()
      .collect[List](nb)

  def getProductBySupCate(cate: String, nb: Int): Fu[List[Product]] ={
    val listIds = Env.current.cateCached.listIdsRamCached(cate).await
    productTube.coll.find(Json.obj("sku.parent_id" -> Json.obj("$in" -> listIds)))
      .cursor[Product]()
      .collect[List](nb)
  }

  def getProductBySupCate(o: JsObject, nb: Int): Fu[List[Product]] = {
    productTube.coll.find(o)
      .cursor[Product]()
      .collect[List](nb)
  }



  def getOneByCode(code: String): Fu[Option[Product]] = productTube.coll.find(Json.obj("core.code" -> code)).cursor[Product]().headOption
  def getOneBySlug(slug: String): Fu[List[BSONDocument]] =
    productTube.coll
    .find(BSONDocument("slug" -> slug))
    .cursor[BSONDocument]()
    .collect[List]()

  def test(code: String) = productTube.coll.find(Json.obj("core.code" -> code)).cursor[Product]().collect[List]()

  def getTotalNum: Fu[Int] = $count(Json.obj())

  def getProducts(page: Int, num: Int): Fu[List[Product]] = productTube.coll.find(Json.obj())
      .options(QueryOpts((page - 1) * num))
      .cursor[Product]()
      .collect[List](10)


  def create(data: DataForm.Product) = {
    println(" create OK <==")
    val doc = makeDoc(data)
    $insert.bson(doc)
  }

  def update(data: DataForm.Product) = {
    data._id match {
      case Some(id) => {
        $update($select byId id, makeDoc(data))
      }
    }
  }

  def makeDoc(data: DataForm.Product, edit: Boolean = false) = {
    val _id = data._id match {
      case Some(_id) => _id
      case None => UUID.randomUUID().toString()
    }

    val cateO = CategoryRepo.findOneBySlug(data.sku_id).await
    val sku = cateO match {
      case Some(cate) => new Sku(cate.id.getOrElse(""), cate.name, cate.slug)
      case None => new Sku("ERROR", "EROOR", "ERROR");
    }

    val search = normalize(data.core.code + " " + data.core.name)
    val core = data.core
    val info = data.info
    val extra = data.extra

    val r1 = Random.nextDouble()
    val r2 = Random.nextDouble()

    import lila.db.BSON.BSONJodaDateTimeHandler
    val dateCreate = data.creationDate match {
      case Some(date) => date
      case None => DateTime.now
    }

    BSONDocument(
      F._id -> _id,
      F.slug -> data.slug,
      F.sku -> sku,
      F.core -> core,
      F.info -> info,
      F.extra -> extra,
      F.search -> search,
      F.rp -> BSONArray(r1, r2),
      F.creationDate -> dateCreate,
      F.updateDate -> DateTime.now
    )
  }
}
