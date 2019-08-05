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
					<td>{entry.time}</td>
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
		// TODO: make sure most recent battle is always on top
		const mockTableData = [
			{
				time: 1,
				opponent: "Imp",
				outcome: "won"
			},
			{
				time: 2,
				opponent: "Imp",
				outcome: "lost"
			},
			{
				time: 3,
				opponent: "Goblin",
				outcome: "won"
			},
			{
				time: 4,
				opponent: "Zombie",
				outcome: "escaped"
			}
		];
		const headerMessage = STRINGS.BATTLE_HISTORY_HEADER_TEXT + this.props.currentCharacterName;

		return (
			<div className="battle-history-page page-container">
				<CustomNavbar handleLogout={this.props.handleUnauthenticate}/>
				<div className="battle-history-centered-content full-viewport-with-navbar centered content container">
					<div className="battle-history-viewport-width">
						<h1 className="battle-history-header-text">{headerMessage}</h1>
						<div className="battle-history-table-container container">
							<HistoryTable history={mockTableData} />
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
