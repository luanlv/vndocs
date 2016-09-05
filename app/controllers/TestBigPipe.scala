package controllers

import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions
import com.ybrikman.ping.javaapi.bigpipe.PageletRenderOptions._
import com.ybrikman.ping.scalaapi.bigpipe.{Pagelet, HtmlStream}

import scala.concurrent.ExecutionContext

class TestBigPipe(renderOptions: PageletRenderOptions, pagelets: List[Pagelet])(implicit ec: ExecutionContext){

  /**
   * Render the Pagelets in this BigPipe. The layoutBody function will get as an argument a Map from Pagelet id to
   * HtmlStream for that Pagelet. Insert this HtmlStream into the appropriate place in your markup.
   *
   * @param layoutBody
   * @return
   */
  def render(layoutBody: Map[String, HtmlStream] => HtmlStream): HtmlStream = {
    val bodyPagelets = pagelets.map { pagelet =>
      renderOptions match {
        case ClientSide => pagelet.id -> pagelet.renderPlaceholder
        case ServerSide => pagelet.id -> pagelet.renderServerSide
      }
    }.toMap

    val footerPagelets = renderOptions match {
      case ClientSide => HtmlStream.interleave(pagelets.map(_.renderClientSide):_*)
      case ServerSide => HtmlStream.empty
    }

    layoutBody(bodyPagelets).andThen(footerPagelets)
  }
}

