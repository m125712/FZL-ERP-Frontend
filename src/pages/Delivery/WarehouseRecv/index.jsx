import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDeliveryPackingList } from '@/state/Delivery';
import { useOtherPackingList } from '@/state/Other';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAccess, useFetch, useRHF } from '@/hooks';

import { Footer } from '@/components/Modal/ui';
import { ShowLocalToast } from '@/components/Toast';
import {
	ActionButtons,
	CustomLink,
	DateTime,
	DynamicField,
	FormField,
	ReactSelect,
	SectionEntryBody,
} from '@/ui';

import { cn } from '@/lib/utils';
import { exclude } from '@/util/Exclude';
import GetDateTime from '@/util/GetDateTime';
import {
	WAREHOUSE_RECEIVE_NULL,
	WAREHOUSE_RECEIVE_SCHEMA,
} from '@/util/Schema';

export default function Index() {
	const user = useAuth();
	const navigate = useNavigate();
	const containerRef = useRef(null);

	const [symbol, setSymbol] = useState(null);
	const [scannerActive, setScannerActive] = useState(true);
	const [onFocus, setOnFocus] = useState(true);
	const [status, setStatus] = useState(false);

	const haveAccess = useAccess('delivery__warehouse_recv');

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

	const { data: packetList, updateData } = useOtherPackingList();
	const { invalidateQuery: invalidateDeliveryPackingList } =
		useDeliveryPackingList();

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, [containerRef]);

	const handleSymbol = useCallback(
		async (scannedSymbol) => {
			if (!scannedSymbol || !onFocus || scannedSymbol.length < 2) return;
			setSymbol(scannedSymbol);
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

			if (error) throw new Error(error);

			if (!selectedOption) throw new Error('Please select an option');

			if (!packetListData) throw new Error('No packet list found');

			const currentEntries = getValues('entry') || [];
			const isDuplicate = currentEntries.some(
				(entry) =>
					entry.packing_number === packetListData.packing_number
			);

			if (isDuplicate)
				throw new Error('This item has already been scanned');

			if (selectedOption === 'warehouse_receive') {
				if (packetListData.is_warehouse_received) {
					throw new Error('This item has already been received');
				}
			}
			return packetListData;
		} catch (error) {
			ShowLocalToast({
				type: 'error',
				message: error.message,
			});
			console.error('Error in handlePacketScan:', error);
			throw error;
		}
	};

	useEffect(() => {
		if (!symbol) return;
		const selectedOption = getValues('option');
		handlePacketScan(selectedOption)
			.then((data) => {
				EntryAppend({
					...data,
					warehouse_received_date: GetDateTime(),
				});
			})
			.catch((error) => {
				ShowLocalToast({
					type: 'error',
					message: error.message,
				});
			});
	}, [packetListData, isLoading, error]);

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
							warehouse_received_date:
								item.warehouse_received_date,
							is_warehouse_received: true,
							warehouse_received_by: user.uuid,
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
				message: err.message,
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
				className='outline-none'
				tabIndex={0}
				onBlur={() => setScannerActive(false)}
				onFocus={() => setScannerActive(true)}
				ref={containerRef}
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='flex flex-col gap-4'
				>
					<SectionEntryBody
						title='Details'
						header={
							<span
								className={cn(
									'btn btn-sm',
									scannerActive ? 'btn-success' : 'btn-error'
								)}
							>
								Scanner: {scannerActive ? 'ON' : 'OFF'}
							</span>
						}
					>
						<FormField
							label='packet_list_uuid'
							title='Packet List'
							errors={errors}
						>
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
											setSymbol(value);
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
						title={`Entry: Total Scan Item: ${getValues('entry')?.length}`}
						handelAppend={handelEntryAppend}
						showAppendButton={false}
						tableHead={[
							'Packet List',
							'Order Number',
							'Carton Size',
							'Carton Weight',
							'Total Poly Quantity',
							'Total Quantity',
							'Warehouse Receive Date',
							'Action',
						].map((item) => (
							<th
								key={item}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300 first:pl-2'
							>
								{item}
							</th>
						))}
					>
						{EntryField.map((item, index) => (
							<tr key={item.id}>
								<td className={`w-80 ${rowClass}`}>
									<CustomLink
										label={getValues(
											`entry[${index}].packing_number`
										)}
										url={`/delivery/packing-list/${getValues(
											`entry[${index}].uuid`
										)}`}
									/>
								</td>
								<td className={`w-80 ${rowClass}`}>
									{getValues(`entry[${index}].item_for`) ===
										'thread' ||
									getValues(`entry[${index}].item_for`) ===
										'sample_thread' ? (
										<CustomLink
											label={getValues(
												`entry[${index}].order_number`
											)}
											url={`/thread/order-info/${getValues(`entry[${index}].order_info_uuid`)}`}
										/>
									) : (
										<CustomLink
											label={getValues(
												`entry[${index}].order_number`
											)}
											url={`/order/details/${getValues(
												`entry[${index}].order_number`
											)}`}
										/>
									)}
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
								<td className={`w-80 ${rowClass}`}>
									<DateTime
										date={getValues(
											`entry[${index}].warehouse_received_date`
										)}
									/>
								</td>
								<td
									className={`w-20 ${rowClass} border-l-4 border-l-primary`}
								>
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
				</form>
			</div>
		</FormProvider>
	);
}
