export default class PageInfo {
	constructor(title, url, tabName = null) {
		this.title = title;
		this.url = url;
		this.tabName = tabName;
	}

	getTitle() {
		return this.title;
	}

	getUrl() {
		return this.url;
	}

	getTab() {
		return this.tabName;
	}

	getAddOrUpdateModalId() {
		return `add_or_update_${this.getTitle()}_modal`;
	}

	getDeleteModalId() {
		return `delete_${this.getTitle()}_modal`;
	}

	getFetchUrl() {
		return `/${this.getUrl()}`;
	}

	getDeleteUrl() {
		return `/${this.getUrl()}`;
	}
	getTabName() {
		return this.tabName
			.split('__')
			.map(
				(word) =>
					word.charAt(0).toUpperCase() +
					word.slice(1).replace(/_/g, ' ')
			)
			.join(': ');
	}
}
