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
	setSection,
	updateSection = {
		id: null,
	},
	setUpdateSection,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		SECTION_SCHEMA,
		SECTION_NULL
	);

	useFetchForRhfReset(
		`/material/section/${updateSection?.id}`,
		updateSection?.id,
		reset
	);

	const onClose = () => {
		setUpdateSection((prev) => ({
			...prev,
			id: null,
		}));
		reset(SECTION_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateSection?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/material/section/${updateSection?.id}/${data?.name}`,
				itemId: updateSection.id,
				data: data,
				updatedData: updatedData,
				setItems: setSection,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/material/section",
			data: updatedData,
			setItems: setSection,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateSection?.id !== null ? "Update Section" : "Section"}
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
