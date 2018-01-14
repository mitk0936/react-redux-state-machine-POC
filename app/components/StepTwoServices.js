import React from 'react';

export const StepTwoServices = ({ services, selectedServices, renderFooter, onToggleService }) => (
	<div>
		<h3>Select services to cancel</h3>
		{
			services.map((service) => [(
				<input key={`${service}-checkbox`}
					value={Boolean(selectedServices[service])}
					type="checkbox" 
					id={service}
					onChange={(ev) => onToggleService(ev.target.checked, service)} />
			), (
				<label key={`${service}-label`} htmlFor={service}>{service}</label>
			)])
		}
		{renderFooter()}
	</div>
);

export default StepTwoServices;