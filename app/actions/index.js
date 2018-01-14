const action = (type, payload = {}) => {
	return { type, payload };
}

export const requestCancellation = () => action('REQUEST_CANCELLATION_DATA');
export const requestCancellationFailed = () => action('REQUEST_CANCELLATION_DATA_FAILED');
export const requestCancellationSucess = (data) => action('REQUEST_CANCELLATION_DATA_SUCCESS', { data });

export const setCancellationTime = (time) => action('SET_CANCELLATION_TIME', { time });
export const confirmCancellationTime = () => action('CONFIRM_CANCELLATION_TIME');
export const goToStep2Services = () => action('GO_TO_STEP_2_SERVICES');
export const selectAService = (service) => action('SELECT_A_SERVICE', { service });
export const unselectAService = (service) => action('UNSELECT_A_SERVICE', { service });
export const goToStep3Websites = () => action('GO_TO_STEP_3_WEBSITES');
export const selectAWebsite = (website) => action('SELECT_A_WEBSITE', { website });
export const unselectAWebsite = (website) => action('UNSELECT_A_WEBSITE', { website });
export const goToStep4Reason = () => action('GO_TO_STEP_4_REASON');
export const selectReason = (reason) => action('SELECT_REASON', { reason });
export const setReasonText = (text) => action('SET_REASON_TEXT', { text });
export const handleQuit = () => action('HANDLE_QUIT');