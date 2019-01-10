module.exports = {
  siteMetadata: {
    title: "Quantum Hydrogen",
    author: "Alex Kennedy",
    description: "A visualization of the quantum states of an electron orbiting a hydrogen atom. "
  },
  pathPrefix: "/quantum-hydrogen",
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#50efff',
        theme_color: '#50efff',
        display: 'minimal-ui',
        icon: 'src/images/logo.svg', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    // 'gatsby-plugin-offline'
  ],
}
