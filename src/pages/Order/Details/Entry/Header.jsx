import { ShowToast } from '@/components/Toast';
import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	ReactSelect,
	SectionEntryBody,
	Textarea,
	Input,
} from '@/ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({
	order,
	register,
	errors,
	control,
	getValues,
	Controller,
	is_logo_body,
	is_logo_puller,
}) {
	const { order_number, order_description_uuid } = useParams();

	const { value: item } = useFetch(`/other/order-properties/by/item`);
	const { value: zipper_number } = useFetch(
		`/other/order-properties/by/zipper_number`
	);
	const { value: end_type } = useFetch(`/other/order-properties/by/end_type`);

	// * garments info*//
	const { value: garments_wash } = useFetch(
		`/other/order-properties/by/garments_wash`
	);
	const { value: light_preference } = useFetch(
		`/other/order-properties/by/light_preference`
	);
	const { value: end_user } = useFetch(`/other/order-properties/by/end_user`);

	//* slider info*//
	const { value: slider_body_shape } = useFetch(
		`/other/order-properties/by/slider_body_shape`
	);
	const { value: slider_link } = useFetch(
		`/other/order-properties/by/slider_link`
	);

	const { value: lock_type } = useFetch(
		`/other/order-properties/by/lock_type`
	);

	//* puller info*//
	const { value: puller_type } = useFetch(
		`/other/order-properties/by/puller_type`
	);
	const { value: puller_link } = useFetch(
		`/other/order-properties/by/puller_link`
	);
	const { value: color } = useFetch(`/other/order-properties/by/color`);
	const { value: hand } = useFetch(`/other/order-properties/by/hand`);
	const { value: special_requirement } = useFetch(
		`/other/order-properties/by/special_requirement`
	);
	const { value: stopper_type } = useFetch(
		`/other/order-properties/by/stopper_type`
	);
	const { value: coloring_type } = useFetch(
		`/other/order-properties/by/coloring_type`
	);
	const { value: slider } = useFetch(`/other/order-properties/by/slider`);
	const { value: top_stopper } = useFetch(
		`/other/order-properties/by/top_stopper`
	);
	const { value: bottom_stopper } = useFetch(
		`/other/order-properties/by/bottom_stopper`
	);
	const { value: logo_type } = useFetch(
		`/other/order-properties/by/logo_type`
	);

	const [isSliderProvided, setIsSliderProvided] = useState(
		typeof getValues('is_slider_provided') !== 'boolean' &&
			getValues('is_slider_provided') === 1
			? true
			: false
	);
	const [isLogoBody, setIsLogoBody] = useState(
		typeof is_logo_body !== 'boolean' && is_logo_body === 1 ? true : false
	);
	const [isLogoPuller, setIsLogoPuller] = useState(
		typeof is_logo_puller !== 'boolean' && is_logo_puller === 1
			? true
			: false
	);

	const sliderSections = [
		{ value: 'die_casting', label: 'Die Casting' },
		{ value: 'slider_assembly', label: 'Assembly' },
		{ value: 'coloring', label: 'Coloring' },
		{ value: '---', label: '---' },
	];

	const [sp_req, setSpReq] = useState({});
	const [endType, setEndType] = useState();

	useEffect(() => {
		if (order_description_uuid !== undefined) {
			setSpReq((prev) => ({
				...prev,
				special_req: getValues('special_requirement_ids')
					? getValues('special_requirement_ids')
					: '',
			}));
		}
		setIsLogoBody(is_logo_body === 1 ? true : false);
		setIsLogoPuller(is_logo_puller === 1 ? true : false);
	}, [getValues('special_requirement_ids'), is_logo_body, is_logo_puller]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Item'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='order_info_uuid'
						title='O/N'
						errors={errors}>
						<Controller
							name={'order_info_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Order'
										options={order}
										value={order?.find(
											(item) =>
												item.value ==
												getValues('order_info_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={order_number !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='item' title='Item' errors={errors}>
						<Controller
							name={'item'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Item'
										options={item}
										value={item?.find(
											(item) =>
												item.value === getValues('item')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='zipper_number'
						title='Zipper'
						errors={errors}>
						<Controller
							name={'zipper_number'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Zipper Number'
										options={zipper_number}
										value={zipper_number?.find(
											(zipper_number) =>
												zipper_number.value ==
												getValues('zipper_number')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='end_type' title='End' errors={errors}>
						<Controller
							name={'end_type'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select End Type'
										options={end_type}
										value={end_type?.find(
											(end_type) =>
												end_type.value ==
												getValues('end_type')
										)}
										onChange={(e) => {
											onChange(e.value);
											setEndType(e.label);
										}}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					{endType == 'Open End' && (
						<FormField label='hand' title='Hand' errors={errors}>
							{' '}
							{/* TODO: This condition needs to be fixed */}
							<Controller
								name={'hand'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Hand'
											options={hand}
											value={hand?.find(
												(hand) =>
													hand.value ==
													getValues('hand')
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
					)}
					<FormField label='lock_type' title='Lock' errors={errors}>
						<Controller
							name={'lock_type'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Lock Type'
										options={lock_type}
										value={lock_type?.find(
											(lock_type) =>
												lock_type.value ==
												getValues('lock_type')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<div className='flex w-full flex-col gap-1 md:flex-row'>
						<FormField
							label='stopper_type'
							title='Stopper'
							errors={errors}>
							<Controller
								name={'stopper_type'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Hand'
											options={stopper_type}
											value={stopper_type?.find(
												(stopper_type) =>
													stopper_type.value ==
													getValues('stopper_type')
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='teeth_color'
							title='Teeth Color'
							errors={errors}>
							<Controller
								name={'teeth_color'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Teeth Color'
											options={color}
											value={color?.find(
												(color) =>
													color.value ==
													getValues('teeth_color')
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
					</div>

					<FormField
						label='special_requirement'
						title='Special Req'
						errors={errors}>
						<Controller
							name={'special_requirement'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Multi Requirement'
										options={special_requirement}
										value={special_requirement?.filter(
											(item) =>
												sp_req?.special_req?.includes(
													item.value
												)
										)}
										onChange={(e) => {
											setSpReq((prev) => ({
												...prev,
												special_req: e.map(
													(item) => item.value
												),
											}));
											onChange(
												JSON.stringify({
													values: e.map(
														(item) => item.value
													),
												})
											);
										}}
										isMulti={true}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Textarea label='description' {...{ register, errors }} />
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>

			<SectionEntryBody
				title='Slider'
				header={
					<div className='flex w-full gap-1 text-sm md:w-fit'>
						<div className='rounded-md bg-secondary/80 px-1'>
							<CheckBox
								label='is_slider_provided'
								title='Provided By Party'
								defaultChecked={isSliderProvided}
								{...{ register, errors }}
								onChange={(e) =>
									setIsSliderProvided(e.target.checked)
								}
							/>
						</div>
					</div>
				}>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='puller_type'
						title='Puller'
						errors={errors}>
						<Controller
							name={'puller_type'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Puller Type'
										options={puller_type}
										value={puller_type?.find(
											(puller_type) =>
												puller_type.value ==
												getValues('puller_type')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='puller_color'
						title='Puller Color'
						errors={errors}>
						<Controller
							name={'puller_color'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Puller Color'
										options={color}
										value={color?.find(
											(color) =>
												color.value ==
												getValues('puller_color')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='coloring_type'
						title='Coloring'
						errors={errors}>
						<Controller
							name={'coloring_type'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Coloring Type'
										options={coloring_type}
										value={coloring_type?.find(
											(coloring_type) =>
												coloring_type.value ==
												getValues('coloring_type')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField label='slider' title='Slider' errors={errors}>
						<Controller
							name={'slider'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slider'
										options={slider}
										value={slider?.find(
											(slider) =>
												slider.value ==
												getValues('slider')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<FormField
						label='puller_link'
						title='Puller Link'
						errors={errors}>
						<Controller
							name={'puller_link'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Puller Link'
										options={puller_link}
										value={puller_link?.find(
											(item) =>
												item.value ==
												getValues('puller_link')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='slider_body_shape'
						title='Slider Body Shape'
						errors={errors}>
						<Controller
							name={'slider_body_shape'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select slider body shape'
										options={slider_body_shape}
										value={slider_body_shape?.find(
											(item) =>
												item.value ==
												getValues('slider_body_shape')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='slider_link'
						title='Slider Link'
						errors={errors}>
						<Controller
							name={'slider_link'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Slider Link'
										options={slider_link}
										value={slider_link?.find(
											(item) =>
												item.value ==
												getValues('slider_link')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<div className='flex basis-3/4 flex-col gap-1 text-secondary-content md:flex-row'>
						<FormField
							label='top_stopper'
							title='Top Stopper'
							errors={errors}>
							<Controller
								name={'top_stopper'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Top Stopper'
											options={top_stopper}
											value={top_stopper?.find(
												(top_stopper) =>
													top_stopper.value ==
													getValues('top_stopper')
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='bottom_stopper'
							title='Bottom Stopper'
							errors={errors}>
							<Controller
								name={'bottom_stopper'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Bottom Stopper'
											options={bottom_stopper}
											value={bottom_stopper?.find(
												(bottom_stopper) =>
													bottom_stopper.value ==
													getValues('bottom_stopper')
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
						<FormField
							label='slider_starting_section'
							title='Starting Section'
							errors={errors}>
							<Controller
								name={'slider_starting_section'}
								control={control}
								render={({ field: { onChange } }) => {
									return (
										<ReactSelect
											placeholder='Select Section'
											options={sliderSections}
											value={sliderSections?.find(
												(sliderSections) =>
													sliderSections.value ==
													getValues(
														'slider_starting_section'
													)
											)}
											onChange={(e) => onChange(e.value)}
											// isDisabled={order_info_id !== undefined}
										/>
									);
								}}
							/>
						</FormField>
					</div>
					<div className='basis-1/4'>
						<div className='flex gap-1'>
							<FormField
								label='logo_type'
								title='Logo'
								errors={errors}>
								<Controller
									name={'logo_type'}
									control={control}
									render={({ field: { onChange } }) => {
										return (
											<ReactSelect
												placeholder='Select Logo Type'
												options={logo_type}
												value={logo_type?.find(
													(logo_type) =>
														logo_type.value ==
														getValues('logo_type')
												)}
												onChange={(e) =>
													onChange(e.value)
												}
												// isDisabled={order_info_id !== undefined}
											/>
										);
									}}
								/>
							</FormField>
							<div className='mt-6 flex items-center gap-1 text-sm'>
								<div className='rounded-md border border-primary px-1'>
									<CheckBox
										label='is_logo_body'
										title='Body'
										height='h-[2.9rem]'
										defaultChecked={isLogoBody}
										{...{ register, errors }}
										onChange={(e) =>
											setIsLogoBody(e.target.checked)
										}
									/>
								</div>
								<div className='rounded-md border border-primary px-1'>
									<CheckBox
										label='is_logo_puller'
										title='Puller'
										height='h-[2.9rem]'
										defaultChecked={isLogoPuller}
										{...{ register, errors }}
										onChange={(e) =>
											setIsLogoPuller(e.target.checked)
										}
									/>
								</div>
							</div>
						</div>
					</div>

					{/* <CheckBox
						label="is_logo_body"
						title="Logo Body"
						defaultChecked={isLogoBody}
						{...{ register, errors }}
						onChange={(e) => setIsLogoBody(e.target.checked)}
					/>
					<CheckBox
						label="is_logo_puller"
						title="Logo Puller"
						defaultChecked={isLogoPuller}
						{...{ register, errors }}
						onChange={(e) => setIsLogoPuller(e.target.checked)}
					/> */}
				</div>
			</SectionEntryBody>

			<SectionEntryBody title='Garments'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Input label={`garment`} {...{ register, errors }} />

					<FormField
						label='garments_wash'
						title='Garments Wash'
						errors={errors}>
						<Controller
							name={'garments_wash'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select garments wash'
										options={garments_wash}
										value={garments_wash?.find(
											(item) =>
												item.value ==
												getValues('garments_wash')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>

					<FormField
						label='light_preference'
						title='Light Preference'
						errors={errors}>
						<Controller
							name={'light_preference'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select light preference'
										options={light_preference}
										value={light_preference?.find(
											(item) =>
												item.value ==
												getValues('light_preference')
										)}
										onChange={(e) => onChange(e.value)}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='end_user'
						title='End User'
						errors={errors}>
						<Controller
							name={'end_user'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select End User'
										options={end_user}
										value={end_user?.find(
											(item) =>
												item.value ==
												getValues('end_user')
										)}
										onChange={(e) => onChange(e.value)}
										// isDisabled={order_info_id !== undefined}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<Textarea label='garments_remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
