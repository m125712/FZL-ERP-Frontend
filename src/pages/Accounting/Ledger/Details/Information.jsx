import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { LinkWithCopy, StatusButton, TitleValue } from '@/ui';

export default function Information({ data }) {
	const renderItems = () => {
		const basicInfo = [
			{
				label: 'Active',
				value: (
					<StatusButton
						value={data?.is_active}
						className={'btn-xs'}
					/>
				),
			},

			{
				label: 'ID',
				value: data?.id,
			},
			{
				label: 'Name',
				value: data?.name,
			},
			{
				label: 'Group',
				value: data?.group_name,
			},
			{
				label: 'Accounting Head',
				value: data?.head_name,
			},
			{
				label: 'Amount',
				value:
					data?.total_amount >= 0
						? data?.total_amount.toLocaleString()
						: `(${Math.abs(data?.total_amount).toLocaleString()})`,
			},
			{
				label: 'Bank Ledger',
				value: data?.is_bank_ledger,
			},
			{
				label: 'Account No.',
				value: data?.account_no,
			},
			{
				label: 'Old Ledger ID',
				value: data?.old_ledger_id,
			},
		];

		const otherDetails = [
			{
				label: 'Index',
				value: data?.index,
			},
			{
				label: 'Table',
				value: data?.table_name,
			},
			{
				label: 'Identifier',
				value: data?.identifier,
			},
			{
				label: 'Type',
				value: data?.type,
			},
			{
				label: 'Restrictions',
				value: data?.restrictions,
			},
			{
				label: 'Group No',
				value: data?.group_number,
			},
			{
				label: 'Initial Amount',
				value: data?.initial_amount,
			},
			{
				label: 'VAT Deduction',
				value: data?.vat_deduction,
			},
			{
				label: 'Tax Deduction',
				value: data?.tax_deduction,
			},

			{
				label: 'Remarks',
				value: data?.remarks,
			},
		];
		const createdDetails = [
			{
				label: 'Created By',
				value: data?.created_by_name,
			},
			{
				label: 'Created At',
				value: format(data?.created_at, 'dd/MM/yyyy'),
			},
			{
				label: 'Updated At',
				value: data?.updated_at
					? format(data?.updated_at, 'dd/MM/yyyy')
					: '--',
			},
		];

		return {
			basicInfo,
			otherDetails,
			createdDetails,
		};
	};
	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0'}>
			<div className='grid grid-cols-1 lg:grid-cols-3'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Other Details'}
					items={renderItems().otherDetails}
				/>
				<RenderTable
					className={'border-secondary/30'}
					title={'Created Details'}
					items={renderItems().createdDetails}
				/>
			</div>
		</SectionContainer>
	);
}
