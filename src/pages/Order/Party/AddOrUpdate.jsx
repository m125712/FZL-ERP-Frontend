import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { BUYER_NULL, BUYER_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setParty,
	updateParty = {
		id: null,
	},
	setUpdateParty,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		BUYER_SCHEMA,
		BUYER_NULL
	);

	useFetchForRhfReset(`/party/${updateParty?.id}`, updateParty?.id, reset);

	const onClose = () => {
		setUpdateParty((prev) => ({
			...prev,
			id: null,
		}));
		reset(BUYER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateParty?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/party/${updateParty?.id}/${data?.name}`,
				itemId: updateParty.id,
				data: data,
				updatedData: updatedData,
				setItems: setParty,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/party",
			data: updatedData,
			setItems: setParty,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateParty?.id !== null ? "Update Buyer" : "Buyer"}
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
