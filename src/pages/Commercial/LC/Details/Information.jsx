import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { DateTime, LinkWithCopy, TitleValue } from '@/ui';

const LCInfo = (lc) => {
	return (
		<div className=''>
			<TitleValue title='LC ID' value={lc?.uuid} />
			<TitleValue
				title='PI ID'
				value={lc?.pi_ids.map((piId) => (
					<LinkWithCopy
						key={piId}
						title={piId}
						id={piId}
						uri='/commercial/pi/details'
					/>
				))}
			/>
			<TitleValue title='LC Number' value={lc?.lc_number} />
			<TitleValue title='File Number' value={lc?.file_no} />
			<TitleValue title='LC Date' value={lc?.lc_date} />
			<TitleValue title='Payment Value' value={lc?.payment_value} />
			<TitleValue title='LDBC/FDBC' value={lc?.ldbc_fdbc} />
			<TitleValue title='Expiry' value={lc?.expiry_date} />
			<TitleValue title='Payment Receive In' value={lc?.at_sight} />
		</div>
	);
};

function OthersInfo(lc) {
	return (
		<div className=''>
			<TitleValue title='Payment' value={lc?.payment_date} />
			<TitleValue title='Acceptance' value={lc?.acceptance_date} />
			<TitleValue title='Maturity' value={lc?.maturity_date} />
			<TitleValue
				title='Commercial Executive'
				value={lc?.commercial_executive}
			/>
			<TitleValue title='Party Bank' value={lc?.party_bank} />
			<TitleValue title='UD No.' value={lc?.ud_no} />
			<TitleValue title='UD Receive' value={lc?.ud_received} />
			<TitleValue title='Amendment' value={lc?.amd_date} />
			<TitleValue title='Amendment Count' value={lc?.amd_count} />
		</div>
	);
}
function BankInfo(lc) {
	return (
		<div className=''>
			<TitleValue
				title='Production Complete'
				value={lc?.production_complete ? 'Yes' : 'No'}
			/>
			<TitleValue
				title='LC Cancelled'
				value={lc?.lc_cancel ? 'Yes' : 'No'}
			/>
			<TitleValue title='Handover' value={lc?.handover_date} />
			<TitleValue title='Shipment' value={lc?.shipment_date} />
			<TitleValue
				title='Problematic'
				value={lc?.problematical ? 'Yes' : 'No'}
			/>
			<TitleValue title='EPZ' value={lc?.epz ? 'Yes' : 'No'} />
			<TitleValue title='Remarks' value={lc?.remarks} />
			<TitleValue
				title='Created'
				value={<DateTime date={lc?.created_at} isTime={false} />}
			/>
			<TitleValue
				title='Updated'
				value={<DateTime date={lc?.updated_at} isTime={false} />}
			/>
		</div>
	);
}

export default function Information({ lc }) {
	const {
		uuid,
		party_uuid,
		pi_cash_ids,
		party_name,
		total_value,
		file_number,
		lc_number,
		lc_date,
		payment_value,
		payment_date,
		ldbc_fdbc,
		acceptance_date,
		maturity_date,
		commercial_executive,
		party_bank,
		production_complete,
		is_rtgs,
		lc_cancel,
		handover_date,
		shipment_date,
		expiry_date,
		ud_no,
		ud_received,
		at_sight,
		amd_date,
		amd_count,
		problematical,
		epz,
		created_by,
		created_by_name,
		created_at,
		updated_at,
		remarks,
	} = lc;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'PI IDs',
				value: pi_cash_ids && (
					<div className='flex flex-wrap gap-2'>
						{pi_cash_ids?.map((piId) => (
							<LinkWithCopy
								key={piId}
								title={piId}
								id={piId}
								uri='/commercial/pi/details'
							/>
						))}
					</div>
				),
			},
			{
				label: 'Total Value',
				value: Number(total_value).toFixed(2),
			},
			{
				label: 'RTGS',
				value: is_rtgs ? 'Yes' : 'No',
			},
			{
				label: 'LC Cancelled',
				value: lc_cancel ? 'Yes' : 'No',
			},
			{
				label: 'Production Complete',
				value: production_complete ? 'Yes' : 'No',
			},
			{
				label: 'Problematic',
				value: problematical ? 'Yes' : 'No',
			},
			{
				label: 'EPZ',
				value: epz ? 'Yes' : 'No',
			},
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), 'dd/MM/yyyy'),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), 'dd/MM/yyyy'),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];
		const fileDetails = [
			{
				label: 'Party',
				value: party_name,
			},
			{
				label: 'File No.',
				value: file_number,
			},
			{
				label: 'LC No.',
				value: lc_number,
			},
			{
				label: 'LC Date',
				value: lc_date ? format(new Date(lc_date), 'dd/MM/yyyy') : '',
			},
		];

		const commercialDetails = [
			{
				label: 'Executive',
				value: commercial_executive,
			},
			{
				label: 'Party Bank',
				value: party_bank,
			},
			{
				label: 'Shipment Date',
				value: shipment_date
					? format(new Date(shipment_date), 'dd/MM/yyyy')
					: '',
			},
			{
				label: 'Expiry Date',
				value: format(new Date(expiry_date), 'dd/MM/yyyy'),
			},
		];

		const others = [
			{
				label: 'UD No.',
				value: ud_no,
			},
			{
				label: 'UD Received',
				value: ud_received,
			},
			{
				label: 'At Sight',
				value: at_sight,
			},
			{
				label: 'AMD Date',
				value: format(new Date(amd_date), 'dd/MM/yyyy'),
			},
			{
				label: 'AMD Count',
				value: amd_count,
			},
		];

		return {
			basicInfo,
			fileDetails,
			commercialDetails,
			others,
		};
	};

	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0 '}>
			<RenderTable
				className={'border-secondary/30 lg:border-b'}
				title={'Basic Info'}
				items={renderItems().basicInfo}
			/>
			<div className='grid grid-cols-1 lg:grid-cols-3 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'File Details'}
					items={renderItems().fileDetails}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-x'}
					title={'Commercial Details'}
					items={renderItems().commercialDetails}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Others'}
					items={renderItems().others}
				/>
			</div>
			
		</SectionContainer>
	);
}
