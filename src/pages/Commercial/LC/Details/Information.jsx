import { format } from 'date-fns';

import SectionContainer from '@/ui/Others/SectionContainer';
import RenderTable from '@/ui/Others/Table/RenderTable';
import { CustomLink, DateTime, StatusButton, TitleValue } from '@/ui';

import { dateType } from './utils';

const LCInfo = (lc) => {
	return (
		<div className=''>
			<TitleValue title='LC ID' value={lc?.uuid} />
			<TitleValue
				title='PI ID'
				value={lc?.pi_ids.map((piId) => (
					<CustomLink
						label={piId}
						url={`/commercial/pi/${piId}`}
						openInNewTab={true}
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
		pi_ids,
		party_name,
		total_value,
		file_number,
		lc_number,
		lc_date,
		commercial_executive,
		party_bank,
		production_complete,
		is_rtgs,
		lc_cancel,
		shipment_date,
		expiry_date,
		ud_no,
		ud_received,
		at_sight,
		amd_date,
		amd_count,
		problematical,
		epz,
		created_by_name,
		created_at,
		updated_at,
		remarks,
		lc_entry_others,

		export_lc_number,
		export_lc_date,
		// export_lc_expire_date,
		up_date,
		up_number,
	} = lc;

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'PI IDs',
				value: pi_ids && (
					<div className='flex flex-wrap gap-2'>
						{pi_ids?.map((piId) => (
							<CustomLink
								key={piId}
								label={piId}
								url={`/commercial/pi/${piId}`}
								openInNewTab={true}
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
				value: <StatusButton value={is_rtgs} className={'btn-xs'} />,
			},
			{
				label: 'LC Cancelled',
				value: <StatusButton value={lc_cancel} className={'btn-xs'} />,
			},
			{
				label: 'Production Complete',
				value: (
					<StatusButton
						value={production_complete}
						className={'btn-xs'}
					/>
				),
			},
			{
				label: 'Problematic',
				value: (
					<StatusButton value={problematical} className={'btn-xs'} />
				),
			},
			{
				label: 'EPZ',
				value: <StatusButton value={epz} className={'btn-xs'} />,
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
				value: lc_date ? format(new Date(lc_date), dateType) : '',
			},
		];

		const ExportDetails = [
			{
				label: 'Export LC No.',
				value: export_lc_number,
			},
			{
				label: 'Export LC Date',
				value: export_lc_date
					? format(new Date(export_lc_date), dateType)
					: '',
			},
			// {
			// 	label: 'Export Expire LC Date',
			// 	value: export_lc_expire_date
			// 		? format(new Date(export_lc_expire_date), dateType)
			// 		: '',
			// },
			{
				label: 'Up Date',
				value: up_date ? format(new Date(up_date), dateType) : '',
			},
			{
				label: 'Up No.',
				value: up_number,
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
					? format(new Date(shipment_date), dateType)
					: '',
			},
			{
				label: 'Expiry Date',
				value: expiry_date
					? format(new Date(expiry_date), dateType)
					: '---',
			},
		];

		const others = [
			{
				label: 'UD No.',
				value: lc_entry_others.map(({ ud_no }) => ud_no).join(', '),
			},
			{
				label: 'UD Received',
				value: lc_entry_others
					.map(({ ud_received }) =>
						format(new Date(ud_received), dateType)
					)
					.join(', '),
			},
			{
				label: 'UP Number',
				value: lc_entry_others
					.map(({ up_number }) => up_number)
					.join(', '),
			},
			{
				label: 'UP Number Received',
				value: lc_entry_others
					.map(({ up_number_updated_at }) =>
						format(new Date(up_number_updated_at), dateType)
					)
					.join(', '),
			},
			{
				label: 'At Sight',
				value: at_sight,
			},
			{
				label: 'AMD Date',
				value: amd_date ? format(new Date(amd_date), dateType) : '---',
			},
			{
				label: 'AMD Count',
				value: amd_count,
			},
		];

		const createdDetails = [
			{
				label: 'Created By',
				value: created_by_name,
			},
			{
				label: 'Created At',
				value: format(new Date(created_at), dateType),
			},
			{
				label: 'Updated At',
				value: format(new Date(updated_at), dateType),
			},
			{
				label: 'Remarks',
				value: remarks,
			},
		];

		return {
			basicInfo,
			fileDetails,
			commercialDetails,
			others,
			createdDetails,
			ExportDetails,
		};
	};

	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0'}>
			<div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6'>
				<RenderTable
					className={'border-secondary/30 sm:border-r'}
					title={'Basic Info'}
					items={renderItems().basicInfo}
				/>

				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'File Details'}
					items={renderItems().fileDetails}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Export Details'}
					items={renderItems().ExportDetails}
				/>
				<RenderTable
					className={'border-secondary/30 sm:border-r'}
					title={'Commercial Details'}
					items={renderItems().commercialDetails}
				/>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'Others'}
					items={renderItems().others}
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
