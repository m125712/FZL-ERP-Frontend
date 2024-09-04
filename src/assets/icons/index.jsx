const Copy = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.9}
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'
			/>
		</svg>
	);
};

const Plus = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-plus'
			{...props}>
			<path d='M5 12h14' />
			<path d='M12 5v14' />
		</svg>
	);
};
const Send = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='52'
			height='52'
			viewBox='0 0 24 24'
			strokeWidth='1.5'
			stroke='#fd0061'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M10 14l11 -11' />
			<path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5' />
		</svg>
	);
};

const Receive = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='52'
			height='52'
			viewBox='0 0 24 24'
			strokeWidth='1.5'
			stroke='#fd0061'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M10 14l11 -11' />
			<path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5' />
		</svg>
	);
};

const Edit = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4' />
			<path d='M13.5 6.5l4 4' />
		</svg>
	);
};

const Trash = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M4 7l16 0' />
			<path d='M10 11l0 6' />
			<path d='M14 11l0 6' />
			<path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
			<path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
		</svg>
	);
};

const Add = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M12 5l0 14' />
			<path d='M5 12l14 0' />
		</svg>
	);
};
const ListPlus = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-list-plus'
			{...props}>
			<path d='M11 12H3' />
			<path d='M16 6H3' />
			<path d='M16 18H3' />
			<path d='M18 9v6' />
			<path d='M21 12h-6' />
		</svg>
	);
};

const Close = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-6 w-6'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M6 18L18 6M6 6l12 12'
			/>
		</svg>
	);
};

const DropDown = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M7 7l5 5l5 -5' />
			<path d='M7 13l5 5l5 -5' />
		</svg>
	);
};

const Menu = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-5 w-5'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M4 6h16M4 12h8m-8 6h16'
			/>
		</svg>
	);
};

const Bell = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='h-5 w-5'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
			/>
		</svg>
	);
};

const Search = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className='absolute bottom-0 left-3 top-0 my-auto h-6 w-6 text-gray-400'
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
			/>
		</svg>
	);
};

const Up = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.9}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M12 5l0 14' />
			<path d='M16 9l-4 -4' />
			<path d='M8 9l4 -4' />
		</svg>
	);
};

const Down = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.9}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M12 5l0 14' />
			<path d='M16 15l-4 4' />
			<path d='M8 15l4 4' />
		</svg>
	);
};

const Check = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M5 12l5 5l10 -10' />
		</svg>
	);
};

const ArrowBack = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M9 14l-4 -4l4 -4' />
			<path d='M5 10h11a4 4 0 1 1 0 8h-1' />
		</svg>
	);
};

const Kitchen = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M4 3h8l-1 9h-6z' />
			<path d='M7 18h2v3h-2z' />
			<path d='M20 3v12h-5c-.023 -3.681 .184 -7.406 5 -12z' />
			<path d='M20 15v6h-1v-3' />
			<path d='M8 12l0 6' />
		</svg>
	);
};

