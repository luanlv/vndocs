package controllers

import akka.pattern.ask
import lila.app._
import lila.hub.actorApi.captcha.ValidCaptcha
import makeTimeout.large
import play.api.data.Forms._
import play.api.data._
import play.api.mvc._
import views._

object Main extends LilaController {


//  def websocket = SocketOption { implicit ctx =>
//    get("sri") ?? { uid =>
////      Env.site.socketHandler(uid, ctx.userId.getOrElse("").some, get("flag")) map some
//    }
//  }

  def captchaCheck(id: String) = Open { implicit ctx =>
    Env.hub.actor.captcher ? ValidCaptcha(id, ~get("solution")) map {
      case valid: Boolean => Ok(valid fold (1, 0))
    }
  }

  def embed = Action { req =>
    Ok {
      s"""document.write("<iframe src='${Env.api.Net.BaseUrl}?embed=" + document.domain + "' class='lichess-iframe' allowtransparency='true' frameBorder='0' style='width: ${getInt("w", req) | 820}px; height: ${getInt("h", req) | 650}px;' title='Lichess free online chess'></iframe>");"""
    } as JAVASCRIPT withHeaders (CACHE_CONTROL -> "max-age=86400")
  }


}
