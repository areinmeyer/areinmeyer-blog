import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import config from "../../data/SiteConfig"

function Footer() {
  return (
    <StaticQuery
      query={footerQuery}
      render={data => {
        const { social } = data.site.siteMetadata
        return (
          <footer className="container">
            <div className="container" id="footer_links">
              <div className="footerItem">
                <a href={config.siteRss} style={{ flexShrink: 1 }}>
                  <Image
                    fixed={data.rssIcon.childImageSharp.fixed}
                    alt="RSS Feed"
                  />
                </a>
              </div>
              <div className="footerItem">
                <a href="https://github.com/areinmeyer">
                  <Image
                    fixed={data.githubIcon.childImageSharp.fixed}
                    alt="Github profile"
                  />
                </a>
              </div>
              <div className="footerItem">
                <a href={social.twitter}>
                  <Image
                    fixed={data.twitterIcon.childImageSharp.fixed}
                    alt="Github profile"
                  />
                </a>
              </div>
            </div>
            <div className="container" id="footer_used">
              <p className="footerItem">Thanks to:</p>
              <div className="footerItem">
                <a href="https://www.gatsbyjs.org">
                  <Image
                    fixed={data.gatsbyIcon.childImageSharp.fixed}
                    alt="Built with Gatsby"
                  />
                </a>
              </div>
              <div className="footerItem">
                <a href="https://www.netlify.com">
                  <Image
                    fixed={data.netlifyIcon.childImageSharp.fixed}
                    alt="Hosted on Netlify"
                  />
                </a>
              </div>
            </div>
          </footer>
        )
      }}
    />
  )
}

const footerQuery = graphql`
  query FooterQuery {
    gatsbyIcon: file(absolutePath: { regex: "/gatsby-icon.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    githubIcon: file(absolutePath: { regex: "/Octocat.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    netlifyIcon: file(absolutePath: { regex: "/netlify.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    rssIcon: file(absolutePath: { regex: "/rss.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    twitterIcon: file(absolutePath: { regex: "/Twitter_Logo_Blue.png/" }) {
      childImageSharp {
        fixed(width: 25, height: 25) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        social {
          twitter
        }
      }
    }
  }
`
export default Footer
