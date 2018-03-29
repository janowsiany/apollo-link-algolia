import algoliasearchHelper from 'algoliasearch-helper'

import { addTypenameToDocument, getMainDefinition, hasDirectives } from 'apollo-utilities'
import { ApolloLink, Observable } from 'apollo-link'
import { graphql } from 'graphql-anywhere/lib/async'

const resolver = (fieldName, root, args, context, info) => {
  const { directives } = info

  if (!directives.algolia.index) {
    // todo
  }

  const helper = algoliasearchHelper(context.client, directives.algolia.index)

  if (directives.algolia.query) {
    helper.setQuery(directives.algolia.query)
  }

  if (directives.algolia.aroundLatLng) {
    helper.setQueryParameter('aroundLatLng', directives.algolia.aroundLatLng)
  }

  if (directives.algolia.aroundRadius) {
    helper.setQueryParameter('aroundRadius', directives.algolia.aroundRadius)
  }

  return helper.searchOnce().then(({ content: { hits }}) => hits || null)
}

export default class AlgoliaLink extends ApolloLink {
  constructor({ client }) {
    super()
    this.client = client
  }

  request(operation, forward) {
    const isAlgoliaQuery = hasDirectives(['algolia'], operation.query)

    if (!isAlgoliaQuery && forward) {
      return forward(operation)
    }

    const context = {
      client: this.client,
      findType: directives => directives.algolia.type,
      mainDefinition: getMainDefinition(operation.query) // note: not used at the moment
    }

    return new Observable(observer => {
      graphql(
        resolver,
        addTypenameToDocument(operation.query),
        {},
        context,
        operation.variables
      )
      .then(data => {
        observer.next({ data })
        observer.complete()
      })
      .catch(error => {
        observer.error(error)
      })
    })
  }
}
