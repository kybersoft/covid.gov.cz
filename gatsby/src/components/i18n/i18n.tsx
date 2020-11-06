import { useStaticQuery, graphql } from 'gatsby'
import { useLocation } from '@reach/router'

function gLang () {
  var glang = 'cs'
  const location = useLocation()
  const path = location.pathname

  if (path.replace(/^\/(\w\w)(\/.*)?$/g, '$1') === 'en') {
    glang = 'en'
  }

  return glang
}

export default function I18n (id: string, lang?: string) {
  lang = lang || gLang()
  const I18nObject = useStaticQuery(
    graphql`
      query I18nQuery {
        allTranslation {
          nodes {
            langcode
            source
            target
          }
        }
      }
    `
  )
  var I18nArray = I18nObject.allTranslation.nodes
  I18nArray = I18nArray.filter((item) => {
    return item.langcode === lang && item.source === id
  })
  if (!I18nArray.length) {
    console.error('translation not found for ' + lang + '/' + id)
    I18nArray = [{ target: id }]
  }

  return I18nArray[0].target
}

export function TRoute (route: string, lang?: string) {
  lang = lang || gLang()
  route = route === '' ? '/' : route // todo: translate current page using drupal_internal__tid
  route = route.replace(/^\/(\w\w)(\/.*)?$/g, '$2')
  const add = lang === 'cs' ? '' : '/' + lang
  return add + route
}
