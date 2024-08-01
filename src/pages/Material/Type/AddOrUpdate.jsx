import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { SECTION_NULL, SECTION_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setMaterialType,
	updateMaterialType = {
		id: null,
	},
	setUpdateMaterialType,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		SECTION_SCHEMA,
		SECTION_NULL
	);

	useFetchForRhfReset(
		`/material/type/${updateMaterialType?.id}`,
		updateMaterialType?.id,
		reset
	);

	const onClose = () => {
		setUpdateMaterialType((prev) => ({
			...prev,
			id: null,
		}));
		reset(SECTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMaterialType?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/material/type/${updateMaterialType?.id}/${data?.name}`,
				itemId: updateMaterialType.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialType,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/material/type",
			data: updatedData,
			setItems: setMaterialType,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateMaterialType?.id !== null
					? "Update Material Type"
					: "Material Type"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="name" {...{ register, errors }} />
			<Input label="short_name" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
