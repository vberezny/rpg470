import React from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Input,
  Table,
  Button
} from 'reactstrap';
import {
  STRINGS
} from '../../Constants/ShopConstants';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Shop.scss';

function ShopItemList(props) {
  const items = props.items.map((item, index) => {
    let restOfItem = [];
    Object.keys(item).forEach(key => {
      if (key !== 'id' && key !== 'name') {
        let newKey;
        if (key === 'magicDamage') {
          newKey = 'Magic attack';
        } else if (key === 'magicDefense') {
          newKey = 'Magic defense';
        } else {
          newKey = key;
        }
        newKey = newKey[0].toUpperCase() + newKey.slice(1, newKey.length);
        restOfItem.push([newKey, item[key]]);
      }
    });
    restOfItem = restOfItem.map((itemKey, index) => {
      return (
        <tr key={index}>
          <td className="shop-item-listgroup-item-text">{restOfItem[index][0]}</td>
          <td className="shop-item-listgroup-item-text">{restOfItem[index][1]}</td>
        </tr>
      );
    });

    return (
      <ListGroupItem key={index} className="shop-item-listgroup-item">
        <ListGroupItemHeading className="shop-item-listgroup-item-heading shop-item-listgroup-item-text">
          {item.name}
        </ListGroupItemHeading>
        <div className="stop-item-listgroup-item-container">
          <Table className="shop-item-listgroup-item-table">
            <tbody>
              {restOfItem}
            </tbody>
          </Table>
          <div className="shop-item-listgroup-item-buy-container">
            <Input placeholder="How many?" type="number" className="shop-item-listgroup-item-buy-input"/>
            <Button onClick={props.handleBuy} color="primary" className="shop-item-listgroup-item-buy-button">
              {STRINGS.SHOP_PAGE_BUY_BUTTON_MSG}
            </Button>
          </div>
        </div>
      </ListGroupItem>
    )
  });
  return (
    <ListGroup className="shop-item-list">
      {items}
    </ListGroup>
  );
}

ShopItemList.propTypes = {
  items: PropTypes.array,
  handleBuy: PropTypes.func
};

class Shop extends React.Component {
  // TODO: Shop State for actual shopping

  render () {
    const mockShopItems = [
      {
        id: 1,
        name: 'Sword',
        damage: 3,
        magicDamage: 0
      },
      {
        id: 5,
        name: 'Chest Plate',
        defense: 5,
        magicDefense: 0
      }
    ];

    return (
      <div className="shop-page page-container">
        <CustomNavbar />
        {/*TODO: Change CSS such that we don't need this full-viewport-with-navbar class - use flexbox page-containers instead*/}
        <div className="shop-centered-content full-viewport-with-navbar centered content container">
          <h1 className="shop-header-text">{STRINGS.SHOP_PAGE_HEADER_MSG}</h1>
          <div className="shop-item-list-container container">
            <ShopItemList items={mockShopItems}/>
          </div>
        </div>
      </div>
    );
  }
}

Shop.propTypes = {

};

export default Shop;