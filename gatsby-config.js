const path = require("path");
const pathPrefix = "/";
const siteMetadata = {
  title: "Vero Wiki",
  shortName: "Wiki",
  description:
    "개인 위키입니다.",
  imageUrl: "/graph-visualisation.jpg",
  siteUrl: "https://cyma-s.github.io/",
};
module.exports = {
  siteMetadata,
  pathPrefix,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `./content`,
      },
    },
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        nav: [
      
          {
            title: "Github",
            url: "https://github.com/Cyma-s/",
          },
        ],
        editUrl: "https://github.com/Cyma-s/",
        defaultColorMode: "auto",
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.shortName,
        start_url: pathPrefix,
        background_color: `#f7f0eb`,
        display: `standalone`,
        icon: path.resolve(__dirname, "./static/logo.png"),
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: siteMetadata.siteUrl,
        sitemap: `${siteMetadata.siteUrl}/sitemap/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};