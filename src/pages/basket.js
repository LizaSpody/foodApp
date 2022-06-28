import {Component} from "react";
import axios from "axios";

class Basket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: this.props.order
        };
        this.addToBasket = this.addToBasket.bind(this);
        this.removeItemFromBasket = this.removeItemFromBasket.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.addToDb = this.addToDb.bind(this);
        this.total = this.total.bind(this);
    }

    total() {
        let order = JSON.parse(localStorage.getItem('cart'));
        let total = 0;
        order.forEach((item)=>{
            total = total + (Number(item.count) * Number(item.price))
        })
        return total
    }

    addToBasket(e) {
        let amount = e.target.closest('.amount').querySelector('.amount-item').innerHTML;
        let idItem = e.target.closest('.basket-item').getAttribute('id');
        let newOrder = this.props.order.map((item)=>{
          if(item.id === idItem) {
              item.count = Number(amount) + 1;
          }
          return item
        });
        this.props.changeOrder(newOrder);
    }

    removeItemFromBasket(e) {
        let amount = e.target.closest('.amount').querySelector('.amount-item').innerHTML;
        let idItem = e.target.closest('.basket-item').getAttribute('id');
        let newAmount = Number(amount - 1);
        if(newAmount <= 0) {
            newAmount = 0
        }
        let newOrder = this.props.order.filter((item)=>{
            if(item.id === idItem) {
                item.count = newAmount;
            }
            return item.count !== 0
        });
        this.props.changeOrder(newOrder);
    }

    deleteItem(e) {
        let idItem = e.target.closest('.basket-item').getAttribute('id');
        let newOrder = this.props.order.filter((item)=>{
            return !(item.id === idItem)
        });
        if(newOrder['0'] === undefined) {
            localStorage.removeItem('active');
            localStorage.removeItem('cart')
        }
        this.props.changeOrder(newOrder);
    }

    createOrder() {
        let block = this.props.order.map((item, id)=>{
                return <div id={item.id} className="basket-item" key={id}>
                    <div className="left">
                        <div className="delete"><span onClick={this.deleteItem}> X </span></div>
                        <div className="name">
                            {item.name}
                        </div>
                    </div>
                    <div className="right">
                        <div className="price">
                        {item.price}$
                    </div>
                        <div className="amount">
                            <div className="plus" onClick={this.addToBasket}>+</div>
                            <div className="amount-item" >{item.count}</div>
                            <div className="minus" onClick={this.removeItemFromBasket}>-</div>
                        </div>
                    </div>
                </div>
            })
        return block
    }

    addToDb() {
        let name = document.querySelector('input[name="name"]').value;
        let phone = document.querySelector('input[name="phone"]').value;
        let address = document.querySelector('input[name="address"]').value;
        let email = document.querySelector('input[name="email"]').value;
        let arr;
        if(localStorage.getItem('active')) {
            arr = this.props.item.filter((item)=>{
               return item._id === localStorage.getItem('active');
            })
        }
        let restaurant = arr['0']['name'];
        let order = localStorage.getItem('cart');
        let total = document.querySelector('.total span').innerHTML;
        axios.post(`https://arcane-inlet-03444.herokuapp.com/api/order`, { name, phone, address, email, restaurant, order, total })
            .then(res => {
                 let block = document.createElement('div');
                let body = document.querySelector('body');
                block.classList.add('overlay');
                let text = document.createElement('span');
                text.innerHTML = '<p>' + res.data.message + '</p>';
                if(res.data.errors) {
                    res.data.errors.errors.forEach((item)=>{
                        text.innerHTML += '<p>' + item.msg + '</p>'
                    })
                }
                else {
                    localStorage.removeItem('active')
                    localStorage.removeItem('cart')
                }
                block.innerHTML = '<div class="text-containet">' + text.innerHTML + '</div>'
                body.append(block);
                setTimeout(()=>{
                    block.remove();
                }, 2000)
            })
    }

    render() {
        let orderBlock = this.createOrder();
        if(this.props.order['0'] === undefined) {
            return (
                <section>
                    <div className="container">
                        your basket is empty
                    </div>
                </section>
            )
        }
        return (
            <section>
                <div className="container">
                    <div className="order-container">
                        <div className="info-client">
                            <input required type="text" name="name" placeholder="Name"/>
                            <input required type="tel" name="phone" placeholder="Phone"/>
                            <input required type="text" name="address" placeholder="Address"/>
                            <input required type="email" name="email" placeholder="Email"/>
                        </div>
                        <div className="order">
                            {orderBlock}
                            <div className="total">
                                Total: <span>{this.total()}</span>$
                            </div>
                        </div>
                    </div>
                    <button className="addToBasket" onClick={this.addToDb}>Add to Basket</button>
                </div>
            </section>
        )
    }
}

export default Basket;
