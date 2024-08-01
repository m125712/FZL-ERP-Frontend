import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { FormField, Input, ReactSelect, Textarea } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { MERCHANDISER_NULL, MERCHANDISER_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setMerchandiser,
	updateMerchandiser = {
		id: null,
	},
	setUpdateMerchandiser,
}) {
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(MERCHANDISER_SCHEMA, MERCHANDISER_NULL);

	const { value: party } = useFetch("/party/value/label");

	useFetchForRhfReset(
		`/merchandiser/${updateMerchandiser?.id}`,
		updateMerchandiser?.id,
		reset
	);

	const onClose = () => {
		setUpdateMerchandiser((prev) => ({
			...prev,
			id: null,
		}));
		reset(MERCHANDISER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		let party_name = party.find(
			(item) => item.value === data.party_id
		).label;
		// Update item
		if (updateMerchandiser?.id !== null) {
			const updatedData = {
				...data,
				party_name: party_name,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/merchandiser/${updateMerchandiser?.id}/${data?.name}`,
				itemId: updateMerchandiser.id,
				data: data,
				updatedData: updatedData,
				setItems: setMerchandiser,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			party_name: party_name,
			created_at: GetDateTime(),
		};

		usePostFunc({
			uri: "/merchandiser",
			data: updatedData,
			setItems: setMerchandiser,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateMerchandiser?.id !== null
					? "Update Merchandiser"
					: "Merchandiser"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label="party_id" title="Party" errors={errors}>
				<Controller
					name={"party_id"}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder="Select Party"
								options={party}
								value={party?.find(
									(item) =>
										item.value === getValues("party_id")
								)}
								onChange={(e) => onChange(e.value)}
							/>
						);
					}}
				/>
			</FormField>
			<Input label="name" {...{ register, errors }} />
			<Input label="email" {...{ register, errors }} />
			<Input label="phone" {...{ register, errors }} />
			<Textarea label="address" {...{ register, errors }} />
		</AddModal>
	);
}
