## Apollo-link-algolia
**This is heavly work in progress!**

apollo-link-algolia provides you a simple way to query Algolia in graphQL with [apollo-client](https://www.apollographql.com/client/) **without building a graphQL server**.

Currently, we support features below:

1. **Query parameters**: list of supported parametes can be checked [here](https://github.com/algolia/algoliasearch-helper-js#query-parameters).

## Contents
* [Installation](#installation)
* [Quickstart](#Quickstart)

## Installation

```shell
npm install --save apollo-link-algolia
# or if you're using yarn
yarn add apollo-link-algolia
```

## Quickstart

```js
const algoliaClient = algoliasearch('APPLICATION_ID', 'API_KEY')

const algoliaLink = new AlgoliaLink({ client: algoliaClient })

const client = new ApolloClient({
  link: algoliaLink,
  cache: new InMemoryCache()
})

const LOCATIONS_QUERY = gql`
  query LocationsQuery {
    locationsInRadius @algolia(index: "INDEX_NAME", aroundLatLng: "40.71, -74.01", aroundRadius: 1000)
  }
`

client.query({ query: LOCATIONS_QUERY }).then(response => console.log(response))
```
