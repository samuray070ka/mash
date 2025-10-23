import axios from "axios";

const token = localStorage.getItem("admin_access")

if (token)
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

export default axios