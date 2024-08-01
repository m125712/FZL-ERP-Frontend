import { AddModal } from "@/components/Modal";
import { useAuth } from "@/context/auth";
import {
	useFetch,
	useFetchForRhfReset,
	usePostFunc,
	useRHF,
	useUpdateFunc,
} from "@/hooks";
import { CheckBox, FormField, ReactSelect } from "@/ui";
import GetDateTime from "@/util/GetDateTime";
import { ORDER_INFO_NULL, ORDER_INFO_SCHEMA } from "@util/Schema";
import { useEffect, useState } from "react";

export default function Index({
	modalId = "",
	setOrderInfo,
	updateOrderInfo = {
		id: null,
		party_id: null,
		buyer_id: null,
		merchandiser_id: null,
		marketing_id: null,
		factory_id: null,
		issued_by_id: null,
	},
	setUpdateOrderInfo,
}) {
	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
	} = useRHF(ORDER_INFO_SCHEMA, ORDER_INFO_NULL);

	const [partyId, setPartyId] = useState(getValues("party_id"));
	const { value: ref_order } = useFetch("/order/info/value/label");
	const { value: party } = useFetch("/party/value/label");
	const { value: buyer } = useFetch("/buyer/value/label");
	const { value: marketing } = useFetch("/marketing/value/label");
	const { value: merchandiser } = useFetch(
		`/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: factory } = useFetch(`/factory/value/label/${partyId}`, [
		partyId,
	]);

	const getResult = (key) =>
		typeof getValues(key) !== "boolean" && getValues(key) === 1
			? true
			: false;

	const [isSample, setIsSample] = useState(getResult("is_sample"));
	const [isBill, setIsBill] = useState(getResult("is_bill"));

	const CashOptions = [
		{ value: 1, label: "Cash" },
		{ value: 0, label: "LC" },
	];

	const PriorityOptions = [
		{ value: "FIFO", label: "FIFO" },
		{ value: "URGENT", label: "URGENT" },
		{ value: "---", label: "---" },
	];

	useFetchForRhfReset(
		`/order/info/${updateOrderInfo?.id}`,
		updateOrderInfo?.id,
		reset
	);

	const onClose = () => {
		setUpdateOrderInfo((prev) => ({
			...prev,
			id: null,
			party_id: null,
			buyer_id: null,
			merchandiser_id: null,
			marketing_id: null,
			factory_id: null,
			issued_by_id: null,
			reference_order: null,
		}));
		reset(ORDER_INFO_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateOrderInfo?.id !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};
			await useUpdateFunc({
				uri: `/order/info/${updateOrderInfo?.id}/${updateOrderInfo?.order_number}`,
				itemId: updateOrderInfo?.id,
				data: data,
				updatedData: updatedData,
				setItems: setOrderInfo,
				onClose: onClose,
			});

			return;
		}

		// Create maps
		const buyerMap = new Map(buyer.map((item) => [item.value, item.label]));
		const partyMap = new Map(party.map((item) => [item.value, item.label]));
		const marketingMap = new Map(
			marketing.map((item) => [item.value, item.label])
		);
		const merchandiserMap = new Map(
			merchandiser.map((item) => [item.value, item.label])
		);
		const factoryMap = new Map(
			factory.map((item) => [item.value, item.label])
		);

		const updatedData = {
			...data,
			is_sample: isSample ? 1 : 0,
			is_bill: isBill ? 1 : 0,
			is_cash: data.is_cash ? 1 : 0,
			issued_by: user?.id,
			created_at: GetDateTime(),
			buyer_name: buyerMap.get(data.buyer_id),
			party_name: partyMap.get(data.party_id),
			marketing_name: marketingMap.get(data.marketing_id),
			merchandiser_name: merchandiserMap.get(data.merchandiser_id),
			factory_name: factoryMap.get(data.factory_id),
			issued_by_name: user?.name,
		};

		await usePostFunc({
			uri: "/order/info",
			data: updatedData,
			setItems: setOrderInfo,
			onClose: onClose,
		});
		window.location.reload(true);
	};

	useEffect(() => {
		setPartyId(getValues("party_id"));
	}, [getValues("party_id")]);

	return (
		<AddModal
			id={modalId}
			title={
				updateOrderInfo?.id !== null
					? "Order Info: " + updateOrderInfo?.order_number
					: "Order Info"
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			// isSmall={true}
		>
			<div className="flex justify-end gap-2 p-2 text-sm">
				<div className="rounded-md bg-primary px-1">
					<CheckBox
						label="is_sample"
						title="Sample"
						text="text-primary-content"
						defaultChecked={isSample}
						onChange={(e) => setIsSample(e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
				<div className="rounded-md bg-primary px-1">
					<CheckBox
						title="Bill"
						label="is_bill"
						text="text-primary-content"
						defaultChecked={isBill}
						onChange={(e) => setIsBill(e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-1 md:flex-row">
				<FormField
					label="reference_order"
					title="Ref. Order"
					errors={errors}
				>
					<Controller
						name={"reference_order"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Order"
									options={ref_order}
									value={ref_order?.find(
										(item) =>
											item.value ==
											getValues("reference_order")
									)}
									onChange={(e) =>
										onChange(parseInt(e.value))
									}
									isDisabled={updateOrderInfo?.id !== null}
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
									isDisabled={updateOrderInfo?.id !== null}
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
											item.value == getValues("buyer_id")
									)}
									onChange={(e) =>
										onChange(parseInt(e.value))
									}
									isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className="flex flex-col gap-1 md:flex-row">
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
											item.value == getValues("party_id")
									)}
									onChange={(e) => {
										onChange(parseInt(e.value));
										setPartyId(parseInt(e.value));
									}}
									isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
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
									isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label="factory_id" title="Factory" errors={errors}>
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
									isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className="flex flex-col gap-1 md:flex-row">
				<FormField label="is_cash" title="Cash / LC" errors={errors}>
					<Controller
						name={"is_cash"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Cash Or LC"
									options={CashOptions}
									value={CashOptions?.find(
										(CashOptions) =>
											CashOptions.value ==
											getValues("is_cash")
									)}
									onChange={(e) =>
										onChange(parseInt(e.value))
									}
									// isDisabled={updateOrderInfo?.id !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label="marketing_priority"
					title="S&M Priority"
					errors={errors}
				>
					<Controller
						name={"marketing_priority"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Priority"
									options={PriorityOptions}
									value={PriorityOptions?.find(
										(item) =>
											item.value ==
											getValues("marketing_priority")
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateOrderInfo?.id !== null
									// }
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label="factory_priority"
					title="Factory Priority"
					errors={errors}
				>
					<Controller
						name={"factory_priority"}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder="Select Priority"
									options={PriorityOptions}
									value={PriorityOptions?.find(
										(item) =>
											item.value ==
											getValues("factory_priority")
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={
									// 	updateOrderInfo?.id !== null
									// }
								/>
							);
						}}
					/>
				</FormField>
			</div>
		</AddModal>
	);
}