const Background = ({ ...props }) => {
	return (
		<svg
			width='53'
			height='47'
			viewBox='0 0 53 47'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<rect width='53' height='47' fill='none' />
			<path
				d='M10.0064 29.3777L18.3714 20.9999'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M3.59081 14.6364C4.94704 13.2801 7.03442 13.1019 8.58369 14.0997C9.11189 13.1795 9.98398 12.5069 11.0081 12.2297C12.0322 11.9526 13.1245 12.0936 14.0447 12.6218C14.9648 13.15 15.6375 14.0221 15.9146 15.0462C16.1918 16.0704 16.0507 17.1627 15.5225 18.0828L20.5614 23.1216L12.0761 31.6069L7.03725 26.5681C6.58155 26.8295 6.07881 26.9986 5.55775 27.0658C5.03668 27.133 4.50749 27.0968 4.00039 26.9595C3.49329 26.8221 3.01822 26.5862 2.60228 26.2652C2.18635 25.9443 1.83771 25.5445 1.57627 25.0888C1.31482 24.6331 1.1457 24.1304 1.07855 23.6093C1.01139 23.0882 1.04753 22.5591 1.18489 22.052C1.32226 21.5449 1.55815 21.0698 1.87912 20.6538C2.20008 20.2379 2.59983 19.8893 3.05553 19.6278C2.56155 18.8597 2.34528 17.9457 2.44265 17.0377C2.54003 16.1296 2.94519 15.2823 3.59081 14.6364Z'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M17.7071 12.0209L29.0208 0.707212C29.2084 0.519676 29.4627 0.414319 29.7279 0.414319C29.9931 0.414319 30.2475 0.519676 30.435 0.707212L30.7886 1.06077C31.8492 2.12143 32.9495 6.78126 32.5563 8.48539L33.2635 9.19249C33.451 9.38003 33.5563 9.63438 33.5563 9.8996C33.5563 10.1648 33.451 10.4192 33.2635 10.6067L27.6066 16.2636C27.4191 16.4511 27.1647 16.5565 26.8995 16.5565C26.6343 16.5565 26.3799 16.4511 26.1924 16.2636L25.4853 15.5565C23.5471 16.0041 19.1213 14.8493 18.0607 13.7887L17.7071 13.4351C17.5196 13.2476 17.4142 12.9932 17.4142 12.728C17.4142 12.4628 17.5196 12.2085 17.7071 12.0209Z'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M48.3848 20.4852L39.8995 11.9999C39.7425 18.6538 42.2301 21.4341 44.8492 24.0207L48.3848 20.4852ZM48.3848 20.4852L52.6274 24.7278L51.9203 25.4349L49.799 23.3136M32.8284 20.4852L44.8492 32.506M30.7071 22.6065L32.8284 24.7278C33.391 25.2905 34.1541 25.6065 34.9497 25.6065C35.7454 25.6065 36.5085 25.2905 37.0711 24.7278C37.6337 24.1652 37.9497 23.4022 37.9497 22.6065C37.9497 21.8109 37.6337 21.0478 37.0711 20.4852L34.9497 18.3639'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M25.1213 39.364C25.6839 39.9266 26.447 40.2427 27.2426 40.2427C28.0383 40.2427 28.8014 39.9266 29.364 39.364C29.9266 38.8014 30.2426 38.0383 30.2426 37.2427C30.2426 36.447 29.9266 35.684 29.364 35.1214C28.8014 34.5587 28.0383 34.2427 27.2426 34.2427C26.447 34.2427 25.6839 34.5587 25.1213 35.1214C24.5587 35.684 24.2426 36.447 24.2426 37.2427C24.2426 38.0383 24.5587 38.8014 25.1213 39.364Z'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M22.7624 28.9528C23.2945 28.4203 23.94 28.0149 24.6507 27.7668C25.3614 27.5187 26.119 27.4342 26.8669 27.5197C27.6148 27.6052 28.3337 27.8585 28.9701 28.2607C29.6064 28.6628 30.1437 29.2035 30.5419 29.8423C31.0954 29.5467 31.7275 29.432 32.3495 29.5144C32.9715 29.5968 33.552 29.8722 34.0093 30.3017C34.4666 30.7313 34.7778 31.2934 34.899 31.909C35.0202 32.5246 34.9453 33.1627 34.6849 33.7335C35.119 33.7191 35.5511 33.7991 35.9513 33.968C36.3514 34.1369 36.7101 34.3908 37.0026 34.7119C37.2951 35.033 37.5143 35.4139 37.6452 35.828C37.776 36.2422 37.8154 36.6799 37.7605 37.1108C37.7057 37.5416 37.5579 37.9555 37.3274 38.3237C37.097 38.6918 36.7893 39.0056 36.4257 39.2432C36.0621 39.4808 35.6512 39.6366 35.2215 39.6999C34.7918 39.7631 34.3534 39.7323 33.9368 39.6096C34.1068 40.2439 34.1502 40.9055 34.0646 41.5566C33.9789 42.2077 33.7658 42.8355 33.4375 43.4043C33.1092 43.9731 32.6721 44.4716 32.1511 44.8714C31.6302 45.2712 31.0355 45.5645 30.4012 45.7345C29.7669 45.9046 29.1053 45.948 28.4542 45.8623C27.8031 45.7767 27.1753 45.5636 26.6065 45.2353C26.0378 44.907 25.5392 44.4699 25.1394 43.9489C24.7396 43.4279 24.4463 42.8333 24.2763 42.199C23.0103 42.5939 21.6393 42.4697 20.465 41.8537C19.2906 41.2377 18.409 40.1805 18.0141 38.9145C17.6193 37.6485 17.7435 36.2776 18.3595 35.1032C18.9754 33.9288 20.0327 33.0472 21.2986 32.6524C21.2746 31.968 21.3919 31.286 21.6433 30.6489C21.8946 30.0119 22.2746 29.4335 22.7595 28.95L22.7624 28.9528Z'
				stroke='black'
				strokeWidth={0.5}
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		</svg>
	);
};

