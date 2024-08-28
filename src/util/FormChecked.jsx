import { useEffect, useState } from 'react';

const FormChecked = ({
	field,
	setValue,
	watch,
	setIsAllChecked,
	setIsSomeChecked,
}) => {
	const field = `stocks[${index}].is_checked`;
	const [isAllChecked, setIsAllChecked] = useState(false);
	const [isSomeChecked, setIsSomeChecked] = useState(false);

	useEffect(() => {
		if (isAllChecked || isSomeChecked) {
			return stockFields.forEach((item, index) => {
				setValue(field, true);
			});
		}
		if (!isAllChecked) {
			return stockFields.forEach((item, index) => {
				setValue(field, false);
			});
		}
	}, [isAllChecked]);

	const handleRowChecked = (e) => {
		const isChecked = e.target.checked;
		setValue(field, isChecked);

		let isEveryChecked = true,
			isSomeChecked = false;

		for (let item of watch('stocks')) {
			if (item.is_checked) {
				isSomeChecked = true;
			} else {
				isEveryChecked = false;
			}

			if (isSomeChecked && !isEveryChecked) {
				break;
			}
		}

		setIsAllChecked(isEveryChecked);
		setIsSomeChecked(isSomeChecked);
	};

	return handleRowChecked;
};

export default FormChecked;
