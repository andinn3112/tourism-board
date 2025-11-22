export function matchRoute(path, routes) {
  return routes.some((route) => path === route || path.startsWith(route + "/"));
}

export function normalizePath(path) {
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}
