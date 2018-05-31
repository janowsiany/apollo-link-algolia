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

const LOCATIONS_QUERY = gql`
  query LocationsQuery {
    locationsInRadius @algolia(index: "INDEX_NAME", aroundLatLng: "40.71, -74.01", aroundRadius: 1000) {
        hits
    }
  }


client.query({ query: LOCATIONS_QUERY }).then(response => console.log(response))
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
