import { AddModal } from "@/components/Modal";
import {
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { Input, Select, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { POLICY_NULL, POLICY_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setPolicy,
	updatePolicy = {
		id: null,
	},
	setUpdatePolicy,
}) {
	const { register, handleSubmit, errors, reset } = useRHF(
		POLICY_SCHEMA,
		POLICY_NULL
	);

	useFetchForRhfReset(
		`/policy-and-notice/${updatePolicy?.id}`,
		updatePolicy?.id,
		reset
	);

	const onClose = () => {
		setUpdatePolicy((prev) => ({
			...prev,
			id: null,
		}));
		reset(POLICY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updatePolicy?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/policy-and-notice/${updatePolicy?.id}/${data?.title}`,
				itemId: updatePolicy.id,
				data: data,
				updatedData: updatedData,
				setItems: setPolicy,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/policy-and-notice",
			data: updatedData,
			setItems: setPolicy,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updatePolicy?.id !== null ? "Update Policy" : "Policy"}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Select
				label="type"
				option={[
					{ value: "policy", label: "Policy" },
					{ value: "notice", label: "Notice" },
				]}
				{...{ register, errors }}
			/>
			<Textarea label="title" {...{ register, errors }} />
			<Textarea label="sub_title" {...{ register, errors }} />
			<Textarea label="url" {...{ register, errors }} />
		</AddModal>
	);
}
