function flattenRoutes(array) {
	const flattenedArray = [];

	function flattenRecursive(object) {
		if (!object) {
			return;
		}

		flattenedArray.push(object);

		if (object.children) {
			object.children.forEach((child) => flattenRecursive(child));
		}
	}

	array.forEach((item) => flattenRecursive(item));

	return flattenedArray;
}

export default flattenRoutes;
