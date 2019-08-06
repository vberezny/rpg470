import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Input,
  Table
} from 'reactstrap';
import {Link} from 'react-router-dom';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import CustomSelectionModal from '../CustomSelectionModal/CustomSelectionModal';
import CustomToast from '../CustomToast/CustomToast';
import {
  STRINGS
} from '../../Constants/HomeConstants';
import {
  GLOBAL_URLS,
  GLOBAL_STRINGS
} from '../../Constants/GlobalConstants';
import {
  ASSET_NAMES,
  ASSET_ENDPOINTS
} from '../../Constants/AssetsConstants';
import './Home.scss';

function SelectCharacterModal(props) {
  let characters;
  if (props.characters.length > 0) {
    characters = props.characters.map((character, index) => {
      const characterLevel = character.level ? character.level.toString() : null;
      return (
        <div className="select-character-card-wrapper" key={index}>
          <Card className="">
            <CardImg className="cardimg" src={ASSET_ENDPOINTS[ASSET_NAMES.PRINCESS_AVATAR]} />
            <CardBody className="cardbody">
              <CardTitle className="cardtitle cardtext-color">{character.name}</CardTitle>
              <CardSubtitle className="cardsubtitle">{STRINGS.HOME_LEVEL_MSG + characterLevel}</CardSubtitle>
            </CardBody>
          </Card>
          <div className="select-character-label-wrapper">
            <Input id={character.name} type="radio" name="character-select" onChange={props.handleChangeCharacterSelection}/>
          </div>
        </div>
      );
    });
  } else {
    characters = <div>
      <p className="select-character-modal-no-characters-msg">{STRINGS.HOME_SELECT_CHARACTER_MODAL_NO_CHARACTERS_MSG_PT_1}</p>
      <p className="select-character-modal-no-characters-msg">{STRINGS.HOME_SELECT_CHARACTER_MODAL_NO_CHARACTERS_MSG_PT_2}</p>
    </div>
  }

  const modalHeader = (
    <div className="select-character-modal-header">{STRINGS.HOME_SELECT_CHARACTER_MODAL_HEADER_MSG}</div>
  );
  const modalBody = (
    <div className="select-character-modal-card-container card-container">{characters}</div>
  );
  const modalFooter = (
      <Link to="/createcharacter">
        <Button color="primary" className="select-character-modal-footer-button">
          {STRINGS.HOME_SELECT_CHARACTER_MODAL_CREATE_BUTTON_MSG}
        </Button>
      </Link>
  );
  return (
    <CustomSelectionModal
      modalHeader={modalHeader}
      modalBody={modalBody}
      modalFooter={modalFooter}
      selectionButtonText={STRINGS.HOME_SELECT_CHARACTER_MODAL_SELECT_BUTTON_MSG}
      className="select-character-modal"
      isOpen={!props.isCharacterSelected}
      selectButtonDisabled={!props.characterSelection}
      onSelect={() => props.handleConfirmCharacterSelection(props.characterSelection)}
    />
  );
}

