import { useFetch } from "@/hooks";
import { CheckBox, FormField, ReactSelect, SectionEntryBody } from "@/ui";
import { Input } from "postcss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Header({
	register,
	errors,
	getValues,
	Controller,
	control,
}) {
	const { thread_order_info_uuid } = useParams();

	const [isSample, setIsSample] = useState(
		typeof getValues("is_sample") !== "boolean" &&
			getValues("is_sample") === 1
			? true
			: false
	);
	const [isBill, setIsBill] = useState(
		typeof getValues("is_bill") !== "boolean" && getValues("is_bill") === 1
			? true
			: false
	);

	const [partyId, setPartyId] = useState(getValues("party_id"));
	const { value: party } = useFetch("/party/value/label");
	const { value: merchandiser } = useFetch(
		`/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: factory } = useFetch(`/factory/value/label/${partyId}`, [
		partyId,
	]);

	const { value: buyer } = useFetch("/buyer/value/label");
	const { value: marketing } = useFetch("/marketing/value/label");

	useEffect(() => {
		setPartyId(getValues("party_id"));
	}, [getValues("party_id")]);

	return (
		<div className="flex flex-col gap-4">
			<SectionEntryBody
				title="Order"
				header={
					<div className="flex justify-end gap-2 p-2 text-sm">
						<div className="rounded-md bg-primary px-1">
							<CheckBox
								label="is_sample"
								title="Sample"
								text="text-primary-content"
								defaultChecked={isSample}
								{...{ register, errors }}
								onChange={(e) => setIsSample(e.target.checked)}
							/>
						</div>
						<div className="rounded-md bg-primary px-1">
							<CheckBox
								title="Bill"
								label="is_bill"
								text="text-primary-content"
								defaultChecked={isBill}
								{...{ register, errors }}
								onChange={(e) => setIsBill(e.target.checked)}
							/>
						</div>
					</div>
				}
			>
				<div className="flex flex-col gap-1 md:flex-row">
					<FormField
						label="marketing_id"
						title="Marketing"
						errors={errors}
					>
						<Controller
							name={"marketing_id"}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Marketing"
										options={marketing}
										value={marketing?.find(
											(item) =>
												item.value ==
												getValues("marketing_id")
										)}
										onChange={(e) =>
											onChange(parseInt(e.value))
										}
										isDisabled={
											thread_order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label="buyer_id" title="Buyer" errors={errors}>
						<Controller
							name={"buyer_id"}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Buyer"
										options={buyer}
										value={buyer?.find(
											(item) =>
												item.value ==
												getValues("buyer_id")
										)}
										onChange={(e) =>
											onChange(parseInt(e.value))
										}
										isDisabled={
											thread_order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
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
												item.value ==
												getValues("party_id")
										)}
										onChange={(e) => {
											onChange(parseInt(e.value));
											setPartyId(parseInt(e.value));
										}}
										isDisabled={
											thread_order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className="flex flex-col gap-1 md:flex-row">
					<FormField
						label="merchandiser_id"
						title="Merchandiser"
						errors={errors}
					>
						<Controller
							name={"merchandiser_id"}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Merchandiser"
										options={merchandiser}
										value={merchandiser?.find(
											(item) =>
												item.value ==
												getValues("merchandiser_id")
										)}
										onChange={(e) => {
											onChange(parseInt(e.value));
										}}
										isDisabled={
											thread_order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label="factory_id"
						title="Factory"
						errors={errors}
					>
						<Controller
							name={"factory_id"}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Factory"
										options={factory}
										value={factory?.find(
											(item) =>
												item.value ==
												getValues("factory_id")
										)}
										onChange={(e) => {
											onChange(parseInt(e.value));
										}}
										isDisabled={
											thread_order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
