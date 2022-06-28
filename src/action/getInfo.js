import axios from "axios";

export const getInfo = async () => {
    try {
        const response = await axios.get(`https://arcane-inlet-03444.herokuapp.com//api/list`)
        alert(response.data.message)
    } catch (e) {
        console.log(e.response.data.message)
    }
}