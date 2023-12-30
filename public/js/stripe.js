import axios from 'axios';
import { showAlert } from './alerts';
// import { Stripe } from 'stripe';
const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}ß`);

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from endpoint
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
    console.log('session', session);

    window.location.replace(session.data.session.url);
  } catch (err) {
    showAlert("error",err);
  }
}