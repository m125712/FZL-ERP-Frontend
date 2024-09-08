function matchUrl(url, item) {
	const regex = new RegExp(`^${url.replace(/:\w+/g, '[^/]+')}$`);

	return regex.test(item);
}

export default matchUrl;
