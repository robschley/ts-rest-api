
export enum Method {
  Connect = 'CONNECT',
  Delete = 'DELETE',
  Head = 'HEAD',
  Get = 'GET',
  Options = 'OPTIONS',
  Patch = 'PATCH',
  Post = 'POST',
  Put = 'PUT',
  Trace = 'TRACE',
}

/**
 * Check if a request can have a body.
 *
 * @param method The request method.
 * @return True if the request method can have a body, false otherwise.
 */
export function canHaveBody(method: Method): boolean {
  if (method === Method.Get || method === Method.Head || method === Method.Delete) {
    return false
  }

  return true
}