import { addDays, format } from 'date-fns';

export const fake_order_entry = Array.from({ length: 60 }, (_, i) => ({
	date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
	zipper: Math.floor(Math.random() * 100),
	thread: Math.floor(Math.random() * 100),
}));

export const fake_amount_and_doc = {
	total_doc_rcv_due: 250000,
	number_of_pending_doc_rcv: 15000,
	total_acceptance_due: 40023,
	number_of_pending_acceptance_due: 1989,
	total_maturity_due: 128978,
	number_of_pending_maturity_due: 89793,
	total_payment_due: 7689376,
	number_of_pending_payment_due: 6786784,
	chart_data: [
		{
			name: 'Acceptance Due',
			amount: 76381,
			no_of_doc: 396,
		},
		{
			name: 'Maturity Due',
			amount: 48979090,
			no_of_doc: 476786,
		},
		{
			name: 'Payment Due',
			amount: 786476,
			no_of_doc: 656,
		},
	],
};

export const fake_amount_percentage = [
	{
		name: 'total_acceptance_due',
		amount: 500,
	},
	{
		name: 'total_maturity_due',
		amount: 300,
	},
	{
		name: 'total_payment_due',
		amount: 200,
	},
];

export const fake_no_of_doc = [
	{
		name: 'total_acceptance_due',
		amount: 200,
	},
	{
		name: 'total_maturity_due',
		amount: 100,
	},
	{
		name: 'total_payment_due',
		amount: 60,
	},
];
