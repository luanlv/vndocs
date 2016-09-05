package lila

package object setup extends PackageObject with WithPlay {

  object tube {
    // expose user tube
    implicit lazy val listMenuTube = ListMenu.tube inColl Env.current.listMenuColl
    implicit lazy val listViewTube = ListView.tube inColl Env.current.listMenuColl
  }

}
