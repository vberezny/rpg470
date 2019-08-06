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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import {NUMBERS, STRINGS} from '../../Constants/BattleConstants';
import {GLOBAL_STRINGS, GLOBAL_URLS} from '../../Constants/GlobalConstants';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Battle.scss';
import PrincessAvatar from '../../Assets/princess_avatar.png';
import Goblin from "../../Assets/goblin.png";
import {withRouter, Link} from "react-router-dom";
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
              <CardSubtitle className="char-overview-cardsubtitle-potions cardsubtitle">{STRINGS.BATTLE_INVENTORY_POTIONS + props.potionCount}</CardSubtitle>
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
  potionCount: PropTypes.number
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
  if (props.npcs.length > NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
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

// TODO: add displays for xp gain, and a button to assign new stats if the character levels up
function BattleResultsModal(props) {
  const className = "battle-results-modal";
  let headerMessage;
  if (props.escapeSuccess) {
    headerMessage = STRINGS.BATTLE_RESULT_MODAL_HEADER_ESCAPE_MSG + props.npcName;
  } else if (props.winner === props.npcName) {
    headerMessage = STRINGS.BATTLE_RESULT_MODAL_HEADER_LOSS_MSG + props.npcName;
  } else {
    headerMessage = STRINGS.BATTLE_RESULT_MODAL_HEADER_WIN_MSG + props.npcName;
  }

  return (
    <Modal isOpen={props.winner || props.escapeSuccess} className={className}>
      <ModalHeader>{headerMessage}</ModalHeader>
      <ModalBody>{STRINGS.BATTLE_RESULT_MODAL_BODY_MSG}</ModalBody>
      <ModalFooter>
        <Link to="/">
          <Button color="primary">{STRINGS.BATTLE_RESULT_MODAL_FOOTER_HOME_BTN}</Button>
        </Link>
      </ModalFooter>
    </Modal>
  );
}

BattleResultsModal.propTypes = {
  escapeSuccess: PropTypes.bool,
  winner: PropTypes.string,
  npcName: PropTypes.string
};

function BattleLog(props) {
  const className = "battle-log";
  const listItems = props.battleLog.map((listItem, index) => {
    return (
      <ListGroupItem color={listItem.color} key={index}>
        {listItem.message}
      </ListGroupItem>
    )
  });

  return (
    <ListGroup className={className}>
      {listItems}
    </ListGroup>
  );
}

BattleLog.propTypes = {
  battleLog: PropTypes.array,
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
      npc: {},
      battleLog: [],
      saveLog: [],
      consumables: [],
      potions: []
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
      const responseInventory = await fetch(`${GLOBAL_URLS.GET_API_CHARACTER_INVENTORY_PT_1}${this.props.currentCharacterName}${GLOBAL_URLS.GET_API_CHARACTER_INVENTORY_PT_2}`);
      const bodyInventory = await responseInventory.json();
      if (bodyInventory) {
        console.log(bodyInventory);
        const consumables = bodyInventory[GLOBAL_STRINGS.INVENTORY_CONSUMABLES_API_RESPONSE_INDEX];
        let potions = [];
        consumables.forEach(consumable => {
          if (consumable.name === STRINGS.BATTLE_INVENTORY_POTION) {
            potions.push(consumable);
          }
        });
        console.log(potions);
        this.setState({
          consumables,
          potions
        });
      }
    }
    if (bodyNPCs) {
      const allNPCs = bodyNPCs[GLOBAL_STRINGS.NPC_API_RESPONSE_INDEX];
      this.setState({
        allNPCs
      });
      if (this.props.location.state) {
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
              const message = STRINGS.BATTLE_LOG_MESSAGE_START + npc.name;
              const color = STRINGS.BATTLE_LOG_COLOR_INFO;
              this.handlePrependToBattleLog(message, color);
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
        const message = STRINGS.BATTLE_LOG_MESSAGE_START + npc.name;
        const color = STRINGS.BATTLE_LOG_COLOR_INFO;
        this.handlePrependToBattleLog(message, color);
        npc.currentHealth = npc.health;
        this.setState({
          npc
        });
      }
    });
  };

  handlePrependToBattleLog = (message, color) => {
    const logEntry = {
      message: message,
      color: color
    };
    let battleLog = this.state.battleLog;
    battleLog.unshift(logEntry);
    let saveLog = this.state.saveLog;
    saveLog.push(message);
    this.setState({
      battleLog,
      saveLog
    })
  };

  handleSaveBattle = async () => {
    const won = this.state.winner === this.state.character.name;
    const response = await fetch(`${GLOBAL_URLS.POST_API_SAVE_BATTLE}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: this.state.character.id,
        won: won,
        escaped: this.state.escapeSuccess,
        opponent: this.state.npc.name,
        log: this.state.saveLog
      })
    });
    const body = await response.json();
    console.log(body);
  };


  handleUsePotion = () => {
    if (this.state.potions.length > NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
      let potion = this.state.potions.pop();
      let character = this.state.character;
      if (character.currentHealth + potion.healing > character.health) {
        character.currentHealth = character.health;
      } else {
        character.currentHealth =  character.currentHealth + potion.healing;
      }
      this.setState({
        character
      });
      const message = STRINGS.BATTLE_LOG_MESSAGE_HEAL_SUCCESS;
      const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
      // logs successful potion use
      this.handlePrependToBattleLog(message, color);
      // npc counter attack
      setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL);
    } else {
      const message = STRINGS.BATTLE_LOG_MESSAGE_HEAL_FAIL;
      const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
      // logs failed potion use
      this.handlePrependToBattleLog(message, color);
    }
  };

  handleEscape = () => {
    const success = Math.round(Math.random()); // generates 0 or 1
    if (success === NUMBERS.BATTLE_ESCAPE_SUCCESS_1) {
      const message = STRINGS.BATTLE_LOG_MESSAGE_ESCAPE_SUCCESS;
      const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
      // logs successful escape
      this.handlePrependToBattleLog(message, color);
      // waits for setState to complete before saving battle
      this.setState({
        escapeSuccess: true
      }, this.handleSaveBattle);
    } else {
      const message = STRINGS.BATTLE_LOG_MESSAGE_ESCAPE_FAIL;
      const color = STRINGS.BATTLE_LOG_COLOR_WARNING;
      // logs failed escape
      this.handlePrependToBattleLog(message, color);
      // failed escape counts as a turn, calls this.npcAttack after BATTLE_NPC_ATTACK_TIMEOUT_VAL milliseconds
      setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL);
    }
  };

  // TODO: expand this method (or make more helper methods) to allow for different attack types, accuracy calculations,
  //  critical hits (this is just the basic method for now)
  handleAttack = () => {
    let damage = this.state.character.attack - this.state.npc.defense;
    if (damage < NUMBERS.BATTLE_DAMAGE_ZERO) {
      damage = NUMBERS.BATTLE_DAMAGE_ZERO;
    }
    const message = STRINGS.BATTLE_LOG_MESSAGE_ATTACK_MSG_PT_1 +
        this.state.npc.name + STRINGS.BATTLE_LOG_MESSAGE_ATTACK_MSG_PT_2 +
        damage + STRINGS.BATTLE_LOG_MESSAGE_ATTACK_MSG_PT_3;
    const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
    // logs regular attack info
    this.handlePrependToBattleLog(message, color);
    this.calculateAndSetNewNPCHealth(damage);
  };

  // TODO: will expand same as attack method
  handleMagicAttack = () => {
    let damage = this.state.character.magic_attack - this.state.npc.magic_defense;
    if (damage < NUMBERS.BATTLE_DAMAGE_ZERO) {
      damage = NUMBERS.BATTLE_DAMAGE_ZERO;
    }
    const message = STRINGS.BATTLE_LOG_MESSAGE_MAGIC_ATTACK_MSG_PT_1 +
        this.state.npc.name + STRINGS.BATTLE_LOG_MESSAGE_MAGIC_ATTACK_MSG_PT_2 +
        damage + STRINGS.BATTLE_LOG_MESSAGE_MAGIC_ATTACK_MSG_PT_3;
    const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
    // logs magic attack info
    this.handlePrependToBattleLog(message, color);
    this.calculateAndSetNewNPCHealth(damage);
  };

  npcAttack = () => {
    const attackType = Math.round(Math.random()); // generates 0 or 1
    let damage;
    let message = STRINGS.BATTLE_LOG_MESSAGE_NPC_ATTACK_MSG_PT_1 + this.state.npc.name;
    if (attackType === NUMBERS.BATTLE_ATTACK_TYPE_ZERO) {   // Normal attack
      damage = this.state.npc.attack - this.state.character.defense;
      if (damage < NUMBERS.BATTLE_DAMAGE_ZERO) {
        damage = NUMBERS.BATTLE_DAMAGE_ZERO;
      }
      message = message + STRINGS.BATTLE_LOG_MESSAGE_NPC_ATTACK_MSG_PT_2 +
          damage + STRINGS.BATTLE_LOG_MESSAGE_NPC_ATTACK_MSG_PT_3;
    } else {                                                // Magic attack
      damage = this.state.npc.magic_attack - this.state.character.magic_defense;
      if (damage < NUMBERS.BATTLE_DAMAGE_ZERO) {
        damage = NUMBERS.BATTLE_DAMAGE_ZERO;
      }
      message = message + STRINGS.BATTLE_LOG_MESSAGE_NPC_MAGIC_ATTACK_MSG_PT_2 +
          damage + STRINGS.BATTLE_LOG_MESSAGE_NPC_MAGIC_ATTACK_MSG_PT_3;
    }
    const color = STRINGS.BATTLE_LOG_COLOR_DANGER;
    // logs npc attack type and damage
    this.handlePrependToBattleLog(message, color);
    this.calculateAndSetNewCharacterHealth(damage);
  };

  calculateAndSetNewNPCHealth = (damage) => {
    let newNPCHealth = this.state.npc.currentHealth - damage;
    if (newNPCHealth < NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
      newNPCHealth = NUMBERS.BATTLE_GENERIC_ZERO_VALUE;
    }
    this.setState(prevState => ({
      npc: {
        ...prevState.npc,     // keep all other key-value pairs
        currentHealth: newNPCHealth
      }
    }));
    if (newNPCHealth === NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
      const message = STRINGS.BATTLE_LOG_MESSAGE_VICTORY + this.state.npc.name;
      const color = STRINGS.BATTLE_LOG_COLOR_SUCCESS;
      // logs victory
      this.handlePrependToBattleLog(message, color);
      // waits for setState to complete before saving battle
      this.setState(prevState => ({
        winner: prevState.character.name
      }), this.handleSaveBattle);
    } else {
      // starts npc counter attack after BATTLE_NPC_ATTACK_TIMEOUT_VAL milliseconds
      setTimeout(this.npcAttack, NUMBERS.BATTLE_NPC_ATTACK_TIMEOUT_VAL);
    }
  };

  calculateAndSetNewCharacterHealth = (damage) => {
    let newCharacterHealth = this.state.character.currentHealth - damage;
    if (newCharacterHealth < NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
      newCharacterHealth = NUMBERS.BATTLE_GENERIC_ZERO_VALUE;
    }
    this.setState(prevState => ({
      character: {
        ...prevState.character,     // keep all other key-value pairs
        currentHealth: newCharacterHealth
      }
    }));
    if (newCharacterHealth === NUMBERS.BATTLE_GENERIC_ZERO_VALUE) {
      const message = STRINGS.BATTLE_LOG_MESSAGE_DEFEAT + this.state.npc.name;
      const color = STRINGS.BATTLE_LOG_COLOR_DANGER;
      // logs defeat
      this.handlePrependToBattleLog(message, color);
      // waits for setState to complete before saving battle
      this.setState(prevState => ({
        winner: prevState.npc.name
      }), this.handleSaveBattle);
    }
  };

  render() {
    return (
      <div className="battle-page page-container">
        <BattleResultsModal
            winner={this.state.winner}
            escapeSuccess={this.state.escapeSuccess}
            npcName={this.state.npc.name}
        />
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
                <CharacterCard character={this.state.character} potionCount={this.state.potions.length}/>
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
                <Button
                    className="inventory-button battle-button"
                    color="success"
                    onClick={this.handleUsePotion}
                >
                  {STRINGS.BATTLE_BUTTON_USE_POTION}
                </Button>
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
                <BattleLog battleLog={this.state.battleLog} />
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