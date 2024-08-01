import { useFetch } from "@/hooks";
import {
	FormField,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from "@/ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
	orderInfoIds,
	setOrderInfoIds,
}) {
	const { pi_uuid } = useParams();
	const [marketingId, setMarketingId] = useState(
		pi_uuid != undefined ? getValues("marketing_id") : null
	); // 2 is the default value
	const [partyId, setPartyId] = useState(
		pi_uuid != undefined ? getValues("party_id") : null
	); // 47 is the default value

	const { value: marketing } = useFetch("/marketing/value/label");
	const { value: party } = useFetch("/party/value/label");
	const { value: order_number } = useFetch(
		`/order-number-for-pi/value/label/by/${marketingId}/${partyId}`,
		[marketingId, partyId]
	);
	const { value: merchandiser } = useFetch(
		`/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: factory } = useFetch(`/factory/value/label/${partyId}`, [
		partyId,
	]);
	const { value: bank } = useFetch("/bank/value/label");

	const { value: lc } = useFetch(`/lc/value/label/by/${partyId}`, [partyId]);

	useEffect(() => {
		if (isUpdate) {
			setMarketingId(getValues("marketing_id"));
			setPartyId(getValues("party_id"));
		}
	}, [isUpdate, getValues("marketing_id"), getValues("party_id")]);

	return (
		<div className="flex flex-col gap-4">
			<SectionEntryBody title="PI Information">
				<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
					<FormField label="lc_id" title="LC" errors={errors}>
						<Controller
							name="lc_id"
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select LC"
										options={lc}
										value={lc?.find(
											(item) =>
												item.value == getValues("lc_id")
										)}
										onChange={(e) => {
											const value = parseInt(e.value);
											onChange(value);
										}}
										// isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label="marketing_id"
						title="Marketing"
						errors={errors}
					>
						<Controller
							name="marketing_id"
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
										onChange={(e) => {
											const value = parseInt(e.value);
											onChange(value);
											setMarketingId(value);
										}}
										isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label="party_id" title="Party" errors={errors}>
						<Controller
							name="party_id"
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
											const value = parseInt(e.value);
											onChange(value);
											setPartyId(value);
										}}
										isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label="order_info_ids"
						title="Order Numbers"
						errors={errors}
					>
						<Controller
							name="order_info_ids"
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										isMulti
										placeholder="Select Order Numbers"
										options={order_number}
										value={order_number?.filter((item) =>
											orderInfoIds?.order_info_ids?.includes(
												parseInt(item.value)
											)
										)}
										onChange={(e) => {
											setOrderInfoIds((prev) => ({
												...prev,
												order_info_ids: e.map(
													({ value }) => value
												),
											}));

											onChange(
												JSON.stringify({
													values: e.map(
														({ value }) => value
													),
												})
											);
										}}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className="flex flex-col gap-1 px-2 text-secondary-content md:flex-row">
					<FormField
						label="merchandiser_id"
						title="Merchandiser"
						errors={errors}
					>
						<Controller
							name="merchandiser_id"
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
										onChange={(e) =>
											onChange(parseInt(e.value))
										}
										isDisabled={pi_uuid != undefined}
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
							name="factory_id"
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
										onChange={(e) =>
											onChange(parseInt(e.value))
										}
										isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label="bank_id" title="Bank" errors={errors}>
						<Controller
							name="bank_id"
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder="Select Bank"
										options={bank}
										value={bank?.find(
											(item) =>
												item.value ==
												getValues("bank_id")
										)}
										onChange={(e) =>
											onChange(parseInt(e.value))
										}
									/>
								);
							}}
						/>
					</FormField>
					<JoinInput
						label="validity"
						unit="DAYS"
						{...{ register, errors }}
					/>
					<JoinInput
						label="payment"
						unit="DAYS"
						{...{ register, errors }}
					/>
					<Textarea label="remarks" {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
