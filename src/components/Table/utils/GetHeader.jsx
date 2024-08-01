const GetFlatHeader = (value) => {
	if (typeof value === "object") {
		return value.props.children
			.map((child) => {
				if (typeof child === "object") return child.props.children;
				return child;
			})
			.join("");
	}
	return value;
};

export { GetFlatHeader };
