import * as lodash from 'lodash'

// The regexp to identify URL tokens.
export const tokenRegExp = /\:([a-z_]+[a-z0-9_])/ig

/**
 * RouteBuilder builds a route for a specific operation.
 */
export type RouteBuilder<P> = (payload: P) => string

/**
 * buildRoute interpolates a route template and replaces placeholders with concrete values.
 *
 * @param route {string} The route template.
 * @param payload {Object} The request payload.
 * @param append {Boolean} True if the remaining payload properties should be appended as URL query parameters.
 *
 * @return {string} The interpolated route.
 */
export function buildRoute<P>(route: string, payload: P, append: boolean = false): string {

  // Extract any tokens the route may contain.
  let tokens = route.match(tokenRegExp) || []

  // If the route contains tokens, replace the tokens with the values.
  route = lodash.reduce(
    tokens,
    (route, token) => {
      // Strip the token identifier.
      const key = token.replace(/^\:/, '')

      // Replace the token in the route with the value.
      if (payload[key] !== undefined && payload[key] !== null) {
        route = route.replace(token, payload[key])
      }

      return route
    },
    route
  )

  // Check if the remaining payload properties should be appended to the query parameters.
  if (append) {
    let url = new URL(route)
    let exclude = tokens.map(token => token.replace(/^\:/, ''))

    if (lodash.isObject(payload)) {
      let remaining = lodash.omit(payload, exclude)

      // Append the query parameters to the URL.
      url = lodash.reduce(
        remaining,
        (url, value, key) => {
          url.searchParams.append(key, String(value))
          return url
        },
        url
      )
    }

    route = url.toString()
  }

  return route
}
