package lila.app
package actor

import akka.actor._
import lila.user.UserRepo
import play.twirl.api.Html
import views.{html => V}

private[app] final class Renderer extends Actor {

  def receive = {


    case "ok" =>
      sender ! "Ok"

  }

  private val spaceRegex = """\s{2,}""".r
  private def spaceless(html: Html) = Html {
    spaceRegex.replaceAllIn(html.body.replace("\\n", " "), " ")
  }
}
