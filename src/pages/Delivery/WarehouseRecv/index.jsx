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
import { ActionButtons, DynamicField } from '@/ui';

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

	const { handleSubmit, errors, reset, control, useFieldArray, getValues } =
		useRHF(WAREHOUSE_RECEIVE_SCHEMA, WAREHOUSE_RECEIVE_NULL);

	const {
		fields: EntryField,
		append: EntryAppend,
		remove: EntryRemove,
	} = useFieldArray({
		control,
		name: 'entry',
	});

	const {
		data: packetListData,
		url,
		updateData,
	} = useDeliveryPackingListByUUID(symbol);

	const { invalidateQuery: invalidateDeliveryPackingList } =
		useDeliveryPackingList();

	// Handle focus management
	// const maintainFocus = useCallback(
	// 	(e) => {
	// 		if (containerRef.current) {
	// 			if (
	// 				e.relatedTarget === null ||
	// 				!e.relatedTarget.matches('input, select, textarea, button')
	// 			) {
	// 				containerRef.current.focus();
	// 			}
	// 		}
	// 	},
	// 	[containerRef]
	// );

	// Set initial focus
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.focus();
		}
	}, [containerRef]);

	const handleSymbol = useCallback((scannedSymbol) => {
		if (!scannedSymbol) return;
		setSymbol(scannedSymbol);
	}, []);

	// Handle packet list data
	useEffect(() => {
		if (packetListData) {
			const currentEntries = getValues('entry') || [];
			const isDuplicate = currentEntries.some(
				(entry) =>
					entry.packing_number === packetListData.packing_number
			);
			const isRecv = packetListData.is_warehouse_received;
			if (!isDuplicate) {
				EntryAppend({ ...packetListData });
			} else if (isRecv) {
				ShowLocalToast({
					type: 'error',
					message: 'This item has already been received',
				});
			} else {
				ShowLocalToast({
					type: 'error',
					message: 'This item has already been scanned',
				});
			}
			setSymbol(null);
		}
	}, [packetListData]);

	useSymbologyScanner(handleSymbol, {
		target: containerRef,

		enabled: scannerActive, // Use the scannerActive state to control the scanner
		eventOptions: { capture: true, passive: true },
		scannerOptions: {
			maxDelay: 100,
		},
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
			const updatablePackingListEntryPromises = getValues('entry').map(
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

	const toggleScanner = () => {
		setScannerActive((prev) => !prev);
	};
	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide';

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			onBlur={() => setScannerActive(false)}
			onFocus={() => {
				setIsInputFocused(true);
			}}
			className='min-h-screen p-4 outline-none'>
			<div className='mb-4 flex items-center gap-4'>
				<div
					className={`flex items-center gap-2 ${scannerActive ? 'text-success' : 'text-error'}`}>
					<div
						className={`h-3 w-3 rounded-full ${scannerActive ? 'bg-success' : 'bg-error'}`}></div>
					<span className='text-sm font-medium'>
						Scanner {scannerActive ? 'Active' : 'Inactive'}
					</span>
				</div>
				<input
					onClick={toggleScanner}
					className={`btn btn-sm ${scannerActive ? 'btn-error' : 'btn-success'}`}
					value={scannerActive ? 'Disable Scanner' : 'Enable Scanner'}
					type='button'
				/>
			</div>
			<HotKeys {...{ keyMap, handlers }}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					className='mt-4 flex flex-col gap-4'>
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
										showRemoveButton={EntryField.length > 1}
									/>
								</td>
							</tr>
						))}
					</DynamicField>

					<div className='modal-action'>
						<button
							type='submit'
							className='text-md btn btn-primary btn-block'>
							Save
						</button>
					</div>
				</form>
			</HotKeys>
		</div>
	);
}
