import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { BANK_NULL, BANK_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setBank,
	updateBank = {
		id: null,
	},
	setUpdateBank,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		BANK_SCHEMA,
		BANK_NULL
	);

	useFetchForRhfReset(`/bank/${updateBank?.id}`, updateBank?.id, reset);

	const onClose = () => {
		setUpdateBank((prev) => ({
			...prev,
			id: null,
		}));
		reset(BANK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateBank?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/bank/${updateBank?.id}/${data?.name}`,
				itemId: updateBank.id,
				data: data,
				updatedData: updatedData,
				setItems: setBank,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/bank",
			data: updatedData,
			setItems: setBank,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateBank?.id !== null ? "Update Bank" : "Bank"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="name" {...{ register, errors }} />
			<Input label="swift_code" {...{ register, errors }} />
			<Textarea label="address" rows="2" {...{ register, errors }} />
			<Textarea label="policy" rows="3" {...{ register, errors }} />
		</AddModal>
	);
}
