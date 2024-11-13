import { useEffect, useRef, useState } from 'react';
import { useSymbologyScanner } from '@use-symbology-scanner/react';

export default function Index() {
	const ref = useRef(null);
	const [scannedItems, setScannedItems] = useState([]);
	const [lastScanned, setLastScanned] = useState('');
	const [isScanning, setIsScanning] = useState(false);

	const handleSymbol = (symbol) => {
		setLastScanned(symbol);
		setScannedItems((prev) => [
			...prev,
			{
				symbol,
			},
		]);
	};

	useSymbologyScanner(handleSymbol, {
		target: ref,
		enabled: isScanning,
		eventOptions: { capture: true, passive: false, signal: true },
		scannerOptions: {
			maxDelay: 20,
		},
	});

	const toggleScanner = () => {
		setIsScanning(!isScanning);
	};

	const clearHistory = () => {
		setScannedItems([]);
		setLastScanned('');
	};



	return (
		<div
			ref={ref}
			tabIndex={0}
			className='mx-auto min-h-screen max-w-4xl bg-white p-6'>
			<h2 className='mb-8 text-3xl font-bold text-gray-800'>
				Barcode Scanner
			</h2>
			<input type='text' autoFocus={true} className='sr-only' />
			<div className='mb-8 flex items-center gap-4'>
				<div
					className={`rounded-lg px-4 py-2 font-medium ${
						isScanning
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}>
					Scanner is {isScanning ? 'Active' : 'Inactive'}
				</div>
				<button
					onClick={toggleScanner}
					className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700'>
					{isScanning ? 'Disable Scanner' : 'Enable Scanner'}
				</button>
				<button
					onClick={clearHistory}
					className='rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-gray-700'>
					Clear History
				</button>
			</div>

			<div className='mb-8 rounded-xl bg-gray-50 p-6 shadow-sm'>
				<h3 className='mb-3 text-xl font-semibold text-gray-700'>
					Last Scanned
				</h3>
				<div className='text-2xl font-bold text-gray-900'>
					{lastScanned || 'No items scanned yet'}
				</div>
			</div>

			<div className='rounded-xl bg-white shadow-sm'>
				<h3 className='mb-4 border-b p-6 text-xl font-semibold text-gray-700'>
					Scan History
				</h3>
				{scannedItems.length === 0 ? (
					<p className='p-6 text-gray-500'>No items in history</p>
				) : (
					<ul className='divide-y divide-gray-100'>
						{scannedItems.map((item, index) => (
							<li
								key={index}
								className='flex items-center justify-between p-6 transition-colors duration-200 hover:bg-gray-50'>
								<span className='flex-1 font-medium text-gray-900'>
									{item.symbol}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
