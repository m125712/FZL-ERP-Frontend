import { PDF } from '@/assets/icons';
import ChallanPdf from '@/components/Pdf/Challan';
import { NumToWord } from '@/lib/NumToWord';
import { DateTime, TitleValue } from '@/ui';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

const ChallanInfo = (challan) => {
	return (
		<div className=''>
			<TitleValue title='Challan ID' value={challan?.challan_number} />
			<TitleValue title='O/N' value={challan?.order_number} />
			<TitleValue title='carton (PCS)' value={challan?.carton_quantity} />
			<TitleValue
				title='received'
				value={challan?.receive_status ? 'Yes' : 'No'}
			/>
			<TitleValue
				title='created at'
				value={<DateTime date={challan?.created_at} isTime={false} />}
			/>
			<TitleValue
				title='updated at'
				value={<DateTime date={challan?.updated_at} isTime={false} />}
			/>
			<TitleValue title='Remarks' value={challan?.remarks} />
		</div>
	);
};

function OthersInfo(challan) {
	return (
		<div className=''>
			<TitleValue title='Party' value={challan?.party_name} />
			<TitleValue title='Factory' value={challan?.factory_name} />
			<TitleValue title='Address' value={challan?.factory_address} />
			<TitleValue title='Marketing' value={challan?.marketing_name} />
			<TitleValue
				title='Merchandiser'
				value={challan?.merchandiser_name}
			/>
			<TitleValue title='Buyer' value={challan?.buyer_name} />
		</div>
	);
}

export default function Information({ challan }) {
	const { challan_number } = useParams();
	const { total_delivery_quantity, unique_colors } =
		challan?.challan_entry?.reduce(
			(acc, item) => ({
				total_delivery_quantity:
					acc.total_delivery_quantity + item.delivery_quantity,
				unique_colors: acc.unique_colors.includes(
					item.color.toLowerCase()
				)
					? acc.unique_colors
					: [...acc.unique_colors, item.color.toLowerCase()],
			}),
			{ total_delivery_quantity: 0, unique_colors: [] }
		);

	const challan_info = {
		challan_number,
		order_number: challan?.order_number,
		date: format(new Date(challan?.created_at), 'dd/MM/yy'),
		party_name: challan?.party_name,
		factory_name: challan?.factory_name,
		factory_address: challan?.factory_address,
		marketing_name: challan?.marketing_name,
		merchandiser_name: challan?.merchandiser_name,
		buyer_name: challan?.buyer_name,
		total_carton: challan?.carton_quantity,
		total_unique_colors: unique_colors.length,
		total_delivery_quantity,
		total_delivery_quantity_in_word:
			NumToWord(total_delivery_quantity) + ' (PCS) Only',
		carton_quantity: challan?.carton_quantity,
	};

	const challan_data = {
		challan_info: challan_info,
		challan_entry: challan?.challan_entry,
	};

	// const [data, setData] = useState("");
	// useEffect(() => {
	// 	ChallanPdf(challan_data).then((res) => setData(res));
	// }, [challan]);

	return (
		<div className='my-2 flex flex-col rounded-md px-2 shadow-md'>
			<span className='flex items-center gap-2 text-2xl font-semibold capitalize leading-tight text-primary md:text-3xl'>
				Challan Information
				<button
					type='button'
					className='btn btn-primary btn-sm rounded-badge'
					onClick={() =>
						ChallanPdf(challan_data).download(challan_number)
					}>
					<PDF className='w-4' /> PDF
				</button>
			</span>
			<hr className='border-1 my-2 border-secondary-content' />

			{/* <iframe
				id="iframeContainer"
				src={data}
				className="h-[40rem] w-full rounded-md border-none"
			/> */}

			<div className='flex flex-col items-baseline justify-start text-sm md:flex-row'>
				<ChallanInfo {...challan} />
				<hr className='divider divider-primary divider-vertical md:divider-horizontal' />
				<OthersInfo {...challan} />
			</div>
		</div>
	);
}
