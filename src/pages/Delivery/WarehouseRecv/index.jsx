import { useCallback, useEffect, useRef, useState } from 'react';
import {
	useDeliveryPackingList,
	useDeliveryPackingListByUUID,
} from '@/state/Delivery';
import { useOtherOrderPackingList, useOtherPackingList } from '@/state/Other';
import { QueryCache } from '@tanstack/react-query';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { set } from 'date-fns';
import { FormProvider } from 'react-hook-form';
import { configure, HotKeys } from 'react-hotkeys';
import { useNavigate } from 'react-router-dom';
import { useAccess, useFetch, useRHF } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import {
	ActionButtons,
	DynamicField,
	FormField,
	ReactSelect,
	SectionEntryBody,
} from '@/ui';

import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';
import {
	WAREHOUSE_RECEIVE_NULL,
	WAREHOUSE_RECEIVE_SCHEMA,
} from '@/util/Schema';

export default function Index() {
	const containerRef = useRef(null);
	const [symbol, setScanUUID] = useState(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [onFocus, setOnFocus] = useState(true);
	const navigate = useNavigate();
	const haveAccess = useAccess('delivery__warehouse_recv');
	const [status, setStatus] = useState(false);

	const scan_option = [
		{ value: 'warehouse_receive', label: 'Warehouse Receive' },
	];

	const {
		handleSubmit,
		errors,
		reset,
		control,
		useFieldArray,
		getValues,
		Controller,
		watch,
		setValue,
		context: form,
	} = useRHF(WAREHOUSE_RECEIVE_SCHEMA, WAREHOUSE_RECEIVE_NULL);

	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'entry',
	});
	const {
		value: packetListData,
		loading: isLoading,
		error,
	} = useFetch(`/delivery/packing-list/${symbol}`, [status]);
	const { data: packetList } = useOtherPackingList();
	const { invalidateQuery: invalidateDeliveryPackingList, updateData } =
		useDeliveryPackingList();

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, [containerRef]);

	const handleSymbol = useCallback(
		async (scannedSymbol) => {
			if (!scannedSymbol || !onFocus || scannedSymbol.length < 2) return;
			setScanUUID(scannedSymbol);
			setStatus(!status);
		},
		[status]
	);
	useSymbologyScanner(handleSymbol, {
		target: containerRef,
		enabled: scannerActive,
		eventOptions: { capture: true, passive: false },
		scannerOptions: { maxDelay: 30 },
	});

	const handlePacketScan = async (selectedOption) => {
		const waitForLoading = () => {
			return new Promise((resolve) => {
				if (!isLoading && onFocus && symbol) {
					resolve(true);
					return;
				}
			});
		};

		try {
			await waitForLoading();

			if (error) {
				throw new Error(error);
			}
			if (!selectedOption) {
				throw new Error('Please select an option');
			}

			if (!packetListData) {
				throw new Error('No packet list found');
			}

			const currentEntries = getValues('entry') || [];
			const isDuplicate = currentEntries.some(
				(entry) =>
					entry.packing_number === packetListData.packing_number
			);

			if (isDuplicate) {
				throw new Error('This item has already been scanned');
			}

			if (selectedOption === 'warehouse_receive') {
				if (packetListData.is_warehouse_received) {
					throw new Error('This item has already been received');
				}
			}
			return packetListData;
		} catch (error) {
			throw error;
		}
	};

	useEffect(() => {
		if (!symbol) return;
		const selectedOption = getValues('option');
		handlePacketScan(selectedOption)
			.then((data) => {
				EntryAppend({ ...data });
			})
			.catch((error) => {
				ShowLocalToast({
					type: 'error',
					message: error.message,
				});
			});
	}, [packetListData]);

	const handelEntryAppend = () => {
		EntryAppend({
			order_id: null,
			trx_quantity: 0,
			remarks: '',
		});
	};

	const handleEntryRemove = (index) => {
		EntryRemove(index);
	};
	const onSubmit = async (data) => {
		try {
			const updatablePackingListEntryPromises = data.entry.map(
				async (item) => {
					if (item.uuid) {
						const updatedData = {
							is_warehouse_received: true,
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
			reset(Object.assign({}, WAREHOUSE_RECEIVE_NULL));
			invalidateDeliveryPackingList();
			navigate(`/delivery/packing-list`);
		} catch (err) {
			ShowLocalToast({
				type: 'error',
				message: 'Error updating packing list',
			});
			console.error(`Error with Promise.all: ${err}`);
		}
	};

	let excludeItem = exclude(watch, packetList, 'entry', 'uuid', status);

	const rowClass =
		'group px-3 py-2 whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<FormProvider {...form}>
			<div
				ref={containerRef}
				tabIndex={0}
				onBlur={() => setScannerActive(false)}
				onFocus={() => setScannerActive(true)}
				className='min-h-screen p-4 outline-none'>
				<div className='mb-4 flex items-center gap-4'>
					<div
						className={`flex items-center gap-2 ${scannerActive ? 'text-success' : 'text-error'}`}>
						<div
							className={`h-3 w-3 rounded-full ${scannerActive ? 'bg-success' : 'bg-error'}`}></div>
						<span className='text-sm font-medium'>
							Scanner{' '}
							{scannerActive
								? 'Active'
								: 'Inactive (Click this dot to active)'}
						</span>
					</div>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='mt-4 flex flex-col gap-4'>
					<SectionEntryBody title='Details'>
						<FormField
							label='option'
							title='Select Option'
							errors={errors}>
							<Controller
								name='option'
								control={control}
								render={({ field: { onChange } }) => (
									<ReactSelect
										placeholder='Select Option'
										options={scan_option}
										value={scan_option?.find(
											(item) =>
												item.value ==
												getValues('option')
										)}
										// onFocus={() => {
										// 	setOnFocus(false);
										// }}
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
						<FormField
							label='packet_list_uuid'
							title='Packet List'
							errors={errors}>
							<Controller
								name='packet_list_uuid'
								control={control}
								render={({ field: { onChange } }) => (
									<ReactSelect
										placeholder='Select Packet List'
										options={packetList?.filter(
											(inItem) =>
												!excludeItem?.some(
													(excluded) =>
														excluded?.value ===
														inItem?.value
												)
										)}
										value={packetList?.filter(
											(item) =>
												item.value ==
												getValues('packet_list_uuid')
										)}
										// onFocus={() => {
										// 	setOnFocus(false);
										// }}
										onChange={(e) => {
											const value = e.value;
											setScanUUID(value);
											setStatus(!status);
											setValue('packet_list_uuid', null);
											onChange(null);
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
						handelAppend={handelEntryAppend}
						showAppendButton={false}
						tableHead={[
							'Packet List',
							'Order Number',
							'Carton Size',
							'Carton Weight',
							'Total Poly Quantity',
							'Total Quantity',
							'Action',
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
								<td
									className={`w-20 ${rowClass} border-l-4 border-l-primary`}>
									<ActionButtons
										removeClick={() =>
											handleEntryRemove(index)
										}
										showDuplicateButton={false}
										showRemoveButton={EntryField.length > 0}
									/>
								</td>
							</tr>
						))}
					</DynamicField>

					<Footer buttonClassName='!btn-primary' />
					{/* <div className='modal-action'>
						<button
							type='submit'
							disabled={
								getValues('entry').length < 1 ||
								isLoading ||
								watch('option') === 'warehouse_return'
							}
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div> */}
				</form>
			</div>
		</FormProvider>
	);
}
