import React from 'react';
import PropTypes from 'prop-types';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './BattleHistory.scss';
import {GLOBAL_STRINGS, GLOBAL_URLS} from "../../Constants/GlobalConstants";
import {STRINGS} from "../../Constants/BattleHistoryConstants";
import {Table} from 'reactstrap';

function HistoryTable(props) {
	if (props.history.length > 0) {
		// generate table rows
		const tableRows = props.history.map((entry, index) => {
			return (
				<tr key={index}>
					<td>{entry.timestamp}</td>
					<td>{entry.opponent}</td>
					<td>{entry.outcome}</td>
				</tr>
			);
		});

		// return the table
		return (
			<Table
				className="battle-history-table"
				responsive={true}
				striped={true}
				hover={true}
			>
				<thead>
				<tr>
					<th>{STRINGS.BATTLE_HISTORY_TABLE_HEADER_DATE}</th>
					<th>{STRINGS.BATTLE_HISTORY_TABLE_HEADER_OPPONENT}</th>
					<th>{STRINGS.BATTLE_HISTORY_TABLE_HEADER_OUTCOME}</th>
				</tr>
				</thead>
				<tbody>
				{tableRows}
				</tbody>
			</Table>
		);
	} else {
		// returns message saying there's no battle history
		return (
			<div>
				<p className="history-table-no-history-message">{STRINGS.BATTLE_HISTORY_NO_HISTORY}</p>
			</div>
		);
	}
}

HistoryTable.propTypes = {
	history: PropTypes.array
};

class BattleHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			characterId: 0,
			battleHistory: []
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
			if (this.state.characterId !== 0) {
				const responseHistory = await fetch(`${GLOBAL_URLS.GET_API_BATTLE_HISTORY}${this.state.characterId}`);
				const bodyHistory = await responseHistory.json();
				if (bodyHistory) {
					console.log(bodyHistory);
					let battleHistory = [];
					bodyHistory[GLOBAL_STRINGS.BATTLE_HISTORY_API_RESPONSE_INDEX].forEach(entry => {
						let date = new Date(entry.timestamp).toDateString();
						let time = new Date(entry.timestamp).toLocaleTimeString();
						let dateAndTime = date + ' ' + time;
						let outcome;
						if (entry.escaped) {
							outcome = "Escaped"
						} else if (entry.won) {
							outcome = "Won"
						} else {
							outcome = "Lost"
						}
						battleHistory.push({
							timestamp: dateAndTime,
							opponent: entry.opponent,
							outcome: outcome
						});
					});
					this.setState({
						battleHistory
					});
				}
			}
		}
	}

	render() {
		const headerMessage = STRINGS.BATTLE_HISTORY_HEADER_TEXT + this.props.currentCharacterName;

		return (
			<div className="battle-history-page page-container">
				<CustomNavbar handleLogout={this.props.handleUnauthenticate}/>
				<div className="battle-history-centered-content full-viewport-with-navbar centered content container">
					<div className="battle-history-viewport-width">
						<h1 className="battle-history-header-text">{headerMessage}</h1>
						<div className="battle-history-table-container container">
							<HistoryTable history={this.state.battleHistory} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

BattleHistory.propTypes = {
	handleUnauthenticate: PropTypes.func,
	currentCharacterName: PropTypes.string,
};

export default BattleHistory;
