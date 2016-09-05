package lila.app
package templating

import ornicar.scalalib
import play.twirl.api.Html

import lila.api.Env.{ current => apiEnv }

object Environment
    extends scalaz.syntax.ToIdOps
    with scalaz.std.OptionInstances
    with scalaz.std.OptionFunctions
    with scalaz.std.StringInstances
    with scalaz.syntax.std.ToOptionIdOps
    with scalalib.OrnicarMonoid.Instances
    with scalalib.Zero.Instances
    with scalalib.OrnicarOption
    with lila.BooleanSteroids
    with lila.OptionSteroids
    with StringHelper
    with JsonHelper
    with AssetHelper
    with RequestHelper
    with DateHelper
    with NumberHelper
    with PaginatorHelper
    with FormHelper
    with UserHelper
    with I18nHelper
    with SecurityHelper {

  implicit val LilaHtmlMonoid = scalaz.Monoid.instance[Html](
    (a, b) => Html(a.body + b.body),
    Html(""))

  type FormWithCaptcha = (play.api.data.Form[_], lila.common.Captcha)

  def netDomain = apiEnv.Net.Domain
  def netBaseUrl = apiEnv.Net.BaseUrl
  lazy val portsString = (apiEnv.Net.Port :: apiEnv.Net.ExtraPorts) mkString ","

  def isProd = apiEnv.isProd

  def apiVersion = lila.api.Mobile.Api.currentVersion



  val openingBrace = "{"
  val closingBrace = "}"

  object icon {
    val dev = Html("&#xe000;")
    val donator = Html("&#xe001;")
    val mod = Html("&#xe002;")
  }

  def NotForKids[Html](f: => Html)(implicit ctx: lila.api.Context) =
    if (ctx.kid) Html("") else f
}
