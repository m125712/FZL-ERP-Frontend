function flattenRoutes(array) {
	const flattenedArray = [];

	function flattenRecursive(object) {
		if (!object) {
			return;
		}

		flattenedArray.push({
			path: object.path,
			element: object.element,
			name: object.name,
		});

		if (object.children) {
			object.children.forEach((child) => flattenRecursive(child));
		}
	}

	array.forEach((item) => flattenRecursive(item));

	return flattenedArray;
}

export default flattenRoutes;
