import {Component} from "react";

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [{}],
            activeItem: '',
            activeId: '',
            products: this.props.item.length > 0 ? this.props.item : 'Choose the restaurant'
        };

        this.changeProduct = this.changeProduct.bind(this);
        this.createList = this.createList.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.addToCart = this.addToCart.bind(this);
    }

    addToCart(i) {
        let id = i.target.closest('.item').getAttribute('data-id');
        let restaurantItem = this.state.products[id];
        let order = {
            id: id,
            name: restaurantItem['name'],
            count: 1,
            price: restaurantItem['price']
        }
        let fullOrder;
        if(this.props.order.some((item) => {return  item.id === order.id})) {
            fullOrder = this.props.order.map((item)=>{
                if(item.id === order.id) {
                    item.count = item.count + 1;
                }
                return item
            });
        }
        else {
            fullOrder = [order, ...this.props.order]
        }
        this.props.addToOrder(fullOrder);

        if (localStorage.getItem('active')) {
            return true
        }

        else {
            localStorage.setItem('active', this.state.activeId);
            let list =  document.querySelectorAll('.restaurant-list li');
            list.forEach((item) => {
                item.classList.add('deactive')
            })
        }
    }

    componentDidMount() {
        let arr;
        if(localStorage.getItem('active')) {
            arr = this.props.item.filter((item)=>{
                return item._id === localStorage.getItem('active')
            });
            if(arr['0']) {
                arr = arr['0']['products'];
                if(typeof this.state.products === "string") {
                    this.setState({products: arr})
                }
            }
            this.setState({products: arr})
        }
        else if(typeof arr === "string") {
            return arr
        }
    }

    createProduct() {
        let arr = this.state.products;
        if(!localStorage.getItem('active')) {
            if(!document.querySelectorAll('.restaurant-list li.active')) {
                console.log(document.querySelectorAll('li.active'))
                return 'fff'
            }
        }
        if(localStorage.getItem('active') && this.props.item && arr.length > 0 && typeof arr !== "string") {
            arr = this.props.item.filter((item)=>{
                return item._id === localStorage.getItem('active')
            });
            if(arr['0']['products']) {
                arr = arr['0']['products']
            }
        }
        else if(localStorage.getItem('active')) {
            arr = this.props.item.filter((item)=>{
                return item._id === localStorage.getItem('active')
            });
            if(arr['0'] === undefined) {
                return ''
            }
        else {
                arr = arr['0']['products']
            }
        }
        else if(typeof arr === "string") {
            return arr
        }
        else if(!localStorage.getItem('active') && arr['0']['_id']) {
            return 'Choose the restaurant'
        }
        return arr.map((item, id)=> {
            return <div data-id={id} key={id} className="item">
                <div className="picture">
                    <img src={item.picture} alt=""/>
                </div>
                <h3 className="name">{item.name}</h3>
                <div className="bottom">
                    <span>{item.price}$</span>
                    <button onClick={this.addToCart}>Add to basket</button>
                </div>
            </div>
        });
    }

    changeProduct(id, i) {
        if(id !== undefined && !localStorage.getItem('active')) {
            let list =  document.querySelectorAll('.restaurant-list li');
            list.forEach((item) => {
                item.classList.remove('active');
            })
            i.target.classList.add('active')
            let el = this.props.item.filter((item) => {
                return item._id === id
            })
            this.setState({products: el['0']['products'], activeId: id});
            return this.createProduct(el['0']['products'])
        }
        else if(!localStorage.getItem('active')) {
            return 'Choose restaurant'
        }
        else {
            console.log(localStorage.getItem('active'))
        }
        return 'jjj'
    }

    createList() {
        let restaurant = this.props.item;
        if(restaurant) {
            let name = restaurant.map((item) => {
                return {name: item.name, id: item._id}
            })
            return name.map((item)=>{
                return <li className={localStorage.getItem('active') ? localStorage.getItem('active') === item.id ? 'active' : 'deactive' : ''} onClick={(e)=> this.changeProduct(item.id, e)} key={item.id}  id={item.id} >{item.name}</li>
            })
        }
        else {
            return false
        }
    }

    render() {
        let list = this.createList();
        let products = this.createProduct();

        return (
            <section className="shop">
                <div className="container">
                    <div className="restaurant-list">
                        <ul>
                            {list}
                        </ul>
                    </div>
                    <div className="product">
                        {products}
                    </div>
                </div>
            </section>
        )
    }
}

export default Shop;