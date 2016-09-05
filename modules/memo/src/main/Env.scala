package lila.memo

import com.typesafe.config.Config
import lila.db.Types._

final class Env(config: Config,  db: lila.db.Env) {

  private val CollectionCache = config getString "collection.cache"
  private val CollectionSetup = config getString "collection.setup"

  lazy val mongoCache: MongoCache.Builder = MongoCache(db(CollectionCache))
  lazy val mongoSetup: Setup.Builder = Setup(db(CollectionSetup))

}

object Env {

  lazy val current = "[boot] memo" describes new Env(
    lila.common.PlayApp loadConfig "memo",
    lila.db.Env.current)
}
