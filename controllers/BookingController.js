import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

const getCheckoutSession = async (req, res) => {
  try {
    // get currently booked doctor

    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    // create a stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // console.log("Pying parties are : ",doctor,user);

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`, //after successfull payment, redirect to this URL
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.id,
      line_items: [
        {
          price_data: {
            currency: "INR",
            unit_amount: doctor.ticketPrice,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // console.log("alright 1");

    // create new booking
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    // console.log("boking si",booking);

    await booking.save();

    // console.log("Sending response");

    res.status(200).json({
      success: true,
      message: "successfully paid",
      session,
    });
  } catch (err) {
    res.status(500).json({
      success: true,
      message: { error: err.message, message: "Error while payment !!" },
    });
  }
};

export default getCheckoutSession;
