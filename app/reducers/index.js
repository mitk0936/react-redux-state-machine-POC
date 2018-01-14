import { combineReducers } from 'redux';
import { omit } from '../utils';

const defaultState = {
	stateId: 'initial',
	whenToExpire: null,
	selectedServices: {},
	selectedWebsites: {},
	selectedReason: null,
	reasonText: null,
	data: {
		services: [],
		websites: []
	}
};

const validReasons = ['reason_1', 'reason_2', 'reason_3', 'reason_4'];
const switchStateTo = (state, nextStateId) => ({ ...state, stateId: nextStateId });
const validateReasonStepState = (state) => ({
	...state,
	stateId: (
		(state.selectedReason === 'other' && state.reasonText && state.reasonText.length > 0) ||
		validReasons.includes(state.selectedReason)
	) ? 'step_4_valid_input' : 'choose_reason_step'
})

const cancellation = (state = defaultState, { type, payload }) => {
	let nextState;

	switch (type) {
		case 'REQUEST_CANCELLATION_DATA':
			return switchStateTo(defaultState, 'cancellation_requested');
		case 'REQUEST_CANCELLATION_DATA_FAILED':
			return switchStateTo(state, 'initial');
		case 'REQUEST_CANCELLATION_DATA_SUCCESS':
			return {
				...switchStateTo(state, 'choose_cancellation_time_step'),
				data: payload.data
			};
		case 'SET_CANCELLATION_TIME':
			if (['now', 'at_exp'].includes(payload.time)) {
				return {
					...state,
					stateId: payload.time === 'now' ? 'step_1_selected_immediately' : 'step_1_selected_at_exp',
					whenToExpire: payload.time
				};
			}
			
			return switchStateTo({ ...state, whenToExpire: defaultState.whenToExpire }, 'choose_cancellation_time_step');
		case 'CONFIRM_CANCELLATION_TIME':
			return switchStateTo(state, 'cancellation_time_confirmed');
		case 'GO_TO_STEP_2_SERVICES':
			return {
				...state,
				stateId: state.data.services.length > 0 ? 'step_2_has_services' : 'step_2_has_no_services'
			};
		case 'SELECT_A_SERVICE':
			return {
				...state,
				stateId: 'step_2_has_service_selected',
				selectedServices: {
					...state.selectedServices,
					[payload.service]: true
				}
			}
		case 'UNSELECT_A_SERVICE':
			nextState = {
				...state,
				selectedServices: omit([String(payload.service)], state.selectedServices)
			};

			if (Object.keys(nextState.selectedServices).length === 0) {
				return switchStateTo(nextState, 'step_2_has_services')
			}

			return nextState;
		case 'GO_TO_STEP_3_WEBSITES':
			return {
				...state,
				stateId: state.data.websites.length > 0 ? 'step_3_has_websites' : 'step_3_has_no_websites'
			};
		case 'SELECT_A_WEBSITE':
			return {
				...state,
				stateId: 'step_3_has_website_selected',
				selectedWebsites: {
					...state.selectedWebsites,
					[payload.website]: true
				}
			};
		case 'UNSELECT_A_WEBSITE':
			nextState = {
				...state,
				selectedWebsites: omit([String(payload.website)], state.selectedWebsites)
			};

			if (Object.keys(nextState.selectedWebsites).length === 0) {
				return switchStateTo(nextState, 'step_3_has_websites')
			}

			return nextState;
		case 'GO_TO_STEP_4_REASON':
			return switchStateTo(state, 'choose_reason_step');
		case 'SELECT_REASON':
			return validateReasonStepState({
				...state,
				selectedReason: payload.reason
			});
		case 'SET_REASON_TEXT':
			return validateReasonStepState({
				...state,
				selectedReason: payload.text.length > 0 ? 'other' : state.selectedReason,
				reasonText: payload.text
			});
		case 'HANDLE_QUIT':
			return switchStateTo(state, 'restart_screen');
	}

	return state;
}

export const reducers = combineReducers({ cancellation });
