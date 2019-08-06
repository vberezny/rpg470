import React from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Input,
  InputGroup,
  Table
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
      restOfItem.push([key, item[key]]);
    });
    restOfItem = restOfItem.map((itemKey, index) => {
      return (
        <tr key={index}>
          <td>{restOfItem[index][0]}</td>
          <td>{restOfItem[index][1]}</td>
        </tr>
      );
    });

    return (
      <ListGroupItem key={index} className="shop-item-listgroup-item">
        <ListGroupItemHeading className="shop-item-listgroup-item-heading">
          {item.name}
        </ListGroupItemHeading>
        <Table>
          <tbody>
            {restOfItem}
          </tbody>
        </Table>
      </ListGroupItem>
    )
  });
  return (
    <ListGroup className="shop-item-list">
      {items}
    </ListGroup>
  );
}

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    // TODO: fetch for shop items
  }

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