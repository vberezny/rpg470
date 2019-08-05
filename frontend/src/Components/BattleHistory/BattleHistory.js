import React from 'react';
import PropTypes from 'prop-types';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './BattleHistory.scss';
import {GLOBAL_STRINGS, GLOBAL_URLS} from "../../Constants/GlobalConstants";

class BattleHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			characterId: 0
		}
	};

	async componentDidMount() {
		const responseCharacters = await fetch(GLOBAL_URLS.GET_API_CHARACTERS);
		const bodyCharacters = await responseCharacters.json();
		if (bodyCharacters) {
			bodyCharacters[GLOBAL_STRINGS.CHARACTER_API_RESPONSE_INDEX].forEach(character => {
				if (character.name === this.props.currentCharacterName) {
					this.setState({
						characterId: character.id
					});
				}
			});
		}
		// TODO: fetch battle history using character id (might have to put this as a callback after set state) (or
		//  don't bother setting state since all I need is the id)
	}

	render() {
		return (
			<div className="battle-history-page page-container">
				<CustomNavbar handleLogout={this.props.handleUnauthenticate}/>
			</div>
		);
	}
}

BattleHistory.propTypes = {
	handleUnauthenticate: PropTypes.func,
	currentCharacterName: PropTypes.string,
};

export default BattleHistory;
