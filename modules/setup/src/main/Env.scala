package lila.setup

import akka.actor._
import com.typesafe.config.Config

import lila.common.PimpedConfig._
import lila.memo.{ ExpireSetMemo, MongoCache, Setup }
import scala.concurrent.duration._

final class Env(
                 config: Config,
                 db: lila.db.Env,
                 mongoCache: MongoCache.Builder,
                 setup: Setup.Builder,
                 scheduler: lila.common.Scheduler,
                 timeline: ActorSelection,
                 system: ActorSystem) {

  private val settings = new {
    val PaginatorMaxPerPage = 10 //config getInt "paginator.max_per_page"
    val CachedNbTtl = 10 second  //config duration "cached.nb.ttl"
    val OnlineTtl = 10 second //config duration "online.ttl"
    val CollectionListMenu = "setupMenu" //config getString "collection.setupMenu"
    val CollectionListView = "setupView" //config getString "collection.setupView"
  }
  import settings._

  lazy val listMenuColl = db(CollectionListMenu)
  lazy val listViewColl = db(CollectionListView)

  lazy val cached = new Cached(
    nbTtl = CachedNbTtl,
    mongoCache = mongoCache)

  lazy val setupRepo = new SetupRepo(setup = setup)
}

object Env {
  lazy val current: Env = "[boot] product" describes new Env(
    config = lila.common.PlayApp loadConfig "product",
    db = lila.db.Env.current,
    mongoCache = lila.memo.Env.current.mongoCache,
    setup = lila.memo.Env.current.mongoSetup,
    scheduler = lila.common.PlayApp.scheduler,
    timeline = lila.hub.Env.current.actor.timeline,
    system = lila.common.PlayApp.system)
}
