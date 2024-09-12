function filterSidebarRoutes(routes) {
	//* Helper function to check if a route has visible access
	function hasVisible(route) {
		return route.hidden !== true;
	}

	//* Recursive function to filter routes and their children
	function filterRecursive(routes) {
		return routes.filter((route) => {
			if (route.children) {
				//* Recursively filter children and keep only those with visible access
				route.children = filterRecursive(route.children);

				//* Keep the parent route if it has visible access or at least one child has visible access
				return hasVisible(route) || route.children.length > 0;
			} else {
				//* Keep the route if it has visible access
				return hasVisible(route);
			}
		});
	}

	return filterRecursive(routes);
}

export default filterSidebarRoutes;
