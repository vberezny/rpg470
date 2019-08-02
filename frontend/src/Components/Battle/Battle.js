import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  Input,
  ListGroup,
  ListGroupItem,
  Progress,
  Table,
} from 'reactstrap';
import {NUMBERS, STRINGS} from '../../Constants/BattleConstants';
import {GLOBAL_STRINGS, GLOBAL_URLS} from '../../Constants/GlobalConstants';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Battle.scss';
import PrincessAvatar from '../../Assets/princess_avatar.png';
import Goblin from "../../Assets/goblin.png";
import {Redirect, withRouter} from "react-router-dom";
import CustomSelectionModal from "../CustomSelectionModal/CustomSelectionModal";

function CharacterCard(props) {
  const character = props.character;
  const healthValue = Math.round(character.currentHealth / character.health * NUMBERS.BATTLE_HEALTH_MULTIPLIER);
  const characterLevel = character.level ? character.level.toString() : null;
  return (
    <Card className="battle-character-card">
      <div className="char-overview-wrapper">
        <div className="char-overview-intro-flex-container overview-intro-flex-container">
          <div className="char-overview-intro overview-intro">
            <div className="battle-health-label text-center">{character.currentHealth} / {character.health}</div>
            <Progress className="battle-char-health-bar health-bar" value={healthValue} color="danger" />
            <CardImg className="char-overview-cardimg cardimg"
                     // TODO: add a method to determine correct avatar based on character type
                     src={/*character.avatar*/PrincessAvatar}/>
            <CardBody className="char-overview-cardbody cardbody">
              <CardTitle className="char-overview-cardtitle cardtitle cardtext-color">{character.name}</CardTitle>
              <CardSubtitle className="char-overview-cardsubtitle cardsubtitle">{STRINGS.BATTLE_LEVEL_MSG + characterLevel}</CardSubtitle>
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
              <td>{STRINGS.BATTLE_ATTACK_STAT_MSG}</td>
              <td>{character.attack}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_DEFENSE_STAT_MSG}</td>
              <td>{character.defense}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_MAGIC_ATTACK_STAT_MSG}</td>
              <td>{character.magic_attack}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_MAGIC_DEFENSE_STAT_MSG}</td>
              <td>{character.magic_defense}</td>
            </tr>
            </tbody>
          </Table>
        </div>
        <div className="overview-clear"/>
      </div>
    </Card>
  );
}

CharacterCard.propTypes = {
  character: PropTypes.object,
};

function NpcCard(props) {
  const npc = props.npc;
  const healthValue = Math.round(npc.currentHealth / npc.health * NUMBERS.BATTLE_HEALTH_MULTIPLIER);
  const npcLevel = npc.level ? npc.level.toString() : null;
  return (
    <Card className="battle-npc-card">
      <div className="char-overview-wrapper">
        <div className="char-overview-intro-flex-container overview-intro-flex-container">
          <div className="char-overview-intro overview-intro">
            <div className="battle-health-label text-center">{npc.currentHealth} / {npc.health}</div>
            <Progress className="battle-npc-health-bar health-bar" value={healthValue} color="danger" />
            <CardImg className="char-overview-cardimg cardimg"
                     src={/*npc.avatar*/Goblin}/>
            <CardBody className="char-overview-cardbody cardbody">
              <CardTitle className="char-overview-cardtitle cardtitle cardtext-color">{npc.name}</CardTitle>
              <CardSubtitle className="char-overview-cardsubtitle cardsubtitle">{STRINGS.BATTLE_LEVEL_MSG + npcLevel}</CardSubtitle>
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
              <td>{STRINGS.BATTLE_ATTACK_STAT_MSG}</td>
              <td>{npc.attack}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_DEFENSE_STAT_MSG}</td>
              <td>{npc.defense}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_MAGIC_ATTACK_STAT_MSG}</td>
              <td>{npc.magic_attack}</td>
            </tr>
            <tr>
              <td>{STRINGS.BATTLE_MAGIC_DEFENSE_STAT_MSG}</td>
              <td>{npc.magic_defense}</td>
            </tr>
            </tbody>
          </Table>
        </div>
        <div className="overview-clear"/>
      </div>
    </Card>
  );
}

