package lila

package object product extends PackageObject with WithPlay {

  object tube {
    // expose user tube
    implicit lazy val productTube = Product.tube inColl Env.current.productColl
    implicit lazy val categoryTube = Category.tube inColl Env.current.categoryColl
    implicit lazy val infoListTube = InfoList.tube inColl Env.current.infoListColl
  }

}
