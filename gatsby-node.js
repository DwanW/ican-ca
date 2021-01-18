const _ = require('lodash')
const path = require('path')
const locales = require('./config/i18n')
// const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

const {
  localizedSlug,
  removeTrailingSlash
} = require('./src/utils/gatsby-node-fn');

// exports.onCreatePage = ({ page, actions,}) => {
//   const {createPage, deletePage} =actions;

//   deletePage(page);

//   Ob
// }

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            frontmatter {
              template
              title
            }
            fields {
              slug
              contentType
              locale
              isDefaultLang
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const mdFiles = result.data.allMarkdownRemark.edges

    const contentTypes = _.groupBy(mdFiles, 'node.fields.contentType')

    // iterate though object with key: array pair
    _.each(contentTypes, (pages, contentType) => {
      const pagesToCreate = pages.filter(page =>
        // get pages with template field
        _.get(page, `node.frontmatter.template`)
      )
      // if pages to create is 0; return
      if (!pagesToCreate.length) return console.log(`Skipping ${contentType}`)

      console.log(`Creating ${pagesToCreate.length} ${contentType}`)

      pagesToCreate.forEach((page, index) => {
        const { slug, isDefaultLang, locale} = page.node.fields
        const { title, template } = page.node.frontmatter
        const id = page.node.id


        createPage({
          // page slug set in md frontmatter
          path: removeTrailingSlash(localizedSlug({isDefaultLang, locale, slug})),
          component: path.resolve(
            `src/templates/${String(template)}.js`
          ),
          // additional data can be passed via context
          context: {
            id,
            title,
            locale
          }
        })
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // convert frontmatter images
  fmImagesToRelative(node)

  // Create smart slugs
  // https://github.com/Vagr9K/gatsby-advanced-starter/blob/master/gatsby-node.js
  let slug
  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = getNode(node.parent)
    const parsedFilePath = path.parse(fileNode.relativePath)

    const fileBaseName =  parsedFilePath.name.split(".")[0] // index.en.md => index
    const LangExtension = parsedFilePath.name.split(".")[1] // index.en.md => en
    const defaultLang = _.findKey(locales, obj => obj.default === true) // en, zh

    const isDefaultLang = LangExtension === defaultLang // true, false

    const language = isDefaultLang ? defaultLang : LangExtension // en, zh

    if (_.get(node, 'frontmatter.slug')) {
      slug = `/${node.frontmatter.slug.toLowerCase()}/`
    } else if (
      // home page gets root slug
      fileBaseName === 'home' &&
      parsedFilePath.dir === 'pages'
    ) {
      slug = `/`
    } else if (_.get(node, 'frontmatter.title')) {
      slug = `/${_.kebabCase(parsedFilePath.dir)}/${_.kebabCase(
        node.frontmatter.title
      )}/`
    } else if (parsedFilePath.dir === '') {
      slug = `/${fileBaseName}/`
    } else {
      slug = `/${parsedFilePath.dir}/`
    }

    createNodeField({
      node,
      name: 'slug',
      value: slug
    })

    // Add contentType to node.fields
    createNodeField({
      node,
      name: 'contentType',
      value: parsedFilePath.dir
    })

    createNodeField({
      node,
      name: 'locale',
      value: language
    })

    createNodeField({
      node,
      name: 'isDefaultLang',
      value: isDefaultLang
    })
  }
}

// // Random fix for https://github.com/gatsbyjs/gatsby/issues/5700
// module.exports.resolvableExtensions = () => ['.json']