NpcCard.propTypes = {
  npc: PropTypes.object
};

function SelectNPCModal(props) {
  let npcs;
  if (props.npcs.length > 0) {
    npcs = props.npcs.map((npc, index) => {
      const npcLevel = npc.level ? npc.level.toString() : null;
      return (
        <div className="select-npc-card-wrapper" key={index}>
          <Card className="">
            <CardImg className="cardimg" src={Goblin} />
            <CardBody className="cardbody">
              <CardTitle className="cardtitle cardtext-color">{npc.name}</CardTitle>
              <CardSubtitle className="cardsubtitle">{STRINGS.BATTLE_LEVEL_MSG + npcLevel}</CardSubtitle>
            </CardBody>
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
                  <td>{npc.health}</td>
                </tr>
                <tr>
                  <td>{STRINGS.BATTLE_ATTACK_STAT_MSG}</td>
                  <td>{npc.attack}</td>
                </tr>
                <tr>
                  <td>{STRINGS.BATTLE_DEFENSE_STAT_MSG}</td>
                  <td>{npc.defense}</td>
                </tr>
                <tr>
                  <td>{STRINGS.BATTLE_MAGIC_ATTACK_STAT_MSG}</td>
                  <td>{npc.magic_attack}</td>
                </tr>
                <tr>
                  <td>{STRINGS.BATTLE_MAGIC_DEFENSE_STAT_MSG}</td>
                  <td>{npc.magic_defense}</td>
                </tr>
                </tbody>
              </Table>
            </div>
          </Card>
          <div className="select-npc-label-wrapper">
            <Input id={npc.name} type="radio" name="npc-select" onChange={props.handleChangeNPCSelection}/>
          </div>
        </div>
      );
    });
  } else {
    npcs = <div>
      <p className="select-npc-modal-no-npcs-msg">{STRINGS.BATTLE_SELECT_NPC_MODAL_NO_NPCS_MSG}</p>
    </div>
  }

  const modalHeader = (
      <div className="select-npc-modal-header">{STRINGS.BATTLE_SELECT_NPC_MODAL_HEADER_MSG}</div>
  );
  const modalBody = (
      <div className="select-npc-modal-card-container card-container">{npcs}</div>
  );

  return (
      <CustomSelectionModal
          modalHeader={modalHeader}
          modalBody={modalBody}
          selectionButtonText={STRINGS.BATTLE_SELECT_NPC_MODAL_SELECT_BUTTON_MSG}
          className="select-npc-modal"
          isOpen={!props.isNPCSelected}
          selectButtonDisabled={!props.npcSelection}
          onSelect={() => props.handleConfirmNPCSelection(props.npcSelection)}
      />
  );
}

SelectNPCModal.propTypes = {
  npcs: PropTypes.array,
  npcSelection: PropTypes.string,
  isNPCSelected: PropTypes.bool,
  handleChangeNPCSelection: PropTypes.func,
  handleConfirmNPCSelection: PropTypes.func
};

function EscapeSuccessful(props) {
  const success = props.EscapeSuccessful;
  if (success) {
    return <Redirect to="/"/>;
  }
  return null;
}

EscapeSuccessful.propTypes = {
  EscapeSuccessful: PropTypes.bool
};


