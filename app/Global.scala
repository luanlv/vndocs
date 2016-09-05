import lila.common.HTTPRequest
import play.api.mvc._
import play.api.mvc.Results._
import play.api.{Logger, Application, GlobalSettings, Mode}

import lila.hub.actorApi.monitor.AddRequest

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    lila.app.Env.current
  }

  override def onRouteRequest(req: RequestHeader): Option[Handler] = {
//    lila.monitor.Env.current.reporting ! AddRequest
    super.onRouteRequest(req)
  }

  override def onStop(app: Application) {
    Logger.info("Application shutdown...")
  }

}
