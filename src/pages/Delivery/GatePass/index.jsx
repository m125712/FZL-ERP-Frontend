import { useCallback, useEffect, useRef, useState } from 'react';
import {
	useDeliveryPackingList,
	useDeliveryPackingListByUUID,
} from '@/state/Delivery';
import { useSymbologyScanner } from '@use-symbology-scanner/react';
import { configure, HotKeys } from 'react-hotkeys';
import { useNavigate } from 'react-router-dom';
import { useAccess, useFetch, useRHF } from '@/hooks';

import { ShowLocalToast } from '@/components/Toast';
import {
	ActionButtons,
	DynamicField,
	FormField,
	ReactSelect,
	SectionEntryBody,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import {
	WAREHOUSE_RECEIVE_NULL,
	WAREHOUSE_RECEIVE_SCHEMA,
} from '@/util/Schema';

export default function Index() {
	const containerRef = useRef(null);
	const [symbol, setSymbol] = useState(null);
	const [scannerActive, setScannerActive] = useState(true);
	const navigate = useNavigate();
	const haveAccess = useAccess('delivery__warehouse_recv');

	const scan_option = [
		{ value: 'warehouse_receive', label: 'Warehouse Receive' },
		{ value: 'gate_pass', label: 'Gate Pass' },
	];

	const {
		handleSubmit,
		errors,
		reset,
		control,
		useFieldArray,
		getValues,
		Controller,
	} = useRHF(WAREHOUSE_RECEIVE_SCHEMA, WAREHOUSE_RECEIVE_NULL);

	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'entry',
	});

	const { data:challan_option } = useDeliveryPackingListByUUID();

	const { invalidateQuery: invalidateDeliveryPackingList } =
		useDeliveryPackingList();

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, [containerRef]);

	const handleSymbol = useCallback((scannedSymbol) => {
		if (!scannedSymbol) return;
		setSymbol(scannedSymbol);
	}, []);

	const handlePacketScan = async (selectedOption) => {
		const waitForLoading = () => {
			return new Promise((resolve) => {
				if (!isLoading) {
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
				return packetListData;
			}
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

	const handelDuplicateDynamicField = useCallback(
		(index) => {
			const item = getValues(`entry[${index}]`);
			EntryAppend({
				...item,
				order_description_uuid: undefined,
			});
		},
		[getValues, EntryAppend]
	);

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
			navigate(`/delivery/zipper-packing-list`);
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
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			onBlur={() => setScannerActive(false)}
			onFocus={() => setScannerActive(true)}
			className='min-h-screen p-4 outline-none'>
			{isLoading && (
				<div className='loading-spinner'>
					<p>Loading...</p>
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
										onChange={(e) => {
											const value = e.value;
											onChange(value);
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
										duplicateClick={() =>
											handelDuplicateDynamicField(index)
										}
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

					<div className='modal-action'>
						<button
							type='submit'
							disabled={
								getValues('entry').length < 1 || isLoading
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
