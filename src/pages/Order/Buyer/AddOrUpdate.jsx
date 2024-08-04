import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { useOrderBuyer } from "@/state/Order/buyer";
import { Input } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { BUYER_NULL, BUYER_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setBuyer,
	updateBuyer = {
		id: null,
	},
	setUpdateBuyer,
}) {
	const { data, isLoading, isError, updateData } = useOrderBuyer();
	const { register, handleSubmit, errors, reset } = useRHF(
		BUYER_SCHEMA,
		BUYER_NULL
	);

	useFetchForRhfReset(`/buyer/${updateBuyer?.id}`, updateBuyer?.id, reset);

	const onClose = () => {
		setUpdateBuyer((prev) => ({
			...prev,
			id: null,
		}));
		reset(BUYER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateBuyer?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/buyer/${updateBuyer?.id}/${data?.name}`,
				itemId: updateBuyer.id,
				data: data,
				updatedData: updatedData,
				setItems: setBuyer,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/buyer",
			data: updatedData,
			setItems: setBuyer,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateBuyer?.id !== null ? "Update Buyer" : "Buyer"}
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
