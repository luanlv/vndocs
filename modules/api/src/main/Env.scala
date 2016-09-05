package lila.api

import akka.actor._
import com.typesafe.config.Config
import lila.common.PimpedConfig._
import scala.collection.JavaConversions._
import scala.concurrent.duration._

final class Env(
                   config: Config,
                   db: lila.db.Env,
                   renderer: ActorSelection,
                   router: ActorSelection,
                   system: ActorSystem,
                   userEnv: lila.user.Env,
                   val isProd: Boolean) {

  val CliUsername = config getString "cli.username"

  private[api] val apiToken = config getString "api.token"

  object Net {
    //val Domain = "localhost:9000" //config getString "net.domain"
    val Domain = "192.168.1.25:9000" //config getString "net.domain"
    val Protocol = "http" //config getString "net.protocol"
    val BaseUrl = "luanlv.info" //config getString "net.base_url"
    val Port = 9000 //config getInt "http.port"
    val ExtraPorts = (config getStringList "net.extra_ports").toList
    val AssetDomain = config getString "net.asset.domain"
    val AssetVersion = config getInt "net.asset.version"
  }
  val PrismicApiUrl = config getString "prismic.api_url"
  val EditorAnimationDuration = config duration "editor.animation.duration"

  object assetVersion {
    import reactivemongo.bson._
    private val coll = db("flag")
    private val cache = lila.memo.MixedCache.single[Int](
      f = coll.find(BSONDocument("_id" -> "asset")).one[BSONDocument].map {
        _.flatMap(_.getAs[BSONNumberLike]("version"))
          .fold(Net.AssetVersion)(_.toInt max Net.AssetVersion)
      },
      timeToLive = 1 minute,
      default = Net.AssetVersion)
    def get = cache get true
  }

  object Accessibility {
    val blindCookieName = config getString "accessibility.blind.cookie.name"
    val blindCookieMaxAge = config getInt "accessibility.blind.cookie.max_age"
    private val blindCookieSalt = config getString "accessibility.blind.cookie.salt"
    def hash(implicit ctx: lila.user.UserContext) = {
      import com.roundeights.hasher.Implicits._
      (ctx.userId | "anon").salt(blindCookieSalt).md5.hex
    }
  }


  val userApi = new UserApi(
    jsonView = userEnv.jsonView,
    makeUrl = makeUrl,
    apiToken = apiToken
   )

  private def makeUrl(path: String): String = s"${Net.BaseUrl}$path"

}

object Env {

  lazy val current = "[boot] api" describes new Env(
    config = lila.common.PlayApp.loadConfig,
    db = lila.db.Env.current,
    renderer = lila.hub.Env.current.actor.renderer,
    router = lila.hub.Env.current.actor.router,
    system = lila.common.PlayApp.system,
    userEnv = lila.user.Env.current,
    isProd = lila.common.PlayApp.isProd)
}
