import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Card,
  CardImg,
  Table, CardBody, CardTitle, CardSubtitle, CardText
} from 'reactstrap';
import {
  NUMBERS,
  STRINGS
} from '../../Constants/BattleConstants';
import {
  GLOBAL_URLS
} from '../../Constants/GlobalConstants';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Battle.scss';
import PrincessAvatar from '../../Assets/princess_avatar.png';
import Goblin from "../../Assets/goblin.png";

class Battle extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     characterName: '',
  //     remainingStatPoints: 10,
  //     avatarSelection: '',
  //     stats: [
  //       {
  //         name: 'Stamina',
  //         value: 12,
  //         isAddButtonDisabled: false,
  //         isSubtractButtonDisabled: true
  //       },
  //       {
  //         name: 'Strength',
  //         value: 10,
  //         isAddButtonDisabled: false,
  //         isSubtractButtonDisabled: true
  //       },
  //       {
  //         name: 'Agility',
  //         value: 10,
  //         isAddButtonDisabled: false,
  //         isSubtractButtonDisabled: true
  //       },
  //       {
  //         name: 'Wisdom',
  //         value: 11,
  //         isAddButtonDisabled: false,
  //         isSubtractButtonDisabled: true
  //       },
  //       {
  //         name: 'Charisma',
  //         value: 11,
  //         isAddButtonDisabled: false,
  //         isSubtractButtonDisabled: true
  //       }
  //     ]
  //   };
  // }
  //
  render() {
    const mockNPCData = {
      title: 'Goblin',
      level: 1,
      text: 'Some text about the goblin',
      avatar: Goblin,
      currentHealth: 25,
      maxHealth: 25,
      attack: 5,
      defense: 4,
      magicAttack: 4,
      magicDefense: 3
    };

    const mockCharacterData = {
      name: 'Annabelle',
      avatar: PrincessAvatar,
      level: 1,
      text: 'Here is some text about the character',
      currentHealth: 25,
      maxHealth: 25,
      attack: 5,
      defense: 4,
      magicAttack: 4,
      magicDefense: 3
    };

    return (
      <div className="battle-page page-container">
        <CustomNavbar/>
         {/*TODO: Change CSS such that we don't need this full-viewport-with-navbar class - use flexbox page-containers instead*/}
        <div className="battle-centered-content full-viewport-with-navbar centered content container">
          <div className="battle-viewport-width">
            <h1 className="battle-header-text">{STRINGS.BATTLE_HEADER_MSG}</h1>
            <div className="battle-container container">
              {/*TODO: maybe make this below the cards*/}
              <h3 className="battle-container-header-text">{STRINGS.BATTLE_CONTAINER_HEADER_MSG_1 + mockNPCData.title + STRINGS.BATTLE_CONTAINER_HEADER_MSG_2}</h3>
              <div className="battle-card-container container">
                <Card className="battle-character-card">
                  <div className="char-overview-wrapper">
                    <div className="char-overview-intro-flex-container overview-intro-flex-container">
                      <div className="char-overview-intro overview-intro">
                        <CardImg className="char-overview-cardimg cardimg"
                                 src={mockCharacterData.avatar}/>
                        <CardBody className="char-overview-cardbody cardbody">
                          <CardTitle className="char-overview-cardtitle cardtitle cardtext-color">{mockCharacterData.name}</CardTitle>
                          <CardSubtitle className="char-overview-cardsubtitle cardsubtitle">{STRINGS.BATTLE_LEVEL_MSG + mockCharacterData.level.toString()}</CardSubtitle>
                          <CardText className="char-overview-cardtext cardtext cardtext-color">{mockCharacterData.text}</CardText>
                        </CardBody>
                      </div>
                    </div>
                    <div className="char-overview-stats overview-stats">
                      <Table>
                        <thead>
                        <tr>
                          <th>{STRINGS.BATTLE_STAT_MSG}</th>
                          <th>{STRINGS.BATTLE_VALUE_MSG}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>{STRINGS.BATTLE_HEALTH_STAT_MSG}</td>
                          <td>{mockCharacterData.currentHealth}/{mockCharacterData.maxHealth}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_ATTACK_STAT_MSG}</td>
                          <td>{mockCharacterData.attack}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_DEFENSE_STAT_MSG}</td>
                          <td>{mockCharacterData.defense}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_MAGIC_ATTACK_STAT_MSG}</td>
                          <td>{mockCharacterData.magicAttack}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_MAGIC_DEFENSE_STAT_MSG}</td>
                          <td>{mockCharacterData.magicDefense}</td>
                        </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="overview-clear"/>
                  </div>
                </Card>
                <Card className="battle-npc-card">
                  <div className="char-overview-wrapper">
                    <div className="char-overview-intro-flex-container overview-intro-flex-container">
                      <div className="char-overview-intro overview-intro">
                        <CardImg className="char-overview-cardimg cardimg"
                                 src={mockNPCData.avatar}/>
                        <CardBody className="char-overview-cardbody cardbody">
                          <CardTitle className="char-overview-cardtitle cardtitle cardtext-color">{mockNPCData.title}</CardTitle>
                          <CardSubtitle className="char-overview-cardsubtitle cardsubtitle">{STRINGS.BATTLE_LEVEL_MSG + mockNPCData.level.toString()}</CardSubtitle>
                          <CardText className="char-overview-cardtext cardtext cardtext-color">{mockNPCData.text}</CardText>
                        </CardBody>
                      </div>
                    </div>
                    <div className="char-overview-stats overview-stats">
                      <Table>
                        <thead>
                        <tr>
                          <th>{STRINGS.BATTLE_STAT_MSG}</th>
                          <th>{STRINGS.BATTLE_VALUE_MSG}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>{STRINGS.BATTLE_HEALTH_STAT_MSG}</td>
                          <td>{mockNPCData.currentHealth}/{mockNPCData.maxHealth}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_ATTACK_STAT_MSG}</td>
                          <td>{mockNPCData.attack}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_DEFENSE_STAT_MSG}</td>
                          <td>{mockNPCData.defense}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_MAGIC_ATTACK_STAT_MSG}</td>
                          <td>{mockNPCData.magicAttack}</td>
                        </tr>
                        <tr>
                          <td>{STRINGS.BATTLE_MAGIC_DEFENSE_STAT_MSG}</td>
                          <td>{mockNPCData.magicDefense}</td>
                        </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="overview-clear"/>
                  </div>
                </Card>
              </div>
              <div className="battle-buttons-container container">
                <Button className="attack-button battle-button" color="danger">Attack</Button>{' '}
                <Button className="magic-button battle-button" color="primary">Magic Attack</Button>{' '}
                <Button className="inventory-button battle-button" color="success">Inventory</Button>{' '}
                <Button className="escape-button battle-button" color="warning">Run Away!</Button>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Battle;