import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Shop from "./pages/shop";
import {Component} from "react";
import Basket from "./pages/basket";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            order: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
        }
        this.changeOrder = this.changeOrder.bind(this);
        this.count = this.count.bind(this);
    }

    componentDidMount() {
        fetch("https://arcane-inlet-03444.herokuapp.com/api/list")
            .then( res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    changeOrder(arr) {
        if(arr.length === 0) {
            localStorage.removeItem('cart')
            localStorage.removeItem('active')
        }
        else {
            localStorage.setItem('cart', JSON.stringify(arr));
        }
        this.setState({order: arr})
    }

    count() {
        if(localStorage.getItem('cart') === undefined || localStorage.getItem('cart') === null) {
            return false
        }
        let arr = JSON.parse(localStorage.getItem('cart'));
        let count = 0;
        console.log(arr)
        arr.forEach((item)=>{
            count = Number(count) + Number(item.count);
        })
        return <span>{count}</span>
    }

    render() {

        return (
            <BrowserRouter>
                <header>
                    <div className="container">
                        <div className="navigator">
                            <Link to="/">Shop</Link> |{" "}
                            <Link to="basket">Basket {this.count()}</Link>
                        </div>
                    </div>
                </header>
                <Routes>
                    <Route path="/" element={<Shop addToOrder={this.changeOrder} order={this.state.order} item={this.state.items} />}/>
                    <Route path="/basket" element={<Basket changeOrder={this.changeOrder} order={this.state.order} item={this.state.items} />}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App;