const Update = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M9 4.55a8 8 0 0 1 6 14.9m0 -4.45v5h5' />
			<path d='M5.63 7.16l0 .01' />
			<path d='M4.06 11l0 .01' />
			<path d='M4.63 15.1l0 .01' />
			<path d='M7.16 18.37l0 .01' />
			<path d='M11 19.94l0 .01' />
		</svg>
	);
};

const TransferIn = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M4 18v3h16v-14l-8 -4l-8 4v3' />
			<path d='M4 14h9' />
			<path d='M10 11l3 3l-3 3' />
		</svg>
	);
};

const Chef = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z' />
			<path d='M6.161 17.009l11.839 -.009' />
		</svg>
	);
};

const ShoppingCart = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
			<path d='M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
			<path d='M17 17h-11v-14h-2' />
			<path d='M6 5l6 .429m7.138 6.573l-.143 1h-13' />
			<path d='M15 6h6m-3 -3v6' />
		</svg>
	);
};

const UserShield = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M6 21v-2a4 4 0 0 1 4 -4h2' />
			<path d='M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z' />
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
		</svg>
	);
};

const Branch = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M19.258 10.258l-7.258 -7.258l-9 9h2v7a2 2 0 0 0 2 2h4' />
			<path d='M9 21v-6a2 2 0 0 1 2 -2h1.5' />
			<path d='M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z' />
		</svg>
	);
};

const TrashCross = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path
				d='M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z'
				strokeWidth={0}
				fill='currentColor'
			/>
			<path
				d='M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z'
				strokeWidth={0}
				fill='currentColor'
			/>
		</svg>
	);
};

const ArrowUpDown = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.9}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M7 3l0 18' />
			<path d='M10 6l-3 -3l-3 3' />
			<path d='M20 18l-3 3l-3 -3' />
			<path d='M17 21l0 -18' />
		</svg>
	);
};
const Reload = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			stroke='currentColor'
			className='size-6'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
			/>
		</svg>
	);
};

const Viewer = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0' />
			<path d='M6 21v-2a4 4 0 0 1 4 -4h1.5' />
			<path d='M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' />
			<path d='M20.2 20.2l1.8 1.8' />
		</svg>
	);
};

const Download = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-download'
			{...props}>
			<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
			<polyline points='7 10 12 15 17 10' />
			<line x1='12' x2='12' y1='15' y2='3' />
		</svg>
	);
};

const Filter = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path
				d='M6 3a1 1 0 0 1 .993 .883l.007 .117v3.171a3.001 3.001 0 0 1 0 5.658v7.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-7.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-3.17a1 1 0 0 1 1 -1z'
				strokeWidth={0}
				fill='currentColor'
			/>
			<path
				d='M12 3a1 1 0 0 1 .993 .883l.007 .117v9.171a3.001 3.001 0 0 1 0 5.658v1.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-1.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-9.17a1 1 0 0 1 1 -1z'
				strokeWidth={0}
				fill='currentColor'
			/>
			<path
				d='M18 3a1 1 0 0 1 .993 .883l.007 .117v.171a3.001 3.001 0 0 1 0 5.658v10.171a1 1 0 0 1 -1.993 .117l-.007 -.117v-10.17a3.002 3.002 0 0 1 -1.995 -2.654l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-.17a1 1 0 0 1 1 -1z'
				strokeWidth={0}
				fill='currentColor'
			/>
		</svg>
	);
};

const PDF = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M14 3v4a1 1 0 0 0 1 1h4'></path>
			<path d='M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4'></path>
			<path d='M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6'></path>
			<path d='M17 18h2'></path>
			<path d='M20 15h-3v6'></path>
			<path d='M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z'></path>
		</svg>
	);
};

const From = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0'></path>
			<path d='M12.02 21.485a1.996 1.996 0 0 1 -1.433 -.585l-4.244 -4.243a8 8 0 1 1 13.403 -3.651'></path>
			<path d='M16 22l5 -5'></path>
			<path d='M21 21.5v-4.5h-4.5'></path>
		</svg>
	);
};

const LeftArrow = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 20 20'
			fill='currentColor'
			aria-hidden='true'
			className='w-5'>
			<path
				fillRule='evenodd'
				d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
				clipRule='evenodd'
			/>
		</svg>
	);
};