class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      escapeSuccess: false,
      npcSelection: '',
      isNPCSelected: false,
      winner: '',
      allNPCs: [],
      character: {},
      npc: {}
    }
  };

  async componentDidMount() {
    const responseCharacters = await fetch(GLOBAL_URLS.GET_API_CHARACTERS);
    const responseNPCs = await fetch(GLOBAL_URLS.GET_API_NPCS);
    const bodyCharacters = await responseCharacters.json();
    const bodyNPCs = await responseNPCs.json();
    if (bodyCharacters) {
      bodyCharacters[GLOBAL_STRINGS.CHARACTER_API_RESPONSE_INDEX].forEach(character => {
        if (character.name === this.props.currentCharacterName) {
          character.currentHealth = character.health;
          this.setState({
            character
          });
        }
      });
    }
    if (bodyNPCs) {
      const allNPCs = bodyNPCs[GLOBAL_STRINGS.NPC_API_RESPONSE_INDEX];
      this.setState({
        allNPCs
      });
      if (this.props.location) {
        const isNPCSelected = this.props.location.state.isNPCSelected;
        const npcSelection = this.props.location.state.npcSelection;
        // skips npc selection modal if npc is already selected from home page
        if (isNPCSelected) {
          this.setState({
            isNPCSelected: true,
            npcSelection
          });
          allNPCs.forEach(npc => {
            if (npc.name === this.state.npcSelection) {
              npc.currentHealth = npc.health;
              this.setState({
                npc
              });
            }
          });
        }
      }
    }
  }

  handleChangeNPCSelection = (event) => {
    const npcSelection = event.target.id;
    this.setState({
      npcSelection
    });
  };

  handleConfirmNPCSelection = (currentNPCName) => {
    this.setState({
      isNPCSelected: true,
      npcSelection: currentNPCName
    });

    this.state.allNPCs.forEach(npc => {
      if (npc.name === this.state.npcSelection) {
        npc.currentHealth = npc.health;
        this.setState({
          npc
        });
      }
    });
  };

  handleEscape = () => {
    const success = Math.round(Math.random()); // generates 0 or 1
    if (success === NUMBERS.BATTLE_ESCAPE_SUCCESS_1) {
      // TODO: log the action, save the battle
      this.setState({
        escapeSuccess: true
      });
      // TODO: toast saying escape succeeded
    } else {
      // TODO: log the action, maybe a popup saying escape failed, continue battle
      console.log("Escape unsuccessful!");
      setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL);
    }
  };

  // TODO: expand this method (or make more helper methods) to allow for different attack types, accuracy calculations,
  //  critical hits (this is just the basic method for now)
  handleAttack = () => {
    let damage = this.state.character.attack - this.state.npc.defense;
    if (damage < NUMBERS.BATTLE_DAMAGE_0) {
      damage = NUMBERS.BATTLE_DAMAGE_0;
    }
    this.calculateAndSetNewNPCHealth(damage);
    setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL));
  };

  // TODO: will expand same as attack method
  handleMagicAttack = () => {
    let damage = this.state.character.magic_attack - this.state.npc.magic_defense;
    if (damage < NUMBERS.BATTLE_DAMAGE_0) {
      damage = NUMBERS.BATTLE_DAMAGE_0;
    }
    this.calculateAndSetNewNPCHealth(damage);
    setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL);
  };

  npcAttack = () => {
    const attackType = Math.round(Math.random()); // generates 0 or 1
    let damage;
    if (attackType === NUMBERS.BATTLE_ATTACK_TYPE_0) {   // Normal attack
      damage = this.state.npc.attack - this.state.character.defense;
    } else {                  // Magic attack
      damage = this.state.npc.magic_attack - this.state.character.magic_defense;
    }
    if (damage < NUMBERS.BATTLE_DAMAGE_0) {
      damage = NUMBERS.BATTLE_DAMAGE_0;
    }
    this.calculateAndSetNewCharacterHealth(damage);
  };

  calculateAndSetNewNPCHealth = (damage) => {
    let newNPCHealth = this.state.npc.currentHealth - damage;
    if (newNPCHealth < 0) {
      newNPCHealth = 0;
    }
    this.setState(prevState => ({
      npc: {
        ...prevState.npc,     // keep all other key-value pairs
        currentHealth: newNPCHealth
      }
    }));
    if (newNPCHealth === 0) {
      this.setState(prevState => ({
        winner: prevState.character.name
      }));
    }
    // TODO: create battle log component and log stuff in there
  };

  calculateAndSetNewCharacterHealth = (damage) => {
    let newCharacterHealth = this.state.character.currentHealth - damage;
    if (newCharacterHealth < 0) {
      newCharacterHealth = 0;
    }
    this.setState(prevState => ({
      character: {
        ...prevState.character,     // keep all other key-value pairs
        currentHealth: newCharacterHealth
      }
    }));
    if (newCharacterHealth === 0) {
      this.setState(prevState => ({
        winner: prevState.npc.name
      }));
    }
    // TODO: create battle log component and log stuff in there
  };

  render() {
    return (
      <div className="battle-page page-container">
        <EscapeSuccessful EscapeSuccessful={this.state.escapeSuccess} />
        <CustomNavbar handleLogout={this.props.handleUnauthenticate}/>
         {/*TODO: Change CSS such that we don't need this full-viewport-with-navbar class - use flexbox page-containers instead*/}
        <div className="battle-centered-content full-viewport-with-navbar centered content container">
          <SelectNPCModal
              npcs={this.state.allNPCs}
              npcSelection={this.state.npcSelection}
              isNPCSelected={this.state.isNPCSelected}
              handleChangeNPCSelection={this.handleChangeNPCSelection}
              handleConfirmNPCSelection={this.handleConfirmNPCSelection}
          />
          <div className="battle-viewport-width">
            <h1 className="battle-header-text">{STRINGS.BATTLE_HEADER_MSG}</h1>
            <div className="battle-container container">
              <div className="battle-card-container container">
                <CharacterCard character={this.state.character}/>
                <NpcCard npc={this.state.npc}/>
              </div>
              <h3 className="battle-container-header-text">{STRINGS.BATTLE_CONTAINER_HEADER_MSG}</h3>
              <div className="battle-buttons-container container">
                <Button
                    className="attack-button battle-button"
                    color="danger"
                    onClick={this.handleAttack}
                >
                  {STRINGS.BATTLE_BUTTON_ATTACK}
                </Button>
                <Button
                    className="magic-button battle-button"
                    color="primary"
                    onClick={this.handleMagicAttack}
                >
                  {STRINGS.BATTLE_BUTTON_MAGIC}
                </Button>
                {/*TODO: hookup character inventory (probably just consumables) once the endpoint is created*/}
                <Button className="inventory-button battle-button" color="success">{STRINGS.BATTLE_BUTTON_INVENTORY}</Button>{' '}
                <Button
                    className="escape-button battle-button"
                    color="warning"
                    onClick={this.handleEscape}
                >
                  {STRINGS.BATTLE_BUTTON_ESCAPE}
                </Button>
              </div>
              <div className="battle-log-container container">
                <h3 className="battle-log-container-header-text">{STRINGS.BATTLE_LOG_CONTAINER_HEADER_MSG}</h3>
                <ListGroup className="battle-log">
                  {/*TODO: build a battle log, below is temporary just for mockup purposes*/}
                  <ListGroupItem>List ordered such that most recent actions go on top</ListGroupItem>
                  <ListGroupItem>Goblin hits you for 4 damage</ListGroupItem>
                  <ListGroupItem>You hit goblin for 5 damage</ListGroupItem>
                  <ListGroupItem>Goblin attacks you but misses!</ListGroupItem>
                  <ListGroupItem>You cast fireball at the Goblin for 3 damage</ListGroupItem>
                  <ListGroupItem>Goblin hits you for 4 damage</ListGroupItem>
                </ListGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Battle.propTypes = {
  handleUnauthenticate: PropTypes.func,
  currentCharacterName: PropTypes.string,
};

export default withRouter(Battle);