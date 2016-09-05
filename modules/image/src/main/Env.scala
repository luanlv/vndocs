package lila.image

import akka.actor._
import com.typesafe.config.Config

import lila.common.PimpedConfig._
import lila.memo.{ ExpireSetMemo, MongoCache }
import scala.concurrent.duration._

final class Env(
    config: Config,
    db: lila.db.Env,
    mongoCache: MongoCache.Builder,
    scheduler: lila.common.Scheduler,
    timeline: ActorSelection,
    system: ActorSystem) {

  private val settings = new {
    val PaginatorMaxPerPage = 10 //config getInt "paginator.max_per_page"
    val CachedNbTtl = 10 second  //config duration "cached.nb.ttl"
    val OnlineTtl = 10 second //config duration "online.ttl"
    val CollectionImage =  "fs.files"  //config getString "collection.image"
  }
  import settings._

  lazy val imageColl = db(CollectionImage)

  lazy val cached = new Cached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache)
}

object Env {

  lazy val current: Env = "[boot] gridfs" describes new Env(
    config = lila.common.PlayApp loadConfig "gridfs",
    db = lila.db.Env.current,
    mongoCache = lila.memo.Env.current.mongoCache,
    scheduler = lila.common.PlayApp.scheduler,
    timeline = lila.hub.Env.current.actor.timeline,
    system = lila.common.PlayApp.system)

}
