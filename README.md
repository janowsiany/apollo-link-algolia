# This is heavly work in progress!
## Apollo-link-algolia
apollo-link-algolia provides you a simple way to query Algolia in graphQL with [Apollo-client](https://www.apollographql.com/client/) **without building a graphQL server**

### Example
```js
const LOCATIONS_QUERY = gql`
  query LocationsQuery {
    locationsInRadius @algolia(index: "dev_LOCATIONS", aroundLatLng: "40.71, -74.01", aroundRadius: 1000)
  }
`
```
