const fileFields = ['image', 'file', 'cover_image', 'documents'];

const Formdata = (data) => {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		if (fileFields.includes(key)) {
			if (typeof value !== 'string') formData.append(key, value || '');
		} else {
			formData.append(
				key,
				value === false ? false : value === null ? null : value
			);
		}
	});

	return formData;
};

export default Formdata;
