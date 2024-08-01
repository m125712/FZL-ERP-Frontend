function V1() {
	return (
		<section className="flex h-full items-center  sm:p-16">
			<div className="container mx-auto my-8 flex flex-col items-center justify-center space-y-8 px-5 text-center sm:max-w-md">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					className="h-40 w-40 text-red-600"
				>
					<path
						fill="currentColor"
						d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
					></path>
					<rect
						width="176"
						height="32"
						x="168"
						y="320"
						fill="currentColor"
					></rect>
					<polygon
						fill="currentColor"
						points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
					></polygon>
					<polygon
						fill="currentColor"
						points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
					></polygon>
				</svg>
				<p className="text-3xl">
					Looks like you have no access to this page
				</p>
				<button
					className="rounded-full bg-green-600 px-6 py-2 uppercase text-white transition-all duration-500 ease-in-out hover:bg-green-700"
					onClick={() => window.history.back()}
				>
					Go Back
				</button>
			</div>
		</section>
	);
}

function V2() {
	return (
		<div
			id="sec-1"
			className="section flex h-screen w-screen items-center justify-center bg-red-500"
		>
			<div
				id="ctn"
				className="w-90 h-90 mt-10 overflow-hidden text-center text-7xl font-bold"
			>
				<div className="marquee w-90 flex gap-4 whitespace-nowrap border-b-2 border-black bg-black">
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
				</div>

				<div className="text-ctn my-4"></div>

				<div
					id="forbidden"
					className="animate-flash inline-block rounded-2xl border-2 border-black px-2 py-1 text-8xl"
				>
					FORBIDDEN
				</div>

				<div className="text-ctn my-4">
					HTTP
					<br />
					403
				</div>

				<div className="marquee w-90 whitespace-nowrap border-b-2 border-black bg-black">
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
					<div className="marquee-text w-65 animate-scroll inline-block text-3xl font-bold text-red-500"></div>
				</div>
			</div>
		</div>
	);
}

function V3() {
	return (
		<>
			<div className="flex h-screen flex-col items-center justify-center gap-12 py-8 ">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					className="h-40 w-40 text-red-600"
				>
					<path
						fill="currentColor"
						d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
					></path>
					<rect
						width="176"
						height="32"
						x="168"
						y="320"
						fill="currentColor"
					></rect>
					<polygon
						fill="currentColor"
						points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
					></polygon>
					<polygon
						fill="currentColor"
						points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
					></polygon>
				</svg>
				<div className="flex flex-col items-center gap-4">
					<h1 className="text-center text-3xl font-medium capitalize">
						You are not authorized
					</h1>
					<p className="text-center text-xl">
						You tried to access a page you did not have prior
						authorization for.
					</p>
					<button
						className="btn btn-primary rounded-full px-6 py-2 uppercase text-white transition-all duration-500 ease-in-out"
						onClick={() => window.history.back()}
					>
						Go Back
					</button>
				</div>
			</div>
		</>
	);
}

export default function NoAccess() {
	return (
		<>
			{/* <V1 /> */}
			{/* <V2 /> */}
			<V3 />
		</>
	);
}
