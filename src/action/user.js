import axios from "axios";

export const registration = async (email, phone) => {
    try {
        const response = await axios.post(`https://arcane-inlet-03444.herokuapp.com//api/auth/registration`, {
            email,
            phone
        });
        alert(response.data.message)
    } catch (e) {
        console.log(e.response.data.message)
    }
}