const RightArrow = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 20 20'
			fill='currentColor'
			aria-hidden='true'
			className='w-5'>
			<path
				fillRule='evenodd'
				d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
				clipRule='evenodd'
			/>
		</svg>
	);
};
const To = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path
				d='M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z'
				strokeWidth={0}
				fill='currentColor'></path>
		</svg>
	);
};

const Voucher = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z' />
			<path d='M7 16l3 -3l3 3' />
			<path d='M8 13c-.789 0 -2 -.672 -2 -1.5s.711 -1.5 1.5 -1.5c1.128 -.02 2.077 1.17 2.5 3c.423 -1.83 1.372 -3.02 2.5 -3c.789 0 1.5 .672 1.5 1.5s-1.211 1.5 -2 1.5h-4z' />
		</svg>
	);
};

const MenuDown = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 20 20'
			fill='currentColor'
			{...props}>
			<path
				fillRule='evenodd'
				d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
				clipRule='evenodd'
			/>
		</svg>
	);
};

const LogoutIcon = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
			/>
		</svg>
	);
};

const MenuOpenClose = ({ id1, id2, className }) => {
	return (
		<>
			<svg
				id={id1}
				className={className}
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M4 6h16M4 12h16M4 18h16'
				/>
			</svg>
			<svg
				id={id2}
				className={className}
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				stroke='currentColor'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M6 18L18 6M6 6l12 12'
				/>
			</svg>
		</>
	);
};

const Eye = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0'></path>
			<path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6'></path>
		</svg>
	);
};

const Excel = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<ellipse cx='12' cy='5' rx='9' ry='3' />
			<path d='M3 5V19A9 3 0 0 0 21 19V5' />
			<path d='M3 12A9 3 0 0 0 21 12' />
		</svg>
	);
};

const Store = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M3 21l18 0'></path>
			<path d='M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4'></path>
			<path d='M5 21l0 -10.15'></path>
			<path d='M19 21l0 -10.15'></path>
			<path d='M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4'></path>
		</svg>
	);
};

const Column = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={2}
			stroke='currentColor'
			className='size-6'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z'
			/>
		</svg>
	);
};

const PPCUser = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0'></path>
			<path d='M6 21v-2a4 4 0 0 1 4 -4h2.5'></path>
			<path d='M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0'></path>
			<path d='M19.001 15.5v1.5'></path>
			<path d='M19.001 21v1.5'></path>
			<path d='M22.032 17.25l-1.299 .75'></path>
			<path d='M17.27 20l-1.3 .75'></path>
			<path d='M15.97 17.25l1.3 .75'></path>
			<path d='M20.733 20l1.3 .75'></path>
		</svg>
	);
};

const ProcurementUser = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0'></path>
			<path d='M6 21v-2a4 4 0 0 1 4 -4h3'></path>
			<path d='M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5'></path>
			<path d='M19 21v1m0 -8v1'></path>
		</svg>
	);
};

const ManagerUser = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z'></path>
			<path d='M6.201 18.744a4 4 0 0 1 3.799 -2.744h4a4 4 0 0 1 3.798 2.741'></path>
			<path d='M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z'></path>
		</svg>
	);
};

const SparePartsUser = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
			<path d='M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0'></path>
			<path d='M6 21v-2a4 4 0 0 1 4 -4h3'></path>
			<path d='M18 21v-2a4 4 0 0 0 -4 -4h-3'></path>
			<path d='M15 12h-3l-2 -2l-2 2h-3'></path>
		</svg>
	);
};

