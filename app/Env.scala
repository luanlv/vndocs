package lila.app

import akka.actor._
import com.typesafe.config.Config

final class Env(
    config: Config,
    system: ActorSystem,
    appPath: String) {

  val CliUsername = config getString "cli.username"

  private val RendererName = config getString "app.renderer.name"
  private val RouterName = config getString "app.router.name"
  private val WebPath = config getString "app.web_path"

  lazy val bus = lila.common.Bus(system)


  val testActor = {
    system.actorOf(Props(new actor.Renderer), name = RendererName)
  }

  system.actorOf(Props(new actor.Router(
    baseUrl = Env.api.Net.BaseUrl,
    protocol = Env.api.Net.Protocol,
    domain = Env.api.Net.Domain
  )), name = RouterName)


  val boot = {
    println("[boot] Preloading modules")
    List(
      Env.setup,
      Env.user,
      Env.security,
      Env.product
    )
    println("[boot] Preloading complete")
  }

  boot

}

object Env {

  lazy val current = "[boot] app" describes new Env(
    config = lila.common.PlayApp.loadConfig,
    system = lila.common.PlayApp.system,
    appPath = lila.common.PlayApp withApp (_.path.getCanonicalPath))

  def api = lila.api.Env.current
  def db = lila.db.Env.current
  def user = lila.user.Env.current
  def security = lila.security.Env.current
  def hub = lila.hub.Env.current
  def image = lila.image.Env.current
  def i18n = lila.i18n.Env.current
  def setup = lila.setup.Env.current
  def product = lila.product.Env.current
}