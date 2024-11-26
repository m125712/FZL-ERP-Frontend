import { useOtherPiValues } from '@/state/Other';
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

export default function Information({ data }) {
	const {
		pi_uuids,
		marketing_name,
		party_name,
		buyer_name,
		merchandiser_name,
		factory_name,
		bank_name,
		validity,
		payment,
		receive_amount,
		weight,
		date,
		pi_number,
		created_by_name,
		created_at,
		updated_at,
		remarks,
	} = data;

	const { data: pi } = useOtherPiValues();

	console.log(pi?.filter((pi) => pi_uuids?.includes(pi?.value)));

	const renderItems = () => {
		const basicInfo = [
			{
				label: 'PI',
				value: pi_number,
			},
			{
				label: 'PI IDs',
				value: pi_uuids && (
					<div className='flex flex-wrap gap-2'>
						{pi
							?.filter((pi) => pi_uuids?.includes(pi?.value))
							?.map((piId) => (
								<LinkWithCopy
									key={piId.value}
									title={piId.label}
									id={piId.value}
									uri='/commercial/pi/details'
								/>
							))}
					</div>
				),
			},

			{
				label: 'Validity',
				value: validity,
			},
			{
				label: 'Payment',
				value: payment,
			},
			{
				label: 'Receive Amount',
				value: receive_amount,
			},
			{
				label: 'Weight',
				value: weight,
			},
			{
				label: 'Date',
				value: format(new Date(date), 'dd/MM/yyyy'),
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

		const buyer_info = [
			{
				label: 'Marketing',
				value: marketing_name,
			},
			{
				label: 'Party',
				value: party_name,
			},
			{
				label: 'Buyer',
				value: buyer_name,
			},
			{
				label: 'Merchandiser',
				value: merchandiser_name,
			},
			{
				label: 'Factory',
				value: factory_name,
			},
			{
				label: 'Bank',
				value: bank_name,
			},
		];

		return {
			basicInfo,
			buyer_info,
		};
	};

	return (
		<SectionContainer title={'Information'} contentClassName={'space-y-0 '}>
			<div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
				<RenderTable
					className={'border-secondary/30 lg:border-r'}
					title={'PI Details'}
					items={renderItems().basicInfo}
				/>

				<RenderTable
					className={'border-secondary/30 lg:border-l'}
					title={'Buyer Details'}
					items={renderItems().buyer_info}
				/>
			</div>
		</SectionContainer>
	);
}
