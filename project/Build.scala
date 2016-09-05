import com.typesafe.sbt.web.SbtWeb.autoImport._
import play.Play.autoImport._
import play.routes.compiler.InjectedRoutesGenerator
import play.sbt.PlayImport._
import play.twirl.sbt.Import._
import PlayKeys._
import sbt._, Keys._

object ApplicationBuild extends Build {

  import BuildSettings._
  import Dependencies._

  lazy val root = Project("shopluulinh", file(".")) enablePlugins _root_.play.sbt.PlayScala settings (
    scalaVersion := globalScalaVersion,
    resolvers ++= Dependencies.Resolvers.commons,
    scalacOptions := compilerOptions,
    incOptions := incOptions.value.withNameHashing(true),
    updateOptions := updateOptions.value.withCachedResolution(true),
    sources in doc in Compile := List(),
    // disable publishing the main API jar
    publishArtifact in (Compile, packageDoc) := false,
    // disable publishing the main sources jar
    publishArtifact in (Compile, packageSrc) := false,
    // don't stage the conf dir
    externalizeResources := false,
    // offline := true,
    libraryDependencies ++= Seq(
      scalaz, scalalib, hasher, config, apache,
      jgit, findbugs, RM, PRM, akka.actor, akka.slf4j,
      spray.caching, maxmind, scrimageCore,
      scrimageIo, batikCodec, bigPipe),
      TwirlKeys.templateImports ++= Seq(
        "lila.user.{ User, UserContext }",
        "lila.security.Permission",
        "lila.app.templating.Environment._",
        "lila.api.Context",
        "lila.common.paginator.Paginator"),
      TwirlKeys.templateFormats ++= Map("stream" -> "com.ybrikman.ping.scalaapi.bigpipe.HtmlStreamFormat"),
      TwirlKeys.templateImports ++= Vector("com.ybrikman.ping.scalaapi.bigpipe.HtmlStream", "com.ybrikman.ping.scalaapi.bigpipe._"),
      watchSources <<= sourceDirectory in Compile map { sources =>
        (sources ** "*").get
      }
      // trump sbt-web into not looking at public/
      //resourceDirectory in Assets := (sourceDirectory in Compile).value / "assets"
      ) dependsOn api aggregate api

  lazy val modules = Seq(
    common, db, hub, memo, user, image,
    security, i18n, setup, product)

  lazy val moduleRefs = modules map projectToRef
  lazy val moduleCPDeps = moduleRefs map { new sbt.ClasspathDependency(_, None) }

  lazy val api = project("api", moduleCPDeps)
    .settings(
      libraryDependencies ++= provided(
        play.api, hasher, config, apache, jgit,
        findbugs, RM)
    ) aggregate (moduleRefs: _*)


  lazy val common = project("common").settings(
    libraryDependencies ++= provided(play.api, play.test, RM)
  )

  lazy val db = project("db", Seq(common)).settings(
    libraryDependencies ++= provided(play.test, play.api, RM, PRM)
  )

  lazy val memo = project("memo", Seq(common, db)).settings(
    libraryDependencies ++= Seq(guava, findbugs, spray.caching) ++ provided(play.api, RM, PRM)
  )

  lazy val hub = project("hub", Seq(common)).settings(
    libraryDependencies ++= provided(play.api)
  )

  lazy val user = project("user", Seq(common, db, memo, hub)).settings(
    libraryDependencies ++= provided(play.api, play.test, RM, PRM, hasher)
  )

  lazy val setup = project("setup", Seq(common, db, memo, hub, product)).settings(
    libraryDependencies ++= provided(play.api, play.test, RM, PRM)
  )

  lazy val product = project("product", Seq(common, db, memo, hub)).settings(
    libraryDependencies ++= provided(play.api, play.test, RM, PRM)
  )

//  lazy val userMessage = project("userMessage", Seq(common, db, memo, hub, user)).settings(
//    libraryDependencies ++= provided(play.api, play.test, RM, PRM)
//  )

//  lazy val chatRoom = project("chatRoom", Seq(common, db, memo, hub, user)).settings(
//    libraryDependencies ++= provided(play.api, play.test, RM, PRM)
//  )


  lazy val security = project("security", Seq(common, hub, db, user)).settings(
    libraryDependencies ++= provided(play.api, RM, PRM, maxmind, hasher)
  )


  lazy val image = project("image", Seq(common, db, memo, hub)).settings(
    libraryDependencies ++= provided(play.api, play.test, RM, PRM)
  )

  lazy val i18n = project("i18n", Seq(common, db, user, hub)).settings(
    libraryDependencies ++= provided(play.api, RM, PRM, jgit)
  )

//  lazy val notification = project("notification", Seq(common, user, hub)).settings(
//    libraryDependencies ++= provided(play.api)
//  )

//  lazy val pref = project("pref", Seq(common, db, user)).settings(
//    libraryDependencies ++= provided(play.api, RM, PRM)
//  )

//  lazy val game = project("game", Seq(common, memo, db, hub, user)).settings(
//    libraryDependencies ++= provided(
//      play.api, RM, PRM)
//  )
//
//  lazy val socket = project("socket", Seq(common, hub, memo)).settings(
//    libraryDependencies ++= provided(play.api)
//  )

//  lazy val monitor = project("monitor", Seq(common, hub, socket, db)).settings(
//    libraryDependencies ++= provided(play.api, RM, PRM)
//  )
//
//  lazy val site = project("site", Seq(common, socket)).settings(
//    libraryDependencies ++= provided(play.api)
//  )
//
//  lazy val relation = project("relation", Seq(common, db, memo, hub, user, game, pref)).settings(
//    libraryDependencies ++= provided(play.api, RM, PRM)
//  )


//  lazy val search = project("search", Seq(common, hub)).settings(
//    libraryDependencies ++= provided(play.api, elastic4s)
//  )
//
//  lazy val userSearch = project("userSearch", Seq(common, hub, user, search)).settings(
//    libraryDependencies ++= provided(play.api, RM, PRM, elastic4s)
//  )


}
