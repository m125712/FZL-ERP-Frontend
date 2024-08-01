import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import {
	SLIDER_ITEM_TRANSACTION_NULL,
	SLIDER_ITEM_TRANSACTION_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setItemLibrary,
	updateItemLibrary = {
		id: null,
	},
	setUpdateItemLibrary,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		SLIDER_ITEM_TRANSACTION_SCHEMA,
		SLIDER_ITEM_TRANSACTION_NULL
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
		reset(SLIDER_ITEM_TRANSACTION_NULL);
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
				uri: `/sfg/trx/${updateItemLibrary?.id}/${data?.name}`,
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
			section: "die_casting",
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/sfg/trx",
			data: updatedData,
			setItems: setItemLibrary,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={"DieCastingTransfer"}
			title={
				updateItemLibrary?.id !== null
					? "Update Item Library"
					: "Item Library"
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
