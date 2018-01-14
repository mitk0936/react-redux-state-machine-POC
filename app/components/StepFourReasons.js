import React from 'react';

export const StepFourReasons = ({ selectedValue, onSelected, onTypeReason, renderFooter }) => (
	<div>
		<h3>Choose when to expire</h3>
		<select name="time_to_exp" onChange={(e) => onSelected(e.target.value)} value={selectedValue || undefined}>
			<option>Please, select...</option>
			<option value="reason_1">Reason 1</option>
			<option value="reason_2">Reason 2</option>
			<option value="reason_3">Reason 3</option>
			<option value="reason_4">Reason 4</option>
			<option value="other">Other</option>
		</select>
		<textarea onChange={(e) => onTypeReason(e.target.value)} />
		{renderFooter()}
	</div>
);

export default StepFourReasons;