'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _algoliasearchHelper = require('algoliasearch-helper');

var _algoliasearchHelper2 = _interopRequireDefault(_algoliasearchHelper);

var _apolloLink = require('apollo-link');

var _apolloUtilities = require('apollo-utilities');

var _async = require('graphql-anywhere/lib/async');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parameters = ['advancedSyntax', 'allowTyposOnNumericTokens', 'analytics', 'analyticsTags', 'aroundLatLng', 'aroundLatLngViaIP', 'aroundPrecision', 'aroundRadius', 'attributesToHighlight', 'attributesToRetrieve', 'attributesToSnippet', 'disjunctiveFacets', 'distinct', 'facets', 'filters', 'getRankingInfo', 'hitsPerPage', 'ignorePlurals', 'insideBoundingBox', 'insidePolygon', 'maxValuesPerFacet', 'minimumAroundRadius', 'minWordSizefor1Typo', 'minWordSizefor2Typos', 'optionalWords', 'page', 'query', 'queryType', 'removeWordsIfNoResults', 'replaceSynonymsInHighlight', 'restrictSearchableAttributes', 'synonyms', 'tagFilters', 'typoTolerance'];

var prettifyResult = function prettifyResult(_ref) {
  var result = _ref.result,
      _ref$type = _ref.type,
      __typename = _ref$type === undefined ? 'AlgoliaQuery' : _ref$type;

  return Object.assign({}, result.content ? result.content : result, { __typename: __typename });
};

var hasIndex = function hasIndex(directives) {
  var _directives$algolia = directives.algolia,
      queries = _directives$algolia.queries,
      index = _directives$algolia.index;


  return index || Array.isArray(queries) && queries.every(function (q) {
    return q.indexName;
  });
};

var resolver = function resolver(fieldName, root, args, context, info) {
  var directives = info.directives,
      isLeaf = info.isLeaf,
      resultKey = info.resultKey;

  var isNotAlgoliaQuery = !directives || !directives.algolia;

  if (isLeaf || isNotAlgoliaQuery) {
    var returnValue = (root || {})[resultKey] || (root || {})[fieldName];

    return returnValue !== undefined ? returnValue : null;
  }

  if (!hasIndex(directives)) {
    throw new Error('Algolia index name is required');
  }

  var helper = (0, _algoliasearchHelper2.default)(context.client, directives.algolia.index);

  // Multiple queries
  if (directives.algolia.queries) {
    return helper.client.multipleQueries(directives.algolia.queries).then(function (result) {
      return prettifyResult({ result: result, type: directives.algolia.type });
    });
  }

  // Single query
  parameters.forEach(function (parameter) {
    if (parameter in directives.algolia) {
      helper.setQueryParameter(parameter, directives.algolia[parameter]);
    }
  });

  return helper.searchOnce().then(function (result) {
    return prettifyResult({ result: result, type: directives.algolia.type });
  });
};

var AlgoliaLink = function (_ApolloLink) {
  _inherits(AlgoliaLink, _ApolloLink);

  function AlgoliaLink(_ref2) {
    var client = _ref2.client;

    _classCallCheck(this, AlgoliaLink);

    var _this = _possibleConstructorReturn(this, (AlgoliaLink.__proto__ || Object.getPrototypeOf(AlgoliaLink)).call(this));

    _this.client = client;
    return _this;
  }

  _createClass(AlgoliaLink, [{
    key: 'request',
    value: function request(operation, forward) {
      var isAlgoliaQuery = (0, _apolloUtilities.hasDirectives)(['algolia'], operation.query);

      if (!isAlgoliaQuery && forward) {
        return forward(operation);
      }

      var context = {
        client: this.client,
        findType: function findType(directives) {
          return directives.algolia.type;
        },
        mainDefinition: (0, _apolloUtilities.getMainDefinition)(operation.query) // note: not used at the moment
      };

      return new _apolloLink.Observable(function (observer) {
        (0, _async.graphql)(resolver, (0, _apolloUtilities.addTypenameToDocument)(operation.query), {}, context, operation.variables).then(function (data) {
          observer.next({ data: data });
          observer.complete();
        }).catch(function (error) {
          observer.error(error);
        });
      });
    }
  }]);

  return AlgoliaLink;
}(_apolloLink.ApolloLink);

exports.default = AlgoliaLink;