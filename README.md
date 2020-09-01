## Apollo-link-algolia
**This is heavly work in progress!**

apollo-link-algolia provides you a simple way to query Algolia in graphQL with [apollo-client](https://www.apollographql.com/client/) **without building a graphQL server**.

Currently, we support features below:

1. **Query parameters**: list of supported parametes can be checked [here](https://github.com/algolia/algoliasearch-helper-js#query-parameters).

## Contents
* [Installation](#installation)
* [Usage](#Usage)

## Installation

```shell
npm install --save apollo-link-algolia
# or if you're using yarn
yarn add apollo-link-algolia
```

## Usage
### Basic

To get the results of your request, query for `hits` field

```js
const algoliaClient = algoliasearch('APPLICATION_ID', 'API_KEY')

const algoliaLink = new AlgoliaLink({ client: algoliaClient })

const client = new ApolloClient({
  link: algoliaLink,
  cache: new InMemoryCache()
})

// Simple query example
const QUERY = gql`
  query LocationsQuery {
    locationsInRadius @algolia(index: "INDEX_NAME", aroundLatLng: "40.71, -74.01", aroundRadius: 1000) {
        hits
    }
  }
`

client.query({ query: QUERY }).then(response => console.log(response))

// Multiple queries example
type Query {
    algoliaQueries(queries: [AlgoliaQuery]): [AlgoliaQueryData!]!
}

input AlgoliaQuery {
    index: String!
    query: String!
}

type AlgoliaQueryData {
    result: [AlgoliaQueryResult]!
}

type AlgoliaQueryResult {
    nbHits: Int
    hitsPerPage: Int
    hits: AlgoliaQueryResultHits
}

type AlgoliaQueryResultHits {
    createdAt: Int
    name: String
}

const QUERY = gql`
  query algoliaQueries($queries: [AlgoliaQuery]) {
    algoliaQueries @algolia(type: "AlgoliaQueryData", queries: $queries) {
      results @type(name: AlgoliaQueryResult) {
        nbHits
        hitsPerPage
        hits @type(name: AlgoliaQueryResultHits) {
          name
          createdAt
        }
      }
    }
  }
`

const queries = [{
  indexName: 'categories',
  query: 'search in categories index',
  params: {
    hitsPerPage: 3
  }
}, {
  indexName: 'products',
  query: 'first search in products',
  params: {
    hitsPerPage: 3,
    filters: '_tags:promotion'
  }
}, {
  indexName: 'products',
  query: 'another search in products',
  params: {
    hitsPerPage: 10
  }
}];

client.query({ query: QUERY, variables: { queries } }).then(response => console.log(response))
```

### Query meta fields
Aside from the `hits` field, the result may contain several other fields that contain meta information:
* `aroundLatLng`
* `automaticRadius`
* `disjunctiveFacets`
* `exhaustiveFacetsCount`
* `exhaustiveNbHits`
* `facets`
* `hierarchicalFacets`
* `hitsPerPage`
* `index`
* `nbHits`
* `nbPages`
* `page`
* `parsedQuery`
* `processingTimeMS`
* `query`
* `queryID`
* `serverUsed`
* `timeoutCounts`
* `timeoutHits`
* `userData`
* `_rawResults`
* `_state`
