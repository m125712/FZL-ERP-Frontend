import { lazy, useEffect, useState } from 'react';
import { formatDate } from 'date-fns';
import { FormProvider } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { Suspense } from '@/components/Feedback';
import { Footer } from '@/components/Modal/ui';

import { DevTool } from '@/lib/react-hook-devtool';

import { VOUCHER_NULLABLE, VOUCHER_SCHEMA } from '../config/schema';
import Header from './components/Header';
import TotalsRow from './components/TotalRow';
import VoucherEntryRow from './components/VoucherEntryRow';
import { useVoucherNestedEntries } from './hooks/useNestedEntries';
import { useVoucherData } from './hooks/useVoucherData';
import { useVoucherEntries } from './hooks/useVoucherEntries';
import { useVoucherForm } from './hooks/useVoucherForm';
import { useVoucherSubmission } from './hooks/useVoucherSubmission';

const CostCenterAdd = lazy(() => import('./components/CostCenterAdd'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { uuid, vendor_name, purchase_id, amount } = useParams();

	// State
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});
	const [updateItem, setUpdateItem] = useState({ uuid: null });

	// Data fetching
	const {
		voucherURL,
		deleteData,
		voucherData,
		postData,
		invalidateVoucher,
		isVoucherLoading,
		ledgerOptions,
		invalidateLedger,
		currencyOptions,
		isCurrencyLoading,
		isUpdate,
		costCenterOptions,
	} = useVoucherData(uuid);

	// Form management
	const formProps = useVoucherForm({
		schema: VOUCHER_SCHEMA,
		nullableDefaults: VOUCHER_NULLABLE,
		currencyOptions,
		isCurrencyLoading,
		data: voucherData,
		isDataLoading: isVoucherLoading,
	});

	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		Controller,
		getValues,
		watch,
		setValue,
		setError,
		context: form,
		voucherFields,
		dirtyFields,
	} = formProps;

	// Entry management
	const entryProps = useVoucherEntries({
		watch,
		setValue,
		getValues,
		append: formProps.append,
		remove: formProps.remove,
		voucherFields,
		setDeleteItem,
	});

	const nestedEntryProps = useVoucherNestedEntries({
		watch,
		setValue,
		setDeleteItem,
	});
	useEffect(() => {
		if (
			vendor_name &&
			purchase_id &&
			ledgerOptions.length > 0 &&
			costCenterOptions.length > 0 &&
			amount
		) {
			const CrLedger = ledgerOptions.find(
				(l) => l.label.split('(')[0].trim() === 'Trade Payable'
			);

			const vendorCostCenter = costCenterOptions.find(
				(cc) => cc.value === vendor_name
			);

			const purchaseCostCenter = costCenterOptions.find(
				(cc) => cc.value === purchase_id
			);
			const DrLedger = ledgerOptions.find(
				(l) => l.identifier === purchaseCostCenter?.identifier
			);

			if (DrLedger && CrLedger) {
				const formData = {
					...VOUCHER_NULLABLE,
					currency_uuid:
						currencyOptions.find((c) => c.default)?.value ?? null,
					conversion_rate:
						currencyOptions.find((c) => c.default)
							?.conversion_rate ?? 1,
					category: 'journal',
					date: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
					voucher_entry: [
						{
							ledger_uuid: DrLedger.value,
							amount: Number(amount),
							type: 'dr',
							voucher_entry_cost_center: purchaseCostCenter
								? [
										{
											cost_center_uuid:
												purchaseCostCenter.value,
											amount: Number(amount),
											invoice_no:
												purchaseCostCenter.invoice_no,
										},
									]
								: [],
							voucher_entry_payment: [],
						},
						{
							ledger_uuid: CrLedger.value,
							amount: Number(amount),
							type: 'cr',
							voucher_entry_cost_center: vendorCostCenter
								? [
										{
											cost_center_uuid:
												vendorCostCenter.value,
											amount: Number(amount),
											invoice_no:
												vendorCostCenter.invoice_no,
										},
									]
								: [],
							voucher_entry_payment: [],
						},
					],
				};

				reset(formData);
			}
		}
	}, [
		vendor_name,
		purchase_id,
		amount,
		ledgerOptions,
		costCenterOptions,
		reset,
	]);

	// Form submission
	const onSubmit = useVoucherSubmission({
		isUpdate,
		uuid,
		reset,
		VOUCHER_NULLABLE,
		voucherURL,
		setError,
		dirtyFields,
	});

	const rowClass = 'border px-3 py-2 text-sm align-center';
	const currencySymbol = currencyOptions?.find(
		(c) => c.value === getValues('currency_uuid')
	)?.symbol;

	// Loading state
	if (isCurrencyLoading) {
		return <span className='loading loading-dots loading-lg z-50' />;
	}

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				className='flex flex-col gap-4'
			>
				<Header
					register={register}
					errors={errors}
					control={control}
					getValues={getValues}
					setValue={setValue}
					Controller={Controller}
					watch={watch}
					isUpdate={isUpdate}
					currencyOptions={currencyOptions}
				/>

				<VoucherEntryRow
					control={control}
					register={register}
					errors={errors}
					Controller={Controller}
					watch={watch}
					setValue={setValue}
					ledgerOptions={ledgerOptions}
					invalidateLedger={invalidateLedger}
					voucherFields={voucherFields}
					currencyOptions={currencyOptions}
					vendor_name={vendor_name}
					purchase_id={purchase_id}
					amount={amount}
					{...entryProps}
					{...nestedEntryProps}
					setUpdateItem={setUpdateItem}
				>
					{voucherFields.length > 0 && (
						<TotalsRow
							register={register}
							control={control}
							errors={errors}
							rowClass={rowClass}
							currencySymbol={currencySymbol}
							precision={2}
						/>
					)}
				</VoucherEntryRow>

				<Footer buttonClassName='!btn-primary' />
				<DevTool placement='top-left' control={control} />
			</form>

			<Suspense>
				<CostCenterAdd
					modalId='voucher_entry_cost_center_add'
					updateItem={updateItem}
					setUpdateItem={setUpdateItem}
					postData={postData}
				/>
				<DeleteModal
					modalId='voucher_entry_delete'
					title='Delete Voucher Entry'
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					setItems={deleteItem}
					invalidateQuery={invalidateVoucher}
					url='/acc/voucher-entry'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId='cost_center_delete'
					title='Delete Cost Center Entry'
					deleteItem={deleteItem}
					setDeleteItem={setDeleteItem}
					invalidateQuery={invalidateVoucher}
					setItems={deleteItem}
					url='/acc/voucher-entry-cost-center'
					deleteData={deleteData}
				/>
				<DeleteModal
					modalId='voucher_entry_payment_delete'
					title='Delete Payment'
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
