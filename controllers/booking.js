const Listing=require("../models/listing.js");
require('dotenv').config();
const nodemailer = require('nodemailer');
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.emailUser,
        pass: process.env.emailPass,
    }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
      // Send email
      await transporter.sendMail({
        from: 'your-email@gmail.com',
        to,
        subject,
        text
      });
  
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

module.exports.bookingForm=async(req,res)=>{
    const id=req.params.id;
    const listing= await Listing.findById(id);
    console.log(listing);
    res.render("booking/booking.ejs",{listing});
};

module.exports.bookingConfirm=async (req, res) => {
    const id = req.params.id;
    const { name, email, date } = req.body;
    const listing= await Listing.findById(id);
    console.log(listing);
    try {
      // Save the booking details to the database or perform any other necessary actions
  
      // Send email
      await sendEmail(email, 'Booking Confirmation', `Dear ${name}, Your booking on HeavenHub for  ${listing.title} has been confirmed for ${date}.`);
  
      // Redirect the user to a thank you page or another appropriate page
      req.flash("success","Thank You For Booking");
      res.redirect('/listings');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Error processing booking');
    }
  };