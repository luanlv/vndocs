package lila.product

import lila.db.BSON
import play.api.libs.json.Json
import reactivemongo.bson.{Macros, BSONString, BSONHandler, BSONArray}

import scala.concurrent.duration._

import org.joda.time.DateTime

case class ImageUrl(origin: String, small: String, thumb: String)
object ImageUrl{

  object BSONFields {
    val origin = "origin"
    val small = "small"
    val thumb = "thumb"
  }

  import lila.db.BSON

  val imageUrlBSONHandler = new BSON[ImageUrl] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): ImageUrl = ImageUrl(
      origin = r str origin,
      small = r str small,
      thumb = r str thumb)

    def writes(w: BSON.Writer, o: ImageUrl) = BSONDocument(
      origin -> o.origin,
      small -> o.small,
      thumb -> o.thumb
    )
  }

  import reactivemongo.bson.Macros
  implicit val imageUrlFormat = Macros.handler[ImageUrl]
}

case class ListPrice(num: Int, price: Int)
object ListPrice{
  object BSONFields {
    val num = "num"
    val price = "price"
  }

  import lila.db.BSON

  val BSONHandler = new BSON[ListPrice] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): ListPrice = ListPrice(
      num = r int num,
      price = r int  price)

    def writes(w: BSON.Writer, o: ListPrice) = BSONDocument(
      num -> o.num,
      price -> o.price)
  }

  import reactivemongo.bson.Macros
  implicit val implicitFormat = Macros.handler[ImageUrl]
}

case class Core(code: String, name: String, price: List[ListPrice])
object Core {
  object BSONFields {
    val code = "code"
    val name = "name"
    val price = "price"
  }

  import lila.db.BSON

  implicit val listPriceBSONHandler = Macros.handler[ListPrice]
  implicit val priceBSONHandler = new BSON.ListHandler[ListPrice]

  val BSONHandler = new BSON[Core] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Core = Core(
      code = r str code,
      name = r str  name,
      price = r.get[List[ListPrice]](price))

    def writes(w: BSON.Writer, o: Core) = BSONDocument(
      code -> o.code,
      name -> o.name,
      price -> o.price
    )
  }
  import reactivemongo.bson.Macros
  implicit val implicitFormat = Macros.handler[Core]
}

case class Sku(parent_id: String, name: String, slug: String)
object Sku{
  object BSONFields {
    val parent_id = "parent_id"
    val name = "name"
    val slug = "slug"
  }

  import lila.db.BSON

  val BSONHandler = new BSON[Sku] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Sku = Sku(
      parent_id = r str parent_id,
      name = r str  name,
      slug = r str  slug)

    def writes(w: BSON.Writer, o: Sku) = BSONDocument(
      parent_id -> o.parent_id,
      name -> o.name,
      slug -> o.slug)
  }

  import reactivemongo.bson.Macros
  implicit val implicitFormat = Macros.handler[Sku]
}

case class Info(group: String, image: List[ImageUrl], unit: String, stock: Int, sold: Int,  brand:String,
                origin: String, legType: String, legNumber: String)
object Info {
  object BSONFields {
    val group = "group"
    val image = "image"
    val unit = "unit"
    val stock = "stock"
    val sold = "sold"

    val brand = "brand"
    val origin = "origin"
    val legType = "legType"
    val legNumber = "legNumber"
  }

  import lila.db.BSON

  implicit val listPriceBSONHandler = Macros.handler[ImageUrl]
  implicit val priceBSONHandler = new BSON.ListHandler[ImageUrl]

  val BSONHandler = new BSON[Info] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Info = Info(
      group = r str group,
      image = r get[List[ImageUrl]]  image,
      unit = r str unit,
      stock = r int stock,
      sold = r int sold,
      brand = r str brand,
        origin = r str origin,
      legType = r str legType,
      legNumber = r str legNumber
    )

    def writes(w: BSON.Writer, o: Info) = BSONDocument(
      group -> o.group,
      image -> o.image,
      unit -> o.unit,
      stock -> o.stock,
      sold -> o.sold,
      brand -> o.brand,
      origin -> o.origin,
      legType -> o.legType,
      legNumber -> o.legNumber
    )
  }

  import reactivemongo.bson.Macros
  implicit val implicitFormat = Macros.handler[Info]
}

case class Extra(saleOff1: Int, saleOff2: Int, info: String, note: String)
object Extra{
  object BSONFields {
    val saleOff1 = "saleOff1"
    val saleOff2 = "saleOff2"
    val info = "info"
    val note = "note"
  }

  import lila.db.BSON

  val imageUrlBSONHandler = new BSON[Extra] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Extra = Extra(
      saleOff1 = r int saleOff1,
      saleOff2 = r int saleOff2,
      info = r str info,
      note = r str note
    )

    def writes(w: BSON.Writer, o: Extra) = BSONDocument(
      saleOff1 -> o.saleOff1,
      saleOff2 -> o.saleOff2,
      info -> o.info,
      note -> o.note
    )
  }

  import reactivemongo.bson.Macros
  implicit val imageUrlFormat = Macros.handler[Extra]
}

case class Product(_id: Option[String], slug: String, sku: Sku, core: Core, info: Info, extra: Extra, search: String, rp: List[Double],
                   creationDate: Option[DateTime], updateDate: Option[DateTime])

object Product {

  type ID = String
  import lila.db.BSON.BSONJodaDateTimeHandler

  def normalize(username: String) = username.toLowerCase

  object BSONFields {
    val _id = "_id"
    val slug = "slug"
    val sku = "sku"
    val core = "core"
    val info = "info"
    val extra = "extra"
    val search = "search"
    val rp = "rp"
    val creationDate = "creationDate"
    val updateDate = "updateDate"
  }

  import lila.db.BSON

  val productBSONHandler = new BSON[Product] {

    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Product = Product(
      _id = r strO _id,
      slug = r str slug,
      sku = r get[Sku] sku,
      core = r get[Core] core,
      info = r get[Info] info,
      extra = r get[Extra] extra,
      search = r str search,
      rp = r doubles rp,
      creationDate = r dateO creationDate,
      updateDate = r dateO updateDate)

    def writes(w: BSON.Writer, o: Product) = BSONDocument(
      _id -> o._id,
      slug -> o.slug,
      sku -> o.sku,
      core -> o.core,
      info -> o.info,
      extra -> o.extra,
      search -> o.search,
      rp -> o.rp,
      creationDate -> o.creationDate,
      updateDate -> o.updateDate
    )
  }
  private[product] lazy val tube = lila.db.BsTube(productBSONHandler)

  import reactivemongo.bson.Macros

  implicit val productFormat = Macros.handler[Product]
}

