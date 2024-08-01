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
	THREAD_COUNT_LENGTH_NULL,
	THREAD_COUNT_LENGTH_SCHEMA,
} from "@util/Schema";

export default function Index({
	modalId = "",
	setCountLength,
	updateCountLength = {
		id: null,
	},
	setUpdateCountLength,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		THREAD_COUNT_LENGTH_SCHEMA,
		THREAD_COUNT_LENGTH_NULL
	);

	useFetchForRhfReset(
		`/thread/count-length/${updateCountLength?.id}`,
		updateCountLength?.id,
		reset
	);

	const onClose = () => {
		setUpdateCountLength((prev) => ({
			...prev,
			id: null,
		}));
		reset(THREAD_COUNT_LENGTH_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateCountLength?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				// replace / with - for param
				uri: `/thread/count-length/${updateCountLength?.id}/${data?.count_length.replace(/\//g, "-")}`,
				itemId: updateCountLength.id,
				data: data,
				updatedData: updatedData,
				setItems: setCountLength,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/thread/count-length",
			data: updatedData,
			setItems: setCountLength,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateCountLength?.id !== null
					? "Update Count Length"
					: "Count Length"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label="count_length" {...{ register, errors }} />
			<Input label="weight" {...{ register, errors }} />
			<Input label="sst" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
