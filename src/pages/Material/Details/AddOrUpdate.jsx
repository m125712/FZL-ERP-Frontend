import { AddModal } from "@/components/Modal";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import {
	FormField,
	Input,
	JoinInputSelect,
	ReactSelect,
	Select,
	Textarea,
} from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { MATERIAL_NULL, MATERIAL_SCHEMA } from "@util/Schema";

export default function Index({
	modalId = "",
	setMaterialDetails,
	updateMaterialDetails = {
		id: null,
		section_id: null,
		type_id: null,
	},
	setUpdateMaterialDetails,
}) {
	const { register, handleSubmit, errors, reset, Controller, control } =
		useRHF(MATERIAL_SCHEMA, MATERIAL_NULL);

	useFetchForRhfReset(
		`/material/details/${updateMaterialDetails?.id}`,
		updateMaterialDetails?.id,
		reset
	);

	const { value: section } = useFetch("/material-section/value/label");
	const { value: materialType } = useFetch("/material-type/value/label");

	const onClose = () => {
		setUpdateMaterialDetails((prev) => ({
			...prev,
			id: null,
			section_id: null,
			type_id: null,
		}));
		reset(MATERIAL_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const section_name = section?.find(
			(item) => item.value == data?.section_id
		)?.label;
		const material_type = materialType?.find(
			(item) => item.value == data?.type_id
		)?.label;
		// Update item
		if (updateMaterialDetails?.id !== null) {
			const updatedData = {
				...data,
				section_name,
				material_type,
				updated_at: GetDateTime(),
			};
			useUpdateFunc({
				uri: `/material/details/${
					updateMaterialDetails?.id
				}/${data?.name.replace(/#/g, "").replace(/\//g, "-")}`,
				itemId: updateMaterialDetails.id,
				data: data,
				updatedData: updatedData,
				setItems: setMaterialDetails,
				onClose: onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			section_name,
			material_type,
			created_at: GetDateTime(),
		};

		await usePostFunc({
			uri: "/material/details",
			data: updatedData,
			setItems: setMaterialDetails,
			onClose: onClose,
		});
	};

	const selectUnit = [
		{ label: "kg", value: "kg" },
		{ label: "Litre", value: "ltr" },
		{ label: "Meter", value: "mtr" },
		{ label: "Piece", value: "pcs" },
	];

	return (
		<AddModal
			id={modalId}
			title={
				updateMaterialDetails?.id !== null
					? "Update Material"
					: "Material"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
		>
			<div className="mb-4 flex flex-col gap-2 rounded-md bg-primary/30 p-2 md:flex-row">
				<FormField label="section_id" title="Section" errors={errors}>
					<Controller
						name={"section_id"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Section"
									options={section}
									value={section?.find(
										(item) =>
											item.value ==
											updateMaterialDetails?.section_id
									)}
									onChange={(e) => {
										onChange(parseInt(e.value));
									}}
									isDisabled={
										updateMaterialDetails?.id !== null
									}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label="type_id" title="Type" errors={errors}>
					<Controller
						name={"type_id"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Material Type"
									options={materialType}
									value={materialType?.find(
										(item) =>
											item.value ==
											updateMaterialDetails?.type_id
									)}
									onChange={(e) => {
										onChange(parseInt(e.value));
									}}
									isDisabled={
										updateMaterialDetails?.id !== null
									}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className="mb-4 flex flex-col gap-2 rounded-md bg-primary/30 p-2 md:flex-row">
				<Input label="name" {...{ register, errors }} />
				<Input label="short_name" {...{ register, errors }} />
				<JoinInputSelect
					label="threshold"
					join="unit"
					option={selectUnit}
					{...{ register, errors }}
				/>
			</div>
			<div className="mb-4 flex flex-col gap-2 rounded-md bg-primary/30 p-2 md:flex-row">
				<Input label="remarks" {...{ register, errors }} />
				<Textarea label="description" {...{ register, errors }} />
			</div>
		</AddModal>
	);
}
