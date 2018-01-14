import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStateMachine } from '../withStateMachine';
import CancellationStates from './CancellationStates';

import * as ACTION_CREATORS from '../../actions';
import StepOneTime from '../../components/StepOneTime';
import StepTwoServices from '../../components/StepTwoServices';
import StepThreeWebsites from '../../components/StepThreeWebsites';
import StepFourReasons from '../../components/StepFourReasons';

import styles from '../../resources/css/App.css';

const loadingStates = ['initial', 'cancellation_requested'];
const step1States = [
	'choose_cancellation_time_step',
	'step_1_selected_immediately',
	'step_1_selected_at_exp'
];
const step2States = ['step_2_has_services', 'step_2_has_service_selected']
const step3States = ['step_3_has_websites', 'step_3_has_website_selected'];
const step4States = ['choose_reason_step', 'step_4_valid_input'];

class Cancellation extends React.Component {
	constructor(props) {
		super(props)
		this.renderCurrentState = this.renderCurrentState.bind(this);
		this.renderFooter = this.renderFooter.bind(this);
	}

	renderFooter({ onContinue, isContinueEnabled }) {
		return (
			<div>
				<button onClick={this.props.handleQuit}>Quit</button>
				<button onClick={onContinue} disabled={!isContinueEnabled}>
					Continue
				</button>
			</div>
		);
	}

	renderCurrentState (stateId) {
		switch (true) {
			case loadingStates.includes(stateId):
				return <h2>LOADING...</h2>
			case step1States.includes(stateId):
				return (
					<StepOneTime
						selectedValue={this.props.cancellation.whenToExpire}
						onSelected={(v) => this.props.setCancellationTime(v)}
						renderFooter={() => this.renderFooter({
							onContinue: this.props.confirmCancellationTime,
							isContinueEnabled: Boolean(this.props.cancellation.whenToExpire)
						})}
					/>
				);
			case step2States.includes(stateId):
				return (
					<StepTwoServices
						services={this.props.cancellation.data.services}
						selectedServices={this.props.cancellation.selectedServices}
						onToggleService={(checked, service) => {
							return checked ?
								this.props.selectAService(service) :
								this.props.unselectAService(service);
						}}
						renderFooter={() => this.renderFooter({
							onContinue: this.props.goToStep3Websites,
							// just visual disable
							isContinueEnabled: stateId === 'step_2_has_service_selected'
						})}
					/>
				);
			case step3States.includes(stateId):
				return (
					<StepThreeWebsites
						websites={this.props.cancellation.data.websites}
						selectedWebsites={this.props.cancellation.selectedWebsites}
						onToggleWebsite={(checked, service) => {
							return checked ?
								this.props.selectAWebsite(service) :
								this.props.unselectAWebsite(service);
						}}
						renderFooter={() => this.renderFooter({
							onContinue: this.props.goToStep4Reason,
							// just visual disable
							isContinueEnabled: stateId === 'step_3_has_website_selected'
						})}
					/>
				);
			case step4States.includes(stateId):
				return (
					<StepFourReasons
						selectedValue={this.props.cancellation.selectedReason}
						onSelected={this.props.selectReason}
						onTypeReason={this.props.setReasonText}
						renderFooter={() => this.renderFooter({
							onContinue: () => alert('NEXT STEPS...'),
							isContinueEnabled: stateId === 'step_4_valid_input'
						})}
					/>
				);
			case stateId === 'restart_screen':
				return (
					<div>
						<p>You quitted the cancellation process...</p>
						<button onClick={this.props.requestCancellation}>RESTART NOW</button>
					</div>
				);
		}
	}
	
	render () {
		const { stateId } = this.props;

		return (
			<div className={styles.app}>
				<fieldset style={{ padding: '20px' }}>
					<legend>StateId: {stateId}</legend>
					{this.renderCurrentState(stateId)}
				</fieldset>
			</div>
		);
	}
}

Cancellation.propTypes = {
	stateId: PropTypes.string.isRequired,
	cancellation: PropTypes.shape({
		whenToExpire: PropTypes.string,
		selectedServices: PropTypes.object.isRequired,
		selectedWebsites: PropTypes.object.isRequired,
		selectedReason: PropTypes.string,
		reasonText: PropTypes.string,
		data: PropTypes.shape({
			services: PropTypes.array.isRequired,
			websites: PropTypes.array.isRequired
		})
	})
};

// handleQuit is available in every state
const { handleQuit, ...actionCreatorsLimitedToSomeState } = ACTION_CREATORS;

const CancellationStateMachine = withStateMachine(
	Cancellation,
	CancellationStates,
	actionCreatorsLimitedToSomeState
);

export default connect(({ cancellation }) => ({
	stateId: cancellation.stateId,
	cancellation
}), ACTION_CREATORS)(CancellationStateMachine);