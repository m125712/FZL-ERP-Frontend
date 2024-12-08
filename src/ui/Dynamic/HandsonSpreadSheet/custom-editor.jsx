import 'handsontable/dist/handsontable.full.min.css';

import { createRef } from 'react';
import { BaseEditorComponent } from '@handsontable/react';

import { ReactSelect } from '@/ui';

// Custom Editor Component
class CustomEditor extends BaseEditorComponent {
	mainElementRef;
	selectElementRef;
	inputElementRef;
	field;
	constructor(props) {
		super(props);

		this.mainElementRef = createRef();
		this.selectElementRef = createRef();
		this.inputElementRef = createRef();
		this.state = {
			value: '',
		};
		this.field = this.props.field;
	}

	setValue(value, callback) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.setState((_state, _props) => {
			return { value };
		}, callback);
	}

	getValue() {
		return this.state.value;
	}

	open() {
		if (!this.mainElementRef.current) return;
		this.mainElementRef.current.style.display = 'block';
		this.selectElementRef.current?.focus();
		this.inputElementRef.current?.focus();
	}

	close() {
		if (!this.mainElementRef.current) return;
		this.mainElementRef.current.style.display = 'none';
	}

	prepare(row, col, prop, td, originalValue, cellProperties) {
		// We'll need to call the `prepare` method from
		// the `BaseEditorComponent` class, as it provides
		// the component with the information needed to use the editor
		// (hotInstance, row, col, prop, TD, originalValue, cellProperties)
		super.prepare(row, col, prop, td, originalValue, cellProperties);

		const tdPosition = td.getBoundingClientRect();

		// As the `prepare` method is triggered after selecting
		// any cell, we're updating the styles for the editor element,
		// so it shows up in the correct position.
		if (!this.mainElementRef.current) return;
		this.mainElementRef.current.style.left = `${tdPosition.left + window.pageXOffset}px`;
		this.mainElementRef.current.style.top = `${tdPosition.top + window.pageYOffset}px`;

		this.mainElementRef.current.style.width = `${tdPosition.width}px`;
		this.mainElementRef.current.style.height = `${tdPosition.height}px`;
	}

	stopMousedownPropagation(e) {
		e.stopPropagation();
	}

	render() {
		if (this.props.field.type === 'select') {
			return (
				<div
					style={{
						display: 'none',
						position: 'absolute',
						background: '#fff',
						border: `1px solid black`,
						zIndex: 999,
					}}
					ref={this.mainElementRef}
					onMouseDown={this.stopMousedownPropagation}
					id='editorElement'>
					<ReactSelect
						extraControlClassName='!rounded-none'
						openMenuOnFocus
						autoFocus
						ref={this.selectElementRef}
						placeholder={
							this.props.field.placeholder || 'Select an option'
						}
						value={this.props.field.options.find(
							(option) => option.value === this.state.value
						)}
						options={this.props.field.options}
						onChange={(value) => {
							this.setValue(value?.value, () => {
								this.finishEditing();
							});
						}}
					/>
				</div>
			);
		}

		if (
			this.props.field.type === 'text' ||
			this.props.field.type === 'number'
		) {
			const inputType = this.props.field.type;
			return (
				<div
					style={{
						display: 'none',
						position: 'absolute',
						background: '#fff',
						border: '1px solid #000',
						zIndex: 999,
					}}
					ref={this.mainElementRef}
					onMouseDown={this.stopMousedownPropagation}
					id='editorElement'>
					<input
						ref={this.inputElementRef}
						className='h-full w-full rounded-none border-none p-2 focus:border-none'
						placeholder={this.props.field.placeholder}
						value={this.state.value}
						onChange={(e) => {
							const value = e.target.value;

							if (inputType === 'number') {
								this.setValue(Number(value), () => {});
							} else {
								this.setValue(value, () => {});
							}
						}}
					/>
				</div>
			);
		}
	}
}

export default CustomEditor;
