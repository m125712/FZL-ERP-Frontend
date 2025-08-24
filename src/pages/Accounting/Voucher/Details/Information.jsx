import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';

export default function Information({
	voucher = {
		uuid: null,
		date: null,
		voucher_id: null,
		category: null,
		vat_deduction: null,
		tax_deduction: null,
		created_by: null,
		created_by_name: null,
		created_at: null,
		updated_at: null,
		remarks: null,
	},
}) {
	const {
		uuid,
		voucher_id,
		category,
		vat_deduction,
		tax_deduction,
		created_by,
		created_by_name,
		created_at,
		updated_at,
		currency_name,
		conversion_rate,
		remarks,
	} = voucher;

	const renderItems = () => {
		const items = [
			{
				label: 'ID',
				value: voucher_id,
			},

			{
				label: 'Category',
				value: category,
			},
			{
				label: 'VAT Deduction',
				value: vat_deduction,
			},
			{
				label: 'TAX Deduction',
				value: tax_deduction,
			},
			{
				label: 'Currency',
				value: currency_name,
			},
			{
				label: 'Conversion Rate',
				value: conversion_rate,
			},
		];
		const create = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yyyy - hh:mm a'),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yyyy - hh:mm a'),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			items,
			create,
		};
	};

	return (
		<SectionContainer title={'Voucher Information'}>
			<div className='flex flex-col gap-2 lg:flex-row'>
				<div className='grid w-full grid-cols-1 border-secondary/30 lg:grid-cols-2'>
					<RenderTable
						className={'border-secondary/30 lg:border-r'}
						title={'General'}
						items={renderItems().items}
					/>
					<RenderTable
						className={'border-secondary/30 lg:border-r'}
						title={'Created'}
						items={renderItems().create}
					/>
				</div>
			</div>
		</SectionContainer>
	);
}
