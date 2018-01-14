import * as api from '../../services/api';
import * as ACTION_CREATORS from '../../actions';

const {
	requestCancellation,
	requestCancellationFailed,
	requestCancellationSucess,
	setCancellationTime,
	confirmCancellationTime,
	goToStep2Services,
	selectAService,
	unselectAService,
	goToStep3Websites,
	selectAWebsite,
	unselectAWebsite,
	goToStep4Reason,
	selectReason,
	setReasonText
} = ACTION_CREATORS;

export default {
	initial: {
		availableActions: { requestCancellation },
		onEnterState: ({ requestCancellation }) => requestCancellation()
	},
	cancellation_requested: {
		availableActions: { requestCancellationFailed, requestCancellationSucess },
		onEnterState: (nextProps) => {
			api.fetchCancellation()
				.then(nextProps.requestCancellationSucess)
				.catch(nextProps.requestCancellationFailed);

			/*	*********
				IMPORTANT

				nextProps.requestCancellation()
				is not available in this state (cancellation_requested),
				calling it from here will not throw an error,
				but the stateMachine will log a warning in the
				console:

				| Cancellation | => requestCancellation is not allowed to be dispatched when machine is in state: cancellation_requested
			*/

			nextProps.requestCancellation();
		}
	},
	choose_cancellation_time_step: {
		availableActions: { setCancellationTime }
	},
	step_1_selected_immediately: {
		availableActions: { setCancellationTime, confirmCancellationTime }
	},
	step_1_selected_at_exp: {
		availableActions: { setCancellationTime, confirmCancellationTime }
	},
	cancellation_time_confirmed: {
		availableActions: { goToStep2Services, goToStep4Reason },
		onEnterState: (nextProps) => {
			if (nextProps.cancellation.whenToExpire === 'at_exp') {
				return nextProps.goToStep4Reason();
			}
			nextProps.goToStep2Services();
		}
	},
	step_2_has_services: {
		availableActions: { selectAService }
	},
	step_2_has_service_selected: {
		availableActions: { selectAService, unselectAService, goToStep3Websites }
	},
	step_2_has_no_services: {
		availableActions: { goToStep3Websites },
		onEnterState: (nextProps) => nextProps.goToStep3Websites()
	},
	step_3_has_websites: {
		availableActions: { selectAWebsite, unselectAWebsite }
	},
	step_3_has_website_selected: {
		availableActions: { selectAWebsite, unselectAWebsite, goToStep4Reason }
	},
	step_3_has_no_websites: {
		availableActions: { goToStep4Reason },
		onEnterState: (nextProps) => nextProps.goToStep4Reason()
	},
	choose_reason_step: {
		availableActions: { selectReason, setReasonText }
	},
	step_4_valid_input: {
		availableActions: { selectReason, setReasonText }
	},
	restart_screen: {
		availableActions: { requestCancellation }
	}
};