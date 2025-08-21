// Index.jsx - Updated with narration totals
import React, { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@context/auth';
import { Plus } from 'lucide-react';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useRHF } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { Footer } from '@/components/Modal/ui';
import { DynamicField } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import GetDateTime from '@/util/GetDateTime';

import { useOtherAccLedger } from '../../CostCenter/config/query';
import { useVoucher, useVoucherByUUID } from '../config/query';
import { VOUCHER_NULLABLE, VOUCHER_SCHEMA } from '../config/schema';
import Header from './components/Header';
import VoucherEntryRow from './components/VoucherEntryRow';
import { useVoucherEntries } from './hooks/useVoucherEntries';
import { useVoucherSubmission } from './hooks/useVoucherSubmission';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

function normalizeVoucher(v) {
	if (!v) return VOUCHER_NULLABLE;
	const entries = Array.isArray(v.voucher_entry) ? v.voucher_entry : [];
	const normalizedEntries = entries.map((e, index) => ({
		...e,
		index: e?.index ?? index,
		voucher_entry_cost_center: Array.isArray(e?.voucher_entry_cost_center)
			? e.voucher_entry_cost_center
			: [],
		voucher_entry_payment: Array.isArray(e?.voucher_entry_payment)
			? e.voucher_entry_payment
			: [],
	}));
	return {
		...v,
		voucher_entry: normalizedEntries,
	};
}

export default function Index() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { uuid } = useParams();

	const { url: purchaseDescriptionUrl, deleteData } = useVoucher();
	const { data } = useVoucherByUUID(uuid);
	const { data: ledgerOptions = [] } = useOtherAccLedger();

	useEffect(() => {
		if (uuid !== undefined) {
			document.title = 'Update Voucher: ' + uuid;
		} else {
			document.title = 'New Voucher Entry';
		}
	}, [uuid]);

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
		formState,
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
			const normalized = normalizeVoucher(data);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized.voucher_entry ?? []);
		}
	}, [data, reset, replace]);

	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const typeOptions = useMemo(
		() => [
			{ value: 'dr', label: 'Dr' },
			{ value: 'cr', label: 'Cr' },
		],
		[]
	);

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

	// Wrap reset so voucher_entry stays in sync after submit
	const resetWithArraySync = useCallback(
		(val) => {
			const normalized = normalizeVoucher(val);
			reset(normalized, { keepDefaultValues: false });
			replace(normalized?.voucher_entry ?? []);
		},
		[reset, replace]
	);

	const onSubmit = useVoucherSubmission({
		isUpdate,
		uuid,
		user,
		navigate,
		nanoid,
		GetDateTime,
		reset: resetWithArraySync,
		VOUCHER_NULLABLE,
		purchaseDescriptionUrl,
		setError,
	});
	const allEntries = watch('voucher_entry');
	const selectedLedgers = allEntries
		.map((entry) => entry.ledger_uuid)
		.filter(Boolean);
	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide p-3';

	const totalCr = watch(`voucher_entry`)?.reduce((acc, curr) => {
		if (curr.type === 'cr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	const totalDr = watch(`voucher_entry`)?.reduce((acc, curr) => {
		if (curr.type === 'dr') return acc + Number(curr.amount);
		return acc;
	}, 0);

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col'
			>
				<div className='space-y-6'>
					<Header
						{...{
							register,
							errors,
							control,
							getValues,
							Controller,
							watch,
							isUpdate,
						}}
					/>

					<DynamicField
						title='Voucher Entry'
						extraButton={
							<div className='flex items-center gap-4'>
								<button
									type='button'
									className='btn btn-accent btn-xs rounded'
									onClick={appendDrEntry}
								>
									<Plus className='w-5' /> DR
								</button>
								<button
									type='button'
									className='btn btn-error btn-xs rounded'
									onClick={appendCrEntry}
								>
									<Plus className='w-5' /> CR
								</button>
							</div>
						}
						tableHead={[
							'No.',
							'Type',
							'Ledger',
							'Description',
							'Debit',
							'Credit',
							'Action',
						].map((th) => (
							<th
								key={th}
								scope='col'
								className='group cursor-pointer select-none whitespace-nowrap bg-secondary px-4 py-2 text-left font-semibold tracking-wide text-secondary-content transition duration-300'
							>
								{th}
							</th>
						))}
					>
						{voucherFields.map((item, index) => (
							<VoucherEntryRow
								key={item.id}
								index={index}
								Controller={Controller}
								control={control}
								register={register}
								errors={errors}
								watch={watch}
								setValue={setValue}
								ledgerOptions={ledgerOptions}
								typeOptions={typeOptions}
								rowClass={rowClass}
								onRemove={() => handleVoucherRemove(index)}
								onTypeChange={handleTypeChange}
								selectedLedgers={selectedLedgers}
							/>
						))}

						{/* Narration Row with Totals */}
						{voucherFields.length > 0 && (
							<tr className='border-t-2 border-gray-300 bg-gray-100'>
								<td className={`${rowClass} font-bold`}>
									<span className='font-bold text-gray-700'>
										Narration
									</span>
								</td>
								<td className={`${rowClass}`}></td>
								<td className={`${rowClass}`}></td>
								<td
									className={`${rowClass} text-right font-bold`}
								>
									{totalDr}
								</td>
								<td
									className={`${rowClass} text-right font-bold`}
								>
									{totalCr}
								</td>
								<td className={`${rowClass}`}></td>
							</tr>
						)}
					</DynamicField>
				</div>

				<Footer buttonClassName='!btn-primary' />
				<DevTool placement='top-left' control={control} />
			</form>
			<Suspense>
				<DeleteModal
					modalId={'voucher_entry_delete'}
					title={'Delete Voucher Entry'}
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={deleteItem}
					url='/acc/voucher-entry'
					deleteData={deleteData}
				/>
			</Suspense>
		</FormProvider>
	);
}
