import React from 'react';
import { Banknote, CircleDollarSign } from 'lucide-react';
import { NumericFormat } from 'react-number-format';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const DashboardCard = (
	{ title, subtitle, totalValue, pendingValue } = {
		title: '',
		subtitle: '',
		totalValue,
		pendingValue,
	}
) => {
	return (
		<Card className='flex flex-col justify-between overflow-hidden'>
			<CardHeader className='px-3 py-2'>
				<CardDescription>{title}</CardDescription>
				<CardTitle className='text-3xl font-medium'>
					<NumericFormat
						displayType={'text'}
						prefix='US $'
						value={totalValue}
						thousandSeparator
						thousandsGroupStyle={'thousand'}
						decimalScale={2}
					/>
				</CardTitle>
			</CardHeader>

			{/* <CardContent className='px-3'>
				<Banknote className='size-14 text-accent' />
			</CardContent> */}

			<CardFooter className='flex items-center bg-neutral-100 px-3 py-2'>
				<CardDescription>
					{subtitle} :{' '}
					<NumericFormat
						displayType={'text'}
						prefix='$'
						value={pendingValue}
						thousandSeparator
						thousandsGroupStyle={'thousand'}
						decimalScale={2}
					/>
				</CardDescription>
			</CardFooter>
		</Card>
	);
};

export default DashboardCard;
