import React from 'react';
import PropTypes from 'prop-types';

export const wrapDispatchProp =
	(stateMachineName, stateOptionsByStateId) =>
		(actionName, props, stateId) => ({
			[actionName]: (...args) => {
				const allowedToDispatch = Boolean(
					stateOptionsByStateId[stateId] &&
					stateOptionsByStateId[stateId].availableActions &&
					stateOptionsByStateId[stateId].availableActions[actionName]
				);
				return (
					allowedToDispatch ?
						props[actionName](...args) :
						console.warn(
							`| ${stateMachineName} | => ${actionName}`,
							`is not allowed to be dispatched when machine is in state: ${stateId}`
						) || console.trace()
				);
			}
		});
		
export const withStateMachine = (
	WrappedStateMachine,
	stateOptionsByStateId = {},
	actionCreators = {}
) => {
	const wrapAction = wrapDispatchProp(WrappedStateMachine.name, stateOptionsByStateId);

	class WithStateMachine extends React.Component {
		getStateProps ({ stateId, ...props }) {
			return Object
					.keys(props)
					.reduce((outputProps, propName) => {
						/* wrap a prop, which is a redux action and declared as an action creator */
						if (actionCreators[propName] && typeof(props[propName]) === 'function') {
							return {
								...outputProps,
								...wrapAction(propName, props, stateId)
							}
						}

						return outputProps;
					}, { stateId, ...props });
		}

		handleOnEnterState({ stateId, ...props }) {
			const nextStateOptions = stateOptionsByStateId[stateId];
			if (nextStateOptions && typeof(nextStateOptions.onEnterState) === 'function') {
				nextStateOptions.onEnterState(
					this.getStateProps({ stateId, ...props })
				);
			}

			if (!nextStateOptions) {
				console.warn(`| ${WrappedStateMachine.name} | => No configuration options are provided for state: ${stateId}`);
			}
		}

		componentWillReceiveProps(nextProps) {
			if (nextProps.stateId !== this.props.stateId) {
				this.handleOnEnterState(nextProps);
			}
		}

		render () {
			const stateProps = this.getStateProps(this.props);
			return (
				<WrappedStateMachine {...stateProps} />
			);
		}

		componentDidMount() {
			this.handleOnEnterState(this.props);
		}
	}

	WithStateMachine.propTypes = {
		stateId: PropTypes.string.isRequired
	}

	return WithStateMachine;
}