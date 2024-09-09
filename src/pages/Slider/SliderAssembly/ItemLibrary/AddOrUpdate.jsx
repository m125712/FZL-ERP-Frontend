import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { ITEM_LIBRARY_NULL, ITEM_LIBRARY_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setItemLibrary,
	updateItemLibrary = {
		id: null,
	},
	setUpdateItemLibrary,
}) {
	const { register, handleSubmit, errors, reset, context } = useRHF(
		ITEM_LIBRARY_SCHEMA,
		ITEM_LIBRARY_NULL
	);

	useFetchForRhfReset(
		`/item-library/${updateItemLibrary?.id}`,
		updateItemLibrary?.id,
		reset
	);

	const onClose = () => {
		setUpdateItemLibrary((prev) => ({
			...prev,
			id: null,
		}));
		reset(ITEM_LIBRARY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateItemLibrary?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/item-library/${updateItemLibrary?.id}/${data?.name}`,
				itemId: updateItemLibrary.id,
				data: data,
				updatedData: updatedData,
				setItems: setItemLibrary,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			section: "slider_assembly",
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/item-library",
			data: updatedData,
			setItems: setItemLibrary,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateItemLibrary?.id !== null
					? "Update Item Library"
					: "Item Library"
			}
			formContext={context}
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
