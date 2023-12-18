import axios from 'axios';
import { showAlert } from './alerts';

/**
 * type is either 'password' or 'data'
 * @param data
 * @param type
 * @returns {Promise<void>}
 */
export const updateSettings = async (data, type) => {
  const url = type === "password" ? "updateMyPassword" : "updateMe";

  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/api/v1/users/${url}`,
      data
    });

    if (res.data.status === "succes") {
      showAlert("success", `${type.toUpperCase()} updated successfully`);
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}