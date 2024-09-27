import { useEffect, useState } from 'react';

export const exclude = (watch, material, entry, uuid) => {
	const [excludeItem, setExcludeItem] = useState([]);
	useEffect(() => {
		const newExcludeItems = watch(`${entry}`)?.map((item) => {
			const materialUuid = item[`${uuid}`];

			const selectedMaterial = material?.find(
				(m) => m.value === materialUuid
			);
			return {
				label: selectedMaterial?.label,
				value: selectedMaterial?.value,
			};
		});

		setExcludeItem(newExcludeItems);
	}, [watch(), material]);
	return excludeItem;
};
//recipe , shad_recipe
//{uuid,recipe_uuid}
//item?.recipe_uuid
