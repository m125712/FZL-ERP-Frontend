import { useCallback, useEffect, useRef, useState } from 'react';
import {
	useDeliveryChallan,
	useDeliveryChallanDetailsByUUID,
	useDeliveryChallanEntryByChallanUUID,
	useDeliveryPackingList,
	useDeliveryPackingListByUUID,
} from '@/state/Delivery';
import { useOtherChallan } from '@/state/Other';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { get } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { useNavigate } from 'react-router-dom';
import { useRHF } from '@/hooks';

import { ShowLocalToast } from '@/components/Toast';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	ActionButtons,
	DynamicField,
	FormField,
	ReactSelect,
	SectionEntryBody,
	StatusButton,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import { GATE_PASS_NULL, GATE_PASS_SCHEMA } from '@/util/Schema';

export default function Index() {
	const containerRef = useRef(null);
	const [symbol, setSymbol] = useState(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [onFocus, setOnFocus] = useState(true);
	const navigate = useNavigate();

	const {
		handleSubmit,
		errors,
		reset,
		control,
		useFieldArray,
		setValue,
		getValues,
		Controller,
		watch,
	} = useRHF(GATE_PASS_SCHEMA, GATE_PASS_NULL);

	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'entry',
	});

	const { data: challan_option } = useOtherChallan('gate_pass=false');
	const { invalidateQuery: invalidateDeliveryChallan } = useDeliveryChallan();
	const { invalidateQuery: invalidateDeliveryPackingListByUUID } =
		useDeliveryChallanDetailsByUUID(watch('challan_uuid'));
	const { invalidateQuery: invalidateDeliveryPackingList } =
		useDeliveryPackingList();
	const {
		data: packetListData,
		isLoading,
		error,
		updateData,
	} = useDeliveryChallanEntryByChallanUUID(watch('challan_uuid'));
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, [containerRef]);
	useEffect(() => {
		if (!packetListData) return;
		setValue('entry', packetListData);
	}, [packetListData]);

	const handleSymbol = useCallback((scannedSymbol) => {
		if (!scannedSymbol) return;
		setSymbol(scannedSymbol);
	}, []);

	const handlePacketScan = async (selectedOption, scannedSymbol) => {
		try {
			await new Promise((resolve) => {
				if (onFocus && !isLoading) {
					resolve(true);
					return;
				}
			});
			if (scannedSymbol.length < 2) {
				return null;
			}
			if (!selectedOption) {
				throw new Error('Please select a challan first');
			}

			if (!scannedSymbol) {
				throw new Error('Invalid scan data');
			}

			if (!Array.isArray(packetListData) || !packetListData?.length) {
				throw new Error('No packet list data available');
			}

			const packet = getValues('entry').find(
				(entry) => entry.uuid.trim() === scannedSymbol.trim()
			);
			if (!packet) {
				throw new Error('Packet not found in this challan');
			}

			const currentEntries = getValues('entry') || [];
			const isGatePassed = currentEntries.find(
				(entry) =>
					entry.gate_pass === 1 &&
					entry.uuid.trim() === scannedSymbol.trim()
			);

			if (isGatePassed) {
				throw new Error('This packet has already been gate passed');
			}

			return packet;
		} catch (error) {
			console.error('Scan error:', error);
			throw error;
		}
	};

	useEffect(() => {
		if (!symbol) return;

		const selectedOption = getValues('challan_uuid');

		handlePacketScan(selectedOption, symbol)
			.then((data) => {
				if (!data) return;
				getValues('entry').find((entry, index) => {
					if (entry.uuid === data.uuid) {
						setValue(`entry.${index}.gate_pass`, 1);
					}
				});
			})
			.catch((error) => {
				ShowLocalToast({
					type: 'error',
					message: error.message,
				});
			})
			.finally(() => {
				setSymbol(null);
			});
	}, [packetListData, EntryAppend, getValues, symbol, isLoading]);

	useSymbologyScanner(handleSymbol, {
		target: containerRef,
		enabled: scannerActive,
		eventOptions: { capture: true, passive: false },
		scannerOptions: { maxDelay: 100 },
	});

	// const handelEntryAppend = () => {
	// 	EntryAppend({
	// 		order_id: null,
	// 		trx_quantity: 0,
	// 		remarks: '',
	// 	});
	// };

	// const handleEntryRemove = (index) => {
	// 	EntryRemove(index);
	// };

	// const handelDuplicateDynamicField = useCallback(
	// 	(index) => {
	// 		const item = getValues(`entry[${index}]`);
	// 		EntryAppend({
	// 			...item,
	// 			order_description_uuid: undefined,
	// 		});
	// 	},
	// 	[getValues, EntryAppend]
	// );

	const onSubmit = async (data) => {
		try {
			const updatablePackingListEntryPromises = data.entry.map(
				async (item) => {
					if (item.uuid) {
						const updatedData = {
							gate_pass: 1,
							updated_at: GetDateTime(),
						};
						return await updateData.mutateAsync({
							url: `/delivery/packing-list/${item?.uuid}`,
							updatedData: updatedData,
							uuid: item.uuid,
							isOnCloseNeeded: false,
						});
					}
					return null;
				}
			);

			await Promise.all(updatablePackingListEntryPromises);
			reset(Object.assign({}, GATE_PASS_NULL));
			invalidateDeliveryChallan();
			invalidateDeliveryPackingList();
			invalidateDeliveryPackingListByUUID();
			navigate(`/delivery/challan/${data.entry[0].challan_uuid}`);
		} catch (err) {
			ShowLocalToast({
				type: 'error',
				message: 'Error updating packing list',
			});
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	const keyMap = {
		NEW_ROW: 'alt+n',
		COPY_LAST_ROW: 'alt+c',
		ENTER: 'enter',
	};

	const handleEnter = (event) => {
		event.preventDefault();
		if (Object.keys(errors).length > 0) return;
	};

	const handlers = {
		ENTER: (event) => handleEnter(event),
	};

	configure({
		ignoreTags: ['input', 'select', 'textarea'],
		ignoreEventsCondition: function () {},
	});

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			onBlur={() => setScannerActive(false)}
			onFocus={() => setScannerActive(true)}
			className='min-h-screen p-4 outline-none'>
			{isLoading && (
				<div className='flex h-screen items-center justify-center'>
					<span className='loading loading-dots loading-lg z-50' />
				</div>
			)}
			<div className='mb-4 flex items-center gap-4'>
				<div
					className={`flex items-center gap-2 ${scannerActive ? 'text-success' : 'text-error'}`}>
					<div
						className={`h-3 w-3 rounded-full ${scannerActive ? 'bg-success' : 'bg-error'}`}></div>
					<span className='text-sm font-medium'>
						Scanner{' '}
						{scannerActive
							? 'Active'
							: 'Inactive(Click this page to activate)'}
					</span>
				</div>
			</div>

			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='mt-4 flex flex-col gap-4'>
					<SectionEntryBody title='Details'>
						<FormField
							label='challan_uuid'
							title='Challan'
							errors={errors}>
							<Controller
								name='challan_uuid'
								control={control}
								render={({ field: { onChange } }) => (
									<ReactSelect
										placeholder='Select Challan'
										options={challan_option}
										value={challan_option?.find(
											(item) =>
												item.value ==
												getValues('option')
										)}
										onFocus={() => {
											setOnFocus(false);
										}}
										onChange={(e) => {
											const value = e.value;
											onChange(value);
											setOnFocus(true);
											containerRef.current.focus();
										}}
									/>
								)}
							/>
						</FormField>
					</SectionEntryBody>

					<DynamicField
						title='Entry'
						// handelAppend={handelEntryAppend}
						tableHead={[
							'Packet List',
							'Order Number',
							'Carton Size',
							'Carton Weight',
							'Total Poly Quantity',
							'Total Quantity',
							'Gate Pass',
							// 'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'>
								{item}
							</th>
						))}>
						{EntryField.map((item, index) => (
							<tr key={item.id}>
								<td className={`w-80 ${rowClass}`}>
									{getValues(
										`entry[${index}].packing_number`
									)}
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(`entry[${index}].order_number`)}
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(`entry[${index}].carton_size`)}
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(`entry[${index}].carton_weight`)}
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(
										`entry[${index}].total_poly_quantity`
									)}
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(
										`entry[${index}].total_quantity`
									)}
								</td>
								{/* <td
									className={`w-80 px-4 py-2 transition-colors duration-300 ${
										getValues(
											`entry[${index}].gate_pass`
										) === 1
											? 'bg-success/20 font-medium text-success'
											: 'bg-error/20 font-medium text-error'
									}`}>
									<div className='flex items-center gap-2'>
										<div
											className={`h-2 w-2 rounded-full ${
												getValues(
													`entry[${index}].gate_pass`
												) === 1
													? 'bg-success'
													: 'bg-error'
											}`}
										/>
										{getValues(
											`entry[${index}].gate_pass`
										) === 1
											? 'Passed'
											: 'Pending'}
									</div>
								</td> */}

								<td className={`w-80 ${rowClass}`}>
									<SwitchToggle
										disabled={
											getValues(
												`entry[${index}].gate_pass`
											) === 0
										}
										onFocus={() => {
										
											setValue(
												`entry[${index}].gate_pass`,
												getValues(
													`entry[${index}].gate_pass`
												) === 1
													? 0
													: 1
											);
											setOnFocus(true);
											containerRef.current.focus();
										}}
										// onClick={() =>
										// 	setValue(
										// 		`entry[${index}].gate_pass`,
										// 		getValues(
										// 			`entry[${index}].gate_pass`
										// 		) === 1
										// 			? 0
										// 			: 1
										// 	)
										// }

										checked={
											Number(
												getValues(
													`entry[${index}].gate_pass`
												)
											) === 1
										}
									/>
								</td>
								{/* <td
									className={`w-20 ${rowClass} border-l-4 border-l-primary`}>
									<ActionButtons
										// duplicateClick={() =>
										// 	handelDuplicateDynamicField(index)
										// }
										removeClick={() =>
											handleEntryRemove(index)
										}
										showDuplicateButton={false}
										showRemoveButton={false}
									/>
								</td> */}
							</tr>
						))}
					</DynamicField>

					<div className='modal-action'>
						<button
							type='submit'
							disabled={
								getValues('entry').length < 1 ||
								isLoading ||
								!getValues('entry').every(
									(value) => value.gate_pass === 1
								)
							}
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
		</div>
	);
}
