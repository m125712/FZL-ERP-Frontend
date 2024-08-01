// Utility function to capitalize the first letter of each word and remove underscores
const capitalize = (text) => {
	return text.replace(/_/g, " ").replace(/\w\S*/g, (w) => {
		return w.replace(/^\w/, (c) => c.toUpperCase());
	});
};

export { capitalize };
