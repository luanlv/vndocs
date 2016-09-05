package lila.hub

import akka.pattern.ask
import lila.hub.actorApi.map.Get
import play.api.data._

import actorApi.captcha._
import lila.common.Captcha
import lila.common.Captcha2
//import lila.hub.{ ActorMap, Sequencer }

trait CaptchedForm {

  import makeTimeout.large

  type CaptchedData = {
    def qId: String
    def solution: String
  }

  def captcher: akka.actor.ActorSelection

  def anyCaptcha: Fu[Captcha2] = {
    (captcher ? AnyCaptcha).mapTo[Captcha2]
  }

  def getCaptcha(id: String): Fu[Captcha2] =
    (captcher ? GetCaptcha(id)).mapTo[Captcha2]

  def withCaptcha[A](form: Form[A]): Fu[(Form[A], Captcha2)] = {
    anyCaptcha map (form -> _)
  }

  def validateCaptcha(data: CaptchedData) =
    getCaptcha(data.qId).await valid data.solution.trim.toLowerCase

  val captchaFailMessage = "captcha.fail"
}