SelectCharacterModal.propTypes = {
  characters: PropTypes.array,
  characterSelection: PropTypes.string,
  handleChangeCharacterSelection: PropTypes.func,
  handleConfirmCharacterSelection: PropTypes.func
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCharacters: [],
      allNPCs: [],
      character: {
        name: '',
        level: null,
        health: null,
        attack: null,
        defense: null,
        magic_attack: null,
        magic_defense: null
      },
      characterSelection: ''
    };
  }

  async componentDidMount() {
    const responseCharacters = await fetch(GLOBAL_URLS.GET_API_CHARACTERS);
    const responseNPCs = await fetch(GLOBAL_URLS.GET_API_NPCS);
    const bodyCharacters = await responseCharacters.json();
    const bodyNPCs = await responseNPCs.json();
    if (bodyCharacters) {
      const allCharacters = bodyCharacters[GLOBAL_STRINGS.CHARACTER_API_RESPONSE_INDEX];
      this.setState({
        allCharacters
      });
      allCharacters.forEach(character => {
        if (character.name === this.props.currentCharacterName) {
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
    }
  }

  handleChangeCharacterSelection = (event) => {
    const characterSelection = event.target.id;
    this.setState({
      characterSelection
    });
  };

  renderMiniCharacterOverview = () => {
    const miniCharOverviewHeader = this.state.character.name ? STRINGS.HOME_MINI_CHAR_OVERVIEW_HEADER_MSG + `${this.state.character.name}!` : null;
    const characterLevel = this.state.character.level ? this.state.character.level.toString() : null;

    return (
      <div className="mini-char-overview showcase-container container">
        <div className="mini-char-overview-header-wrapper">
          <h2 className="mini-char-overview-header">{miniCharOverviewHeader}</h2>
          <CustomToast
            isSuccess
            isOpen={this.props.showCharacterNewlyCreatedToast}
            handleClose={this.props.handleCloseCharacterNewlyCreatedToast}
            toastHeader={STRINGS.HOME_MINI_CHAR_OVERVIEW_NEW_CHAR_TOAST_HEADER_MSG}
            toastBody={STRINGS.HOME_MINI_CHAR_OVERVIEW_NEW_CHAR_TOAST_BODY_MSG}
          />
        </div>
        <div className="mini-char-overview-content">
          <Card className="mini-char-overview-card">
            <div className="mini-char-overview-wrapper">
              <div className="mini-char-overview-intro-flex-container overview-intro-flex-container">
                <div className="mini-char-overview-intro overview-intro">
                  <CardImg className="mini-char-overview-cardimg cardimg"
                           src={/* TODO: Proper character avatar */ ASSET_ENDPOINTS[ASSET_NAMES.PRINCESS_AVATAR]}/>
                  <CardBody className="mini-char-overview-cardbody cardbody">
                    <CardTitle className="mini-char-overview-cardtitle cardtitle cardtext-color">{this.state.character.name}</CardTitle>
                    <CardSubtitle className="mini-char-overview-cardsubtitle cardsubtitle">{STRINGS.HOME_LEVEL_MSG + characterLevel}</CardSubtitle>
                  </CardBody>
                </div>
              </div>
              <div className="mini-char-overview-stats overview-stats">
                <Table>
                  <thead>
                  <tr>
                    <th>{STRINGS.HOME_MINI_CHAR_OVERVIEW_STAT_MSG}</th>
                    <th>{STRINGS.HOME_MINI_CHAR_OVERVIEW_VALUE_MSG}</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>{STRINGS.HOME_MINI_CHAR_OVERVIEW_HEALTH_STAT_MSG}</td>
                    <td>{this.state.character.health}/{this.state.character.health}</td>
                  </tr>
                  <tr>
                    <td>{STRINGS.HOME_MINI_CHAR_OVERVIEW_ATTACK_STAT_MSG}</td>
                    <td>{this.state.character.attack}</td>
                  </tr>
                  <tr>
                    <td>{STRINGS.HOME_MINI_CHAR_OVERVIEW_DEFENSE_STAT_MSG}</td>
                    <td>{this.state.character.defense}</td>
                  </tr>
                  <tr>
                    <td>{STRINGS.HOME_MINI_CHAR_OVERVIEW_MAGIC_ATTACK_STAT_MSG}</td>
                    <td>{this.state.character.magic_attack}</td>
                  </tr>
                  <tr>
                    <td>{STRINGS.HOME_MINI_CHAR_OVERVIEW_MAGIC_DEFENSE_STAT_MSG}</td>
                    <td>{this.state.character.magic_defense}</td>
                  </tr>
                  </tbody>
                </Table>
              </div>
              <div className="overview-clear"/>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  renderBattleShowcase = () => {
    const npcCards = this.state.allNPCs.map((npcData, index) => {
      const npcLevel = npcData.level ? npcData.level.toString() : null;
      return (
        <Card key={index} className="battle-npc-card">
           {/*TODO: figure out correct avatars*/}
          <CardImg className="battle-npc-cardimg cardimg" src={ASSET_ENDPOINTS[npcData.name]}/>
          <CardBody className="battle-npc-cardbody cardbody">
            <div className="battle-npc-cardtitle-wrapper cardtitle-wrapper">
              <CardTitle className="battle-npc-cardtitle cardtitle cardtext-color">{npcData.name}</CardTitle>
              <CardSubtitle className="battle-npc-cardsubtitle cardsubtitle">{STRINGS.HOME_LEVEL_MSG + npcLevel}</CardSubtitle>
            </div>
            <CardText className="battle-npc-cardtext cardtext cardtext-color">{npcData.description}</CardText>
            <Link to={{
              pathname: '/battle',
              state: {
                isNPCSelected: true,
                npcSelection: npcData.name
              }
            }}>
              <Button color="primary" className="battle-npc-button cardbutton">{STRINGS.HOME_BATTLE_SHOWCASE_CARD_BUTTON_MSG}</Button>
            </Link>
          </CardBody>
        </Card>
      );
    });

    return (
      <div className="battle-showcase showcase-container container">
        <h3>{STRINGS.HOME_BATTLE_SHOWCASE_TITLE_MSG}</h3>
        <div className="battle-content">
          <h4>{STRINGS.HOME_BATTLE_SHOWCASE_SUBTITLE_MSG}</h4>
          <div className="battle-npcs card-container">
            {npcCards}
          </div>
        </div>
      </div>
    );
  };

  renderExploreShowcase = () => {
    // TODO: Fetch explore maps and map them to map cards instead of using mock data
    const mockMaps = [
      {
        mapTitle: 'Grasslands',
        mapText: 'Some text about this map',
        mapImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.GRASS_MAP]
      },
      {
        mapTitle: 'Grasslands',
        mapText: 'Some text about this map',
        mapImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.GRASS_MAP]
      },
      {
        mapTitle: 'Grasslands',
        mapText: 'Some text about this map',
        mapImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.GRASS_MAP]
      }
    ];

    const exploreMapCards = mockMaps.map((mapData, index) => {
      return (
        <Card key={index} className="explore-map-card">
          <CardImg className="explore-map-cardimg cardimg" src={mapData.mapImgSrc}/>
          <CardBody className="explore-map-cardbody cardbody">
            <CardTitle className="explore-map-title cardtitle cardtext-color">{mapData.mapTitle}</CardTitle>
            <CardText className="explore-map-text cardtext cardtext-color">{mapData.mapText}</CardText>
            <Button color="primary" className="explore-map-button cardbutton">{STRINGS.HOME_EXPLORE_SHOWCASE_MAP_CARD_BUTTON_MSG}</Button>
          </CardBody>
        </Card>
      );
    });

    // TODO: Fetch explore shop items and map them to shop item cards instead of using mock data
    const mockShopItems = [
      {
        shopItemTitle: 'Potion',
        shopItemSubtitle: 'Costs 5 gold',
        shopItemText: 'Some text about this item',
        shopItemImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.BLUE_POTION]
      },
      {
        shopItemTitle: 'Potion',
        shopItemSubtitle: 'Costs 5 gold',
        shopItemText: 'Some text about this item',
        shopItemImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.BLUE_POTION]
      },
      {
        shopItemTitle: 'Potion',
        shopItemSubtitle: 'Costs 5 gold',
        shopItemText: 'Some text about this item',
        shopItemImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.BLUE_POTION]
      },
      {
        shopItemTitle: 'Potion',
        shopItemSubtitle: 'Costs 5 gold',
        shopItemText: 'Some text about this item',
        shopItemImgSrc: ASSET_ENDPOINTS[ASSET_NAMES.BLUE_POTION]
      }
    ];

    const exploreShopItemCards = mockShopItems.map((shopItemData, index) => {
      return (
        <Card key={index} className="explore-shop-card">
          <CardImg className="explore-shop-cardimg cardimg" src={shopItemData.shopItemImgSrc}/>
          <CardBody className="explore-shop-cardbody cardbody">
            <div className="explore-shop-cardtitle-wrapper cardtitle-wrapper">
              <CardTitle
                className="explore-shop-cardtitle cardtitle cardtext-color">{shopItemData.shopItemTitle}</CardTitle>
              <CardSubtitle
                className="explore-shop-cardsubtitle cardsubtitle">{shopItemData.shopItemSubtitle}</CardSubtitle>
            </div>
            <CardText className="explore-shop-text cardtext cardtext-color">{shopItemData.shopItemText}</CardText>
            <Button color="primary" className="explore-shop-button cardbutton">{STRINGS.HOME_EXPLORE_SHOWCASE_SHOP_CARD_BUTTON_MSG}</Button>
          </CardBody>
        </Card>
      );
    });

    return (
      <div className="explore-showcase showcase-container container">
        <h3>{STRINGS.HOME_EXPLORE_SHOWCASE_TITLE_MSG}</h3>
        <div className="explore-content">
          <h4>{STRINGS.HOME_EXPLORE_SHOWCASE_MAP_SUBTITLE_MSG}</h4>
          <div className="explore-maps card-container">
            {exploreMapCards}
          </div>
          <h4>{STRINGS.HOME_EXPLORE_SHOWCASE_SHOP_SUBTITLE_MSG}</h4>
          <div className="explore-shop card-container">
            {exploreShopItemCards}
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="home-page page-container">
        <CustomNavbar handleLogout={this.props.handleUnauthenticate}/>
        <div className="home-page-content content container">
          <SelectCharacterModal
            characters={this.state.allCharacters}
            characterSelection={this.state.characterSelection}
            isCharacterSelected={this.props.isCharacterSelected}
            handleChangeCharacterSelection={this.handleChangeCharacterSelection}
            handleConfirmCharacterSelection={this.props.handleConfirmCharacterSelection}
          />
          {this.renderMiniCharacterOverview()}
          {this.renderBattleShowcase()}
          {this.renderExploreShowcase()}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  showCharacterNewlyCreatedToast: PropTypes.bool,
  isCharacterSelected: PropTypes.bool,
  currentCharacterName: PropTypes.string,
  handleCloseCharacterNewlyCreatedToast: PropTypes.func,
  handleConfirmCharacterSelection: PropTypes.func,
  handleUnauthenticate: PropTypes.func,
};

export default Home;