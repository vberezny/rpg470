import React from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Input,
  InputGroup
} from 'reactstrap';
import CustomNavbar from '../CustomNavbar/CustomNavbar';
import './Shop.scss';

function ShopItemList(props) {
  const items = props.items.map((item, index) => {
    return (
      <ListGroupItem key={index}>
      </ListGroupItem>
    )
  });
  return (
    <ListGroup>
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

    ];

    return (
      <div className="shop-page page-container">
        <CustomNavbar />
        {/*TODO: Change CSS such that we don't need this full-viewport-with-navbar class - use flexbox page-containers instead*/}
        <div className="shop-centered-content full-viewport-with-navbar centered content container">
          <h1 className="shop-header-text">Shop</h1>
          <div className-="shop-item-list-container container">
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