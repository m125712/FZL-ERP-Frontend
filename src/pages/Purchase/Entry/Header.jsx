import { useFetch } from "@/hooks";
import {
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Select,
	Textarea,
} from "@/ui";
import { useParams } from "react-router-dom";

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
}) {
	const { purchase_description_uuid } = useParams();
	const { value: vendor } = useFetch("/vendor/value/label");

	const purchaseOptions = [
		{ label: "Import", value: 0 },
		{ label: "Local", value: 1 },
	];

	return (
		<SectionEntryBody title="Information">
			<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
				<FormField label="vendor_id" title="Vendor" errors={errors}>
					<Controller
						name={"vendor_id"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Vendor"
									options={vendor}
									value={vendor?.find(
										(item) =>
											item.value == getValues("vendor_id")
									)}
									onChange={(e) =>
										onChange(parseInt(e.value))
									}
									isDisabled={
										purchase_description_uuid !== undefined
									}
								/>
							);
						}}
					/>
				</FormField>
				<Select
					label="is_local"
					title="Import / Local"
					type="select"
					option={purchaseOptions}
					{...{ register, errors }}
				/>
				<Input label="lc_number" {...{ register, errors }} />
				<Textarea label="remarks" {...{ register, errors }} />
			</div>
		</SectionEntryBody>
	);
}
