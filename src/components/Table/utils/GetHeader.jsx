const GetFlatHeader = (value) => {
	if (typeof value === 'object') {
		const { children } = value.props;

		if (typeof children === 'string') {
			return children;
		}

		return children
			.map((child) => {
				if (typeof child === 'object') return child.props.children;
				return child;
			})
			.join('');
	}
	return value;
};

export { GetFlatHeader };
