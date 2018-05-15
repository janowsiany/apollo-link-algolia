## Apollo-link-algolia
**This is heavly work in progress!**

apollo-link-algolia provides you a simple way to query Algolia in graphQL with [apollo-client](https://www.apollographql.com/client/) **without building a graphQL server**.

Currently, we support features below:

1. **Query parameters**: list of supported parametes can be checked [here](https://github.com/algolia/algoliasearch-helper-js#query-parameters).

## Contents
* [Installation](#installation)
* [Example](#example)

## Installation
``` shell
npm i apollo-link-algolia --save
```
or
``` shell
yarn add apollo-link-algolia -P
```

## Example
```js
const LOCATIONS_QUERY = gql`
  query LocationsQuery {
    locationsInRadius @algolia(index: "dev_LOCATIONS", aroundLatLng: "40.71, -74.01", aroundRadius: 1000)
  }
`
```
