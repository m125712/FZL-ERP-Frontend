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
import { FACTORY_NULL, FACTORY_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setFactory,
	updateFactory = {
		id: null,
	},
	setUpdateFactory,
}) {
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(FACTORY_SCHEMA, FACTORY_NULL);

	const { value: party } = useFetch("/party/value/label");

	useFetchForRhfReset(
		`/factory/${updateFactory?.id}`,
		updateFactory?.id,
		reset
	);

	const onClose = () => {
		setUpdateFactory((prev) => ({
			...prev,
			id: null,
		}));
		reset(FACTORY_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		let party_name = party.find(
			(item) => item.value === data.party_id
		).label;
		// Update item
		if (updateFactory?.id !== null) {
			const updatedData = {
				...data,
				party_name: party_name,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/factory/${updateFactory?.id}/${data?.name}`,
				itemId: updateFactory.id,
				data: data,
				updatedData: updatedData,
				setItems: setFactory,
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
			uri: "/factory",
			data: updatedData,
			setItems: setFactory,
			onClose: onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateFactory?.id !== null ? "Update Factory" : "Factory"}
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
			<Input label="phone" {...{ register, errors }} />
			<Textarea label="address" {...{ register, errors }} />
		</AddModal>
	);
}
