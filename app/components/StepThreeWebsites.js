import React from 'react';

export const StepThreeWebsites = ({ websites, selectedWebsites, renderFooter, onToggleWebsite }) => (
	<div>
		<h3>Select websites to cancel</h3>
		{
			websites.map((website) => [(
				<input key={`${website}-checkbox`}
					value={Boolean(selectedWebsites[website])}
					type="checkbox" 
					id={website}
					onChange={(ev) => onToggleWebsite(ev.target.checked, website)} />
			), (
				<label key={`${website}-label`} htmlFor={website}>{website}</label>
			)])
		}
		{renderFooter()}
	</div>
);

export default StepThreeWebsites;