import { lazy, useCallback, useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { Footer } from '@/components/Modal/ui';
import { Input } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';

import { useOtherAccLedger } from '../../CostCenter/config/query';
import { useVoucher, useVoucherByUUID } from '../config/query';
import { VOUCHER_NULLABLE, VOUCHER_SCHEMA } from '../config/schema';
import Header from './components/Header';
import VoucherEntryRow from './components/VoucherEntryRow';
import { useVoucherSubmission } from './hooks/useVoucherSubmission';
import { normalizeVoucher } from './utils';

const CostCenterAdd = lazy(() => import('./components/CostCenterAdd'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { uuid } = useParams();

	const { url: voucherURL, deleteData } = useVoucher();
	const {
		data,
		postData,
		invalidateQuery: invalidateVoucher,
	} = useVoucherByUUID(uuid);
	const { data: ledgerOptions = [] } = useOtherAccLedger();

	useEffect(() => {
		if (uuid !== undefined) {
			document.title = 'Update Voucher: ' + uuid;
		} else {
			document.title = 'New Voucher Entry';
		}
	}, [uuid]);
	const defaultValue = {
		...VOUCHER_NULLABLE,
		...normalizeVoucher(data),
	};

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		useFieldArray,
		getValues,
		watch,
		setValue,
		setError,
		context: form,
	} = useRHF(VOUCHER_SCHEMA, VOUCHER_NULLABLE);

	const isUpdate = uuid !== undefined;

	const {
		fields: voucherFields,
		append,
		remove,
		replace,
	} = useFieldArray({ control, name: 'voucher_entry', keyName: 'id' });

	// Seed from last opposite entry
	const getSeedAmount = useCallback(
		(newType) => {
			if (watch(`voucher_entry`).length === 0) {
				return 0;
			}
			const crTotal = watch(`voucher_entry`).reduce((acc, entry) => {
				if (entry.type === 'cr') {
					return acc + Number(entry.amount);
				}
				return acc;
			}, 0);
			const drTotal = watch(`voucher_entry`).reduce((acc, entry) => {
				if (entry.type === 'dr') {
					return acc + Number(entry.amount);
				}
				return acc;
			}, 0);

			if (newType === 'cr' && drTotal > crTotal) {
				return drTotal - crTotal;
			} else if (newType === 'dr' && crTotal > drTotal) {
				return crTotal - drTotal;
			}
			return 0;
		},
		[voucherFields]
	);

	// Append handlers
	const appendDrEntry = useCallback(() => {
		append({
			uuid: undefined,
			index: voucherFields.length,
			type: 'dr',
			ledger_uuid: '',
			description: '',
			amount: getSeedAmount('dr'),
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append, getSeedAmount, voucherFields.length]);

	const appendCrEntry = useCallback(() => {
		append({
			uuid: undefined,
			index: voucherFields.length,
			type: 'cr',
			ledger_uuid: '',
			description: '',
			amount: Number(getSeedAmount('cr')),
			voucher_entry_cost_center: [],
			voucher_entry_payment: [],
		});
	}, [append, getSeedAmount, voucherFields.length]);

	useEffect(() => {}, [voucherFields]);

	// Sync form + field array on load
	useEffect(() => {
		if (data) {
			const normalized = normalizeVoucher(data, VOUCHER_NULLABLE);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized.voucher_entry ?? []);
		}
	}, [data, reset, replace]);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handleVoucherRemove = useCallback(
		(index) => {
			const entryUuid = getValues(`voucher_entry[${index}].uuid`);
			if (entryUuid !== undefined) {
				setDeleteItem({
					itemId: entryUuid,
					itemName: getValues(
						`voucher_entry[${index}].material_name`
					),
				});
				window['voucher_entry_delete'].showModal();
			}
			remove(index);
		},
		[getValues, remove]
	);

	// const handleTypeChange = useCallback(
	// 	(index, newType, onChange) => {
	// 		onChange(newType);
	// 		if (newType === 'cr') {
	// 			setValue(
	// 				`voucher_entry[${index}].voucher_entry_cost_center`,
	// 				[]
	// 			);
	// 		} else if (newType === 'dr') {
	// 			setValue(`voucher_entry[${index}].voucher_entry_payment`, []);
	// 		}
	// 		setValue(`voucher_entry[${index}].amount`, 0);
	// 	},
	// 	[setValue]
	// );

	// Wrap reset so voucher_entry stays in sync after submit
	const resetWithArraySync = useCallback(
		(val) => {
			const normalized = normalizeVoucher(val);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized?.voucher_entry ?? []);
		},
		[reset, replace]
	);
	// Track previous ledger_uuid & type per row
	const prevRef = useRef({});
	useEffect(() => {
		if (data) {
			const norm = normalizeVoucher(data, VOUCHER_NULLABLE);
			reset(norm);
			replace(norm.voucher_entry || []);
			// Initialize prevRef
			norm.voucher_entry.forEach((entry, idx) => {
				prevRef.current[idx] = {
					ledger_uuid: entry.ledger_uuid,
					type: entry.type,
				};
			});
		}
	}, [data, reset, replace]);

	const handleTypeChange = useCallback(
		(index, newType, onChange) => {
			onChange(newType);
			if (newType === 'cr') {
				setValue(
					`voucher_entry[${index}].voucher_entry_cost_center`,
					[]
				);
			} else if (newType === 'dr') {
				setValue(`voucher_entry[${index}].voucher_entry_payment`, []);
			}
			setValue(`voucher_entry[${index}].amount`, 0);
		},
		[setValue]
	);
	const onSubmit = useVoucherSubmission({
		isUpdate,
		uuid,
		reset: resetWithArraySync,
		VOUCHER_NULLABLE,
		voucherURL,
		setError,
	});
	const rowClass = 'border px-3 py-2 text-sm align-center';

	const totalCr = watch(`voucher_entry`)?.reduce((acc, curr) => {
		if (curr.type === 'cr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	const totalDr = watch(`voucher_entry`)?.reduce((acc, curr) => {
		if (curr.type === 'dr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	// Payment Handlers
	const handlePaymentAppend = useCallback(
		(voucherIndex) => {
			const currentPayments =
				watch(`voucher_entry[${voucherIndex}].voucher_entry_payment`) ||
				[];
			setValue(`voucher_entry[${voucherIndex}].voucher_entry_payment`, [
				...currentPayments,
				{
					payment_type: '',
					trx_no: '',
					date: null,
					amount: '',
				},
			]);
		},
		[setValue, watch]
	);

	const handlePaymentRemove = useCallback(
		(voucherIndex, paymentIndex) => {
			const currentPayments =
				watch(`voucher_entry[${voucherIndex}].voucher_entry_payment`) ||
				[];

			if (currentPayments[paymentIndex].uuid !== undefined) {
				setDeleteItem({
					itemId: currentPayments[paymentIndex].uuid,
					itemName: currentPayments[paymentIndex].trx_no,
				});
				window['voucher_entry_payment_delete'].showModal();
			} else {
				setValue(
					`voucher_entry[${voucherIndex}].voucher_entry_payment`,
					currentPayments.filter((_, i) => i !== paymentIndex)
				);
			}
		},
		[setValue, watch]
	);

	// Cost Center Handlers
	const handleCostCenterAppend = useCallback(
		(voucherIndex) => {
			const currentCostCenters =
				watch(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`
				) || [];
			setValue(
				`voucher_entry[${voucherIndex}].voucher_entry_cost_center`,
				[
					...currentCostCenters,
					{
						cost_center_uuid: '',
						amount: 0,
					},
				]
			);
		},
		[setValue, watch]
	);

	const handleCostCenterRemove = useCallback(
		(voucherIndex, costCenterIndex) => {
			const currentCostCenters =
				watch(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`
				) || [];

			if (currentCostCenters[costCenterIndex].uuid !== undefined) {
				setDeleteItem({
					itemId: currentCostCenters[costCenterIndex].uuid,
					itemName:
						currentCostCenters[costCenterIndex].cost_center_name,
				});
				window['cost_center_delete'].showModal();
			} else {
				setValue(
					`voucher_entry[${voucherIndex}].voucher_entry_cost_center`,
					currentCostCenters.filter((_, i) => i !== costCenterIndex)
				);
			}
		},
		[setValue, watch]
	);
	const [updateItem, setUpdateItem] = useState({
		uuid: null,
	});
	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<Header
					{...{
						register,
						errors,
						control,
						getValues,
						setValue,
						Controller,
						watch,
						isUpdate,
					}}
				/>

				<VoucherEntryRow
					control={control}
					register={register}
					errors={errors}
					Controller={Controller}
					watch={watch}
					setValue={setValue}
					ledgerOptions={ledgerOptions}
					voucherFields={voucherFields}
					appendDrEntry={appendDrEntry}
					appendCrEntry={appendCrEntry}
					handleVoucherRemove={handleVoucherRemove}
					handleTypeChange={handleTypeChange}
					handlePaymentAppend={handlePaymentAppend}
					handlePaymentRemove={handlePaymentRemove}
					handleCostCenterAppend={handleCostCenterAppend}
					handleCostCenterRemove={handleCostCenterRemove}
					setUpdateItem={setUpdateItem}
				>
					{/* Totals Row */}
					{voucherFields.length > 0 && (
						<tr className='border-t-2 border-gray-300 bg-gray-100 font-bold'>
							<td
								colSpan={5}
								className={`${rowClass} flex-1 font-bold text-gray-700`}
							>
								<div className='flex w-full gap-2'>
									<p className='align-center justify-center py-3'>
										Narration
									</p>
									<Input
										title='Credit'
										label={`narration`}
										is_title_needed='false'
										register={register}
										dynamicerror={errors.narration}
									/>
								</div>
							</td>
							<td
								className={`${rowClass} text-right font-bold text-green-600`}
							>
								{totalDr.toFixed(2)}
							</td>
							<td
								className={`${rowClass} text-right font-bold text-red-600`}
							>
								{totalCr.toFixed(2)}
							</td>
							<td className={rowClass}>
								<div className='text-center text-xs'>
									{totalCr === totalDr &&
									totalCr > 0 &&
									totalDr > 0 ? (
										<span className='font-medium text-success'>
											✓ Balanced
										</span>
									) : (
										<span className='font-medium text-error'>
											⚠ Unbalanced
										</span>
									)}
								</div>
							</td>
						</tr>
					)}
				</VoucherEntryRow>

				<Footer buttonClassName='!btn-primary' />
				<DevTool placement='top-left' control={control} />
			</form>

			<Suspense>
				<CostCenterAdd
					modalId={'voucher_entry_cost_center_add'}
					{...{
						updateItem,
						setUpdateItem,
						postData,
					}}
				/>
				<DeleteModal
					modalId={'voucher_entry_delete'}
					title={'Delete Voucher Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={deleteItem}
					invalidateQuery={invalidateVoucher}
					url='/acc/voucher-entry'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId={'cost_center_delete'}
					title={'Delete Cost Center Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					invalidateQuery={invalidateVoucher}
					setItems={deleteItem}
					url='/acc/voucher-entry-cost-center'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId={'voucher_entry_payment_delete'}
					title={'Delete Payment'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					invalidateQuery={invalidateVoucher}
					setItems={deleteItem}
					url='/acc/voucher-entry-payment'
					deleteData={deleteData}
				/>
			</Suspense>
		</FormProvider>
	);
}
