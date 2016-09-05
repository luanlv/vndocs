package lila.image

import lila.db.BSON
import reactivemongo.bson.Macros

case class Metadata(uuid: String, size: String)

object Metadata {
  object BSONFields {
    val uuid = "uuid"
    val size = "size"
  }

  val metadataBSONHandler = new BSON[Metadata] {
    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Metadata = Metadata(
      uuid = r str uuid,
      size = r str size)

    def writes(w: BSON.Writer, o: Metadata) = BSONDocument(
      uuid -> o.uuid,
      size -> o.size
    )
  }

  implicit val metadataFormat = Macros.handler[Metadata]

}


case class Image(_id: String, filename: String, length: Long, contentType: String, metadata: Metadata)

object Image {

  type ID = String

  def normalize(username: String) = username.toLowerCase


  object BSONFields {
    val _id = "_id"
    val filename = "filename"
    val length = "length"
    val contentType = "contentType"
    val metadata = "metadata"
  }



  val imageBSONHandler = new BSON[Image] {
    import BSONFields._
    import reactivemongo.bson.BSONDocument

    def reads(r: BSON.Reader): Image = Image(
      _id = r str _id,
      filename = r str filename,
      length = r long length,
      contentType = r str contentType,
      metadata = r.get[Metadata]("metadata")
    )

    def writes(w: BSON.Writer, o: Image) = BSONDocument(
      _id -> o._id,
      filename -> o.filename,
      length -> o.length,
      contentType -> o.contentType,
      metadata -> o.metadata
    )
  }

  private[image] lazy val tube = lila.db.BsTube(imageBSONHandler)

  implicit val imageFormat = Macros.handler[Image]

}
