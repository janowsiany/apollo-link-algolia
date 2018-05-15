import algoliasearchHelper from 'algoliasearch-helper'

import { addTypenameToDocument, getMainDefinition, hasDirectives } from 'apollo-utilities'
import { ApolloLink, Observable } from 'apollo-link'
import { graphql } from 'graphql-anywhere/lib/async'

const parameters = [
  'advancedSyntax',
  'allowTyposOnNumericTokens',
  'analytics',
  'analyticsTags',
  'aroundLatLng',
  'aroundLatLngViaIP',
  'aroundPrecision',
  'aroundRadius',
  'attributesToHighlight',
  'attributesToRetrieve',
  'attributesToSnippet',
  'disjunctiveFacets',
  'distinct',
  'facets',
  'getRankingInfo',
  'hitsPerPage',
  'ignorePlurals',
  'insideBoundingBox',
  'insidePolygon',
  'maxValuesPerFacet',
  'minimumAroundRadius',
  'minWordSizefor1Typo',
  'minWordSizefor2Typos',
  'optionalWords',
  'page',
  'query',
  'queryType',
  'removeWordsIfNoResults',
  'replaceSynonymsInHighlight',
  'restrictSearchableAttributes',
  'synonyms',
  'tagFilters',
  'typoTolerance'
]

const resolver = (fieldName, root, args, context, info) => {
  const { directives } = info

  if (!directives.algolia.index) {
    throw new Error('Algolia index name is required');
  }

  const helper = algoliasearchHelper(context.client, directives.algolia.index)

  parameters.forEach(parameter => {
    if (parameter in directives.algolia) {
      helper.setQueryParameter(parameter, directives.algolia[parameter])
    }
  })

  return helper.searchOnce()
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
