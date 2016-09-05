package lila.product

import org.joda.time.DateTime
import play.api.libs.json._


private[product] case class LightProduct(
                                             slug: String,
                                             name: String,
                                        code: String

                                        )

private[product] object LightProduct {
  implicit val formatProduct = Json.format[LightProduct]

  import reactivemongo.bson._

  private[product] implicit val BSONReader = new BSONDocumentReader[LightProduct] {
    implicit object BSONDateTimeHandler extends BSONHandler[BSONDateTime, DateTime] {
      def read(time: BSONDateTime) = new DateTime(time.value)
      def write(jdtime: DateTime) = BSONDateTime(jdtime.getMillis)
    }
    def read(doc: BSONDocument): LightProduct = {
      LightProduct(
        slug = ~doc.getAs[String]("slug"),
        name = doc.getAs[Core]("core").head.name,
        code = doc.getAs[Core]("core").head.code
//        price = doc.getAs[List[ListPrice]]("core").head.price
      )
    }
  }

}