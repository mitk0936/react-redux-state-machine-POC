import React from 'react';

export const StepOneTime = ({ selectedValue, onSelected, renderFooter }) => (
	<div>
		<h3>Choose when to expire</h3>
		<select name="time_to_exp" onChange={(e) => onSelected(e.target.value)} value={selectedValue || undefined}>
			<option>Please, select...</option>
			<option value="now">Now</option>
			<option value="at_exp">At expiration</option>
		</select>
		{renderFooter()}
	</div>
);

export default StepOneTime;