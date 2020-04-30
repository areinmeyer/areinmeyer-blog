const config = {
    siteTitle: 'areinmeyer.dev',
    siteTitleShort: 'areinmeyer.dev',
    siteTitleAlt: 'areinmeyer.dev',
    siteAuthor: 'Allen Reinmeyer',
    siteUrl: 'https://areinmeyer.dev',
    repo: 'https://github.com/areinmeyer/areinmeyer-blog',
    pathPrefix: '',
    dateFromFormat: 'YYYY-MM-DD',
    dateFormat: 'MMMM Do, YYYY',
    siteDescription:
      'Random musings on random topics from a random developer',
    siteRss: '/rss.xml',
    googleAnalyticsID: 'UA-164923105-1',
    postDefaultCategoryID: 'Tech',
    userTwitter: 'areinmeyer',
    userEmail: 'areinmeyer@gmail.com',
    menuLinks: [
      {
        name: 'About',
        link: '/me/',
      },
      {
        name: 'Articles',
        link: '/blog/',
      },
    ],
    themeColor: '#3F80FF', // Used for setting manifest and progress theme colors.
    backgroundColor: '#ffffff',
  }

  // Make sure pathPrefix is empty if not needed
  if (config.pathPrefix === '/') {
    config.pathPrefix = ''
  } else {
    // Make sure pathPrefix only contains the first forward slash
    config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, '')}`
  }

  // Make sure siteUrl doesn't have an ending forward slash
  if (config.siteUrl.substr(-1) === '/') config.siteUrl = config.siteUrl.slice(0, -1)

  // Make sure siteRss has a starting forward slash
  if (config.siteRss && config.siteRss[0] !== '/') config.siteRss = `/${config.siteRss}`

  module.exports = config