import { FormField, JoinInput, ReactSelect, SectionEntryBody } from "@/ui";
import { useParams } from "react-router-dom";

export default function Header({
	order_info_id,
	register,
	errors,
	control,
	getValues,
	Controller,
}) {
	const { challan_uuid } = useParams();

	return (
		<div className="flex flex-col gap-4">
			<SectionEntryBody title="Challan Information">
				<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
					<FormField
						label="order_info_id"
						title="Order Number"
						errors={errors}
					>
						<Controller
							name="order_info_id"
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Order Number"
										options={order_info_id}
										value={order_info_id?.find(
											(item) =>
												item.value ===
												getValues("order_info_id")
										)}
										onChange={(e) =>
											onChange(e.value.toString())
										}
										isDisabled={challan_uuid !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<JoinInput
						label="carton_quantity"
						unit="Carton"
						{...{ register, errors }}
					/>
				</div>
			</SectionEntryBody>
		</div>
	);
}