const MarketingUser = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			strokeWidth={1.25}
			stroke='currentColor'
			fill='none'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path
				d='M20.332,30.601c-0.384,0-0.769-0.146-1.061-0.438L5.643,16.533c-0.482-0.482-0.842-1.395-0.819-2.076    l0.285-8.255c0.027-0.808,0.708-1.488,1.517-1.516l1.773-0.053C8.663,4.633,8.906,4.84,8.916,5.116    c0.009,0.276-0.207,0.508-0.482,0.518L6.659,5.687c-0.284,0.01-0.541,0.267-0.551,0.55l-0.285,8.255    C5.81,14.9,6.061,15.537,6.35,15.826l13.629,13.629c0.195,0.195,0.512,0.195,0.707,0l9.192-9.193    c0.094-0.094,0.146-0.219,0.146-0.354s-0.052-0.26-0.146-0.354L16.25,5.928c-0.289-0.289-0.907-0.571-1.336-0.526l-3.938,0.136    c-0.292-0.017-0.508-0.207-0.518-0.482c-0.009-0.276,0.207-0.508,0.482-0.518l3.939-0.136c0.695,0.002,1.595,0.337,2.077,0.819    l13.628,13.627c0.282,0.282,0.438,0.659,0.438,1.061s-0.156,0.778-0.438,1.061l-9.192,9.193    C21.101,30.454,20.716,30.601,20.332,30.601z'
				fill='#263238'
			/>

			<path
				d='M11,13.477c-1.654,0-3-1.346-3-3C8,9.412,8.554,8.449,9.48,7.9c0.236-0.14,0.544-0.062,0.686,0.176    c0.141,0.238,0.062,0.545-0.176,0.686C9.37,9.128,9,9.77,9,10.477c0,1.103,0.897,2,2,2s2-0.897,2-2    c0-0.921-0.63-1.716-1.532-1.933c-0.269-0.064-0.434-0.335-0.369-0.604c0.064-0.267,0.326-0.431,0.604-0.369    C13.055,7.896,14,9.091,14,10.477C14,12.131,12.654,13.477,11,13.477z'
				fill='#263238'
			/>

			<path
				d='M15.771,17.064c-0.276,0.282-0.587,0.45-0.936,0.498c-0.232,0.037-0.466-0.006-0.7-0.131    c-0.126-0.066-0.253-0.164-0.381-0.29c-0.236-0.239-0.375-0.494-0.413-0.766c-0.035-0.227-0.006-0.461,0.083-0.701    c0.09-0.241,0.234-0.476,0.436-0.701l0.239,0.208c0.208,0.18,0.256,0.516,0.106,0.747c0,0-0.045,0.069-0.051,0.272    c-0.007,0.154,0.038,0.274,0.137,0.363c0.137,0.129,0.308,0.168,0.513,0.12c0.102-0.021,0.212-0.089,0.325-0.205    c0.167-0.166,0.258-0.406,0.271-0.722c-0.006-0.232-0.016-0.583-0.027-1.048c-0.007-0.395,0.024-0.712,0.096-0.948    c0.084-0.261,0.226-0.496,0.429-0.699c0.365-0.362,0.765-0.519,1.198-0.46c0.265,0.037,0.51,0.17,0.733,0.394    c0.216,0.216,0.352,0.448,0.41,0.697c0.044,0.195,0.036,0.396-0.024,0.604c-0.061,0.208-0.172,0.407-0.332,0.598l-0.273-0.189    c-0.227-0.157-0.309-0.445-0.183-0.641c0,0,0,0,0.015-0.17c0.011-0.122-0.036-0.234-0.142-0.338    c-0.11-0.112-0.244-0.147-0.397-0.105c-0.127,0.03-0.249,0.105-0.365,0.224c-0.185,0.183-0.293,0.448-0.324,0.797    c-0.013,0.133-0.009,0.307,0.013,0.524c0.022,0.258,0.033,0.434,0.032,0.525c-0.001,0.299-0.032,0.562-0.097,0.788    c-0.029,0.105-0.062,0.199-0.095,0.28C15.979,16.791,15.882,16.948,15.771,17.064z'
				fill='#263238'
			/>

			<path
				d='M17.306,18.753c-0.174-0.174-0.498-0.184-0.721-0.022l-0.259,0.188c-0.223,0.161-0.547,0.151-0.721-0.021    c-0.173-0.173-0.131-0.444,0.094-0.604l3.876-2.751c0.225-0.159,0.567-0.13,0.762,0.064l0.125,0.124    c0.194,0.194,0.223,0.537,0.063,0.761l-2.758,3.868c-0.159,0.224-0.434,0.265-0.608,0.09s-0.186-0.499-0.022-0.721l0.188-0.258    C17.488,19.25,17.479,18.927,17.306,18.753z M19.177,16.984c0.166-0.22,0.121-0.264-0.099-0.099l-1.006,0.756    c-0.22,0.165-0.299,0.401-0.176,0.524c0.124,0.124,0.359,0.045,0.525-0.175L19.177,16.984z'
				fill='#263238'
			/>

			<path
				d='M20.107,22.797c-0.166,0.165-0.461,0.142-0.655-0.053l-0.94-0.942c-0.194-0.194-0.194-0.513,0-0.707    l3.303-3.304c0.194-0.194,0.49-0.217,0.656-0.051c0.166,0.167,0.144,0.463-0.051,0.657l-2.702,2.701    c-0.194,0.194-0.194,0.513,0,0.707l0.337,0.337C20.249,22.337,20.272,22.632,20.107,22.797z'
				fill='#263238'
			/>

			<path
				d='M20.747,24.038c-0.194-0.194-0.194-0.513,0-0.707l3.306-3.308c0.194-0.194,0.513-0.194,0.707,0    l1.016,1.015c0.194,0.194,0.217,0.49,0.049,0.657c-0.167,0.168-0.463,0.146-0.657-0.049l-0.41-0.409    c-0.194-0.194-0.513-0.194-0.707,0l-0.387,0.386c-0.194,0.194-0.194,0.513-0.001,0.708l0.11,0.109    c0.193,0.195,0.216,0.491,0.048,0.658c-0.167,0.167-0.463,0.145-0.657-0.05l-0.109-0.108c-0.194-0.194-0.513-0.194-0.707,0    l-0.387,0.387c-0.194,0.194-0.194,0.513,0,0.707l0.41,0.411c0.194,0.194,0.217,0.49,0.049,0.657s-0.464,0.145-0.658-0.05    L20.747,24.038z'
				fill='#263238'
			/>

			<path
				d='M8.84,11.699c-0.215,0-0.413-0.139-0.479-0.354c-0.08-0.264,0.068-0.543,0.333-0.624   c0.501-0.152,0.937-0.411,1.294-0.768c1.502-1.503,1.149-4.299-0.786-6.234C8.251,2.767,7.066,2.167,5.867,2.032   C4.712,1.9,3.682,2.221,2.969,2.934C1.468,4.436,1.82,7.232,3.755,9.167c0.064,0.064,0.13,0.128,0.196,0.189   c0.204,0.187,0.217,0.503,0.03,0.706c-0.188,0.205-0.503,0.217-0.706,0.03c-0.078-0.071-0.153-0.145-0.228-0.219   C0.724,7.55,0.37,4.119,2.262,2.227C3.192,1.294,4.51,0.871,5.979,1.038C7.403,1.199,8.799,1.9,9.909,3.012   c2.325,2.325,2.678,5.756,0.786,7.648c-0.476,0.475-1.051,0.816-1.71,1.018C8.937,11.692,8.888,11.699,8.84,11.699z'
				fill='#263238'
			/>
		</svg>
	);
};

