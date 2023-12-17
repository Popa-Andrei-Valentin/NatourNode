import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:3000/api/v1/users/login`,
      data: {
        email,
        password
      }
    });
    console.log(res);
    if (res.data.status === "succes") { // TODO: Fix 'succes' status typo.
      showAlert("success","Logged in successfully !")
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });

    if (res.data.status === 'success') { // TODO: Fix 'succes' status typo.
      location.reload(true);
    }
  } catch(err) {
    showAlert("error", "Error logging out ! Try again.")
  }
}