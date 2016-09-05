package lila.product

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
    val CollectionProduct = config getString "collection.product"
    val CollectionCategory = config getString "collection.category"
    val CollectionInfoList = config getString "collection.infolist"
  }
  import settings._

  lazy val productColl = db(CollectionProduct)
  lazy val categoryColl = db(CollectionCategory)
  lazy val infoListColl = db(CollectionInfoList)

  lazy val cached = new Cached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache)

  lazy val cateCached = new CateCached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache)

  lazy val ILCached = new ILCached(
      nbTtl = CachedNbTtl,
      mongoCache = mongoCache)

  lazy val forms = new DataForm()
}

object Env {
  lazy val current: Env = "[boot] product" describes new Env(
    config = lila.common.PlayApp loadConfig "product",
    db = lila.db.Env.current,
    mongoCache = lila.memo.Env.current.mongoCache,
    scheduler = lila.common.PlayApp.scheduler,
    timeline = lila.hub.Env.current.actor.timeline,
    system = lila.common.PlayApp.system)
}
