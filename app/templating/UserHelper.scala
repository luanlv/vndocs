package lila.app
package templating

import controllers.routes

import play.twirl.api.Html

import lila.api.Context
import lila.common.LightUser

import lila.user.{ User, UserContext }

trait UserHelper { self: StringHelper with NumberHelper =>

  def showProgress(progress: Int, withTitle: Boolean = true) = Html {
    val span = progress match {
      case 0          => ""
      case p if p > 0 => s"""<span class="positive" data-icon="N">$p</span>"""
      case p if p < 0 => s"""<span class="negative" data-icon="M">${math.abs(p)}</span>"""
    }
    val title = if (withTitle) """data-hint="Rating progression over the last twelve games"""" else ""
    val klass = if (withTitle) "progress hint--bottom" else "progress"
    s"""<span $title class="$klass">$span</span>"""
  }

//  def mVersion(id: Option[String]) = {
//    id match {
//      case None => 0
//      case Some(userId) => Env.userMessage.cached.userChatVersion(userId).await
//    }
//  }



  def showRatingDiff(diff: Int) = Html {
    diff match {
      case 0          => """<span class="rp null">+0</span>"""
      case d if d > 0 => s"""<span class="rp up">+$d</span>"""
      case d          => s"""<span class="rp down">$d</span>"""
    }
  }

  def lightUser(userId: String): Option[LightUser] = Env.user lightUser userId
  def lightUser(userId: Option[String]): Option[LightUser] = userId flatMap lightUser

  def usernameOrId(userId: String) = lightUser(userId).fold(userId)(_.titleName)
  def usernameOrAnon(userId: Option[String]) = lightUser(userId).fold(User.anonymous)(_.titleName)

  def isOnline(userId: String) = Env.user isOnline userId


  protected def userClass(
    userId: String,
    cssClass: Option[String],
    withOnline: Boolean,
    withPowerTip: Boolean = true) = {
    "user_link" :: List(
      cssClass,
      withPowerTip option "ulpt",
      withOnline option isOnline(userId).fold("online is-green", "offline")
    ).flatten
  }.mkString("class=\"", " ", "\"")


  def describeUser(user: User) = {
    val name = user.titleUsername
    val nbGames = user.count.game
    val createdAt = org.joda.time.format.DateTimeFormat forStyle "M-" print user.createdAt
  }
}
