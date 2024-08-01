import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { MARKETING_NULL, MARKETING_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setMarketing,
	updateMarketing = {
		id: null,
		user_id: null,
	},
	setUpdateMarketing,
}) {
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(MARKETING_SCHEMA, MARKETING_NULL);

	useFetchForRhfReset(
		`/marketing/${updateMarketing?.id}`,
		updateMarketing?.id,
		reset
	);

	const { value: user } = useFetch("/marketing-user/value/label");

	const onClose = () => {
		setUpdateMarketing((prev) => ({
			...prev,
			id: null,
			user_id: null,
		}));
		reset(MARKETING_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateMarketing?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/marketing/${updateMarketing?.id}/${data?.name}`,
				itemId: updateMarketing.id,
				data: data,
				updatedData: updatedData,
				setItems: setMarketing,
				onClose: onClose,
			});

			return;
		}
		// Add item
		const updatedData = {
			...data,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/marketing",
			data: updatedData,
			setItems: setMarketing,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateMarketing?.id !== null ? "Update Marketing" : "Marketing"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="user_id" title="User" errors={errors}>
				<Controller
					name={"user_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select User"
								options={user}
								value={user?.find(
									(item) =>
										item.value === getValues("user_id")
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label="name" {...{ register, errors }} />
			<Input label="short_name" {...{ register, errors }} />
			<Input label="remarks" {...{ register, errors }} />
		</AddModal>
	);
}
