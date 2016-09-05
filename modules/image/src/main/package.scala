package lila

import play.Logger
import play.modules.reactivemongo.ReactiveMongoComponents


package object image  extends PackageObject with WithPlay{

  object tube {

    // expose user tube
    implicit lazy val imageTube = Image.tube inColl Env.current.imageColl

  }

}
