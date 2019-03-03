require("isomorphic-fetch");
const { parse } = require("url");
const routeMatchesRequest = require("mockyeah/app/lib/routeMatchesRequest");
const { compileRoute } = require("mockyeah/app/lib/helpers");

const iterableToObject = iterable =>
  [...iterable.entries()].reduce((acc, v) => ({ ...acc, [v[0]]: v[1] }), {});

let mocks = [];

const originalFetch = global.fetch;

global.fetch = (input, init) => {
  const req = input instanceof Request ? input : new Request(input, init);

  const { method, url } = req;

  const myURL = new URL(url);

  const query = myURL.searchParams
    ? iterableToObject(myURL.searchParams)
    : undefined;
  const headers = myURL.headers ? iterableToObject(myURL.headers) : undefined;

  const matchReq = {
    method,
    url: `/${url}`,
    query,
    headers
  };

  // console.log("ADJ matchReq", matchReq);

  const matchedRoute = mocks.find(mock => {
    // console.log("ADJ mock", mock);
    return routeMatchesRequest(mock, matchReq);
  });

  // console.log("ADJ matchedRoute", matchedRoute);

  if (matchedRoute) {
    return Promise.resolve({
      json: () => Promise.resolve(matchedRoute.originalResponse.json)
    });
  }

  return originalFetch(req);
};

module.exports = _mocks => {
  mocks = _mocks.map(mock => compileRoute(...mock));
};