const FilterIcon = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth='1.5'
			stroke='currentColor'
			className='size-6'
			{...props}>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75'
			/>
		</svg>
	);
};

const IconKey = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z' />
			<path d='M15 9h.01' />
		</svg>
	);
};
const IconKeyOff = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={24}
			height={24}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}>
			<path stroke='none' d='M0 0h24v24H0z' fill='none' />
			<path d='M10.17 6.159l2.316 -2.316a2.877 2.877 0 0 1 4.069 0l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.33 2.33' />
			<path d='M14.931 14.948a2.863 2.863 0 0 1 -1.486 -.79l-.301 -.302l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.863 2.863 0 0 1 -.794 -1.504' />
			<path d='M15 9h.01' />
			<path d='M3 3l18 18' />
		</svg>
	);
};

const CalenderIcon = ({ ...props }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-calendar'
			{...props}>
			<path d='M8 2v4' />
			<path d='M16 2v4' />
			<rect width='18' height='18' x='3' y='4' rx='2' />
			<path d='M3 10h18' />
		</svg>
	);
};

export {
	Add,
	ArrowBack,
	ArrowUpDown,
	Background,
	Bell,
	Branch,
	CalenderIcon,
	Check,
	Chef,
	Close,
	Copy,
	Down,
	Download,
	DropDown,
	Edit,
	Excel,
	Eye,
	Filter,
	FilterIcon,
	From,
	IconKey,
	IconKeyOff,
	Kitchen,
	LeftArrow,
	LogoutIcon,
	ManagerUser,
	MarketingUser,
	Menu,
	MenuDown,
	MenuOpenClose,
	PDF,
	PPCUser,
	ProcurementUser,
	Receive,
	RightArrow,
	Search,
	Send,
	ShoppingCart,
	SparePartsUser,
	Store,
	To,
	TransferIn,
	Trash,
	TrashCross,
	Up,
	Update,
	UserShield,
	Viewer,
	Voucher,
	Column,
	Plus,
	Reload,
	ListPlus,
};
