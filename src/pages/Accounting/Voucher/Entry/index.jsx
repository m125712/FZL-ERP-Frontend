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
		context: form,
	} = useRHF(VOUCHER_SCHEMA, VOUCHER_NULLABLE);

	const isUpdate = uuid !== undefined;

	const {
		fields: voucherFields,
		remove,
		appendDrEntry,
		appendCrEntry,
		replace,
	} = useVoucherEntries(control);

	// Calculate totals
	const voucherEntries = watch('voucher_entry') || [];
	const totals = useMemo(() => {
		return voucherEntries.reduce(
			(acc, entry) => {
				const amount = parseFloat(entry?.amount) || 0;
				if (entry?.type === 'dr') {
					acc.debit += amount;
				} else if (entry?.type === 'cr') {
					acc.credit += amount;
				}
				return acc;
			},
			{ debit: 0, credit: 0 }
		);
	}, [voucherEntries]);

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
			console.log('Removing entry of data:', entryUuid);
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
	});

	const rowClass =
		'group whitespace-nowrap text-left text-sm font-normal tracking-wide p-3';

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
							/>
						))}

						{/* Narration Row with Totals */}
						{voucherFields.length > 0 && (
							<VoucherEntryRow
								key='narration'
								watch={watch}
								isNarrationRow={true}
								totalDebit={totals.debit}
								totalCredit={totals.credit}
								rowClass={rowClass}
							/>
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
