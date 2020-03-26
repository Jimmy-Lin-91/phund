const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');
const zipcodes = require('zipcodes');
const config = require('config');
const plaid = require('../../helpers/plaid');
const cookieRes = require('../../helpers/custom_res');
const { PythonShell } = require('python-shell');
const Borrower = require('../../models/Borrower');
const User = require('../../models/User');
const Completed_Loans = require('../../models/Completed_Loans');

//@route POST api/borrower/location
//@desc Determines borrower eligibility by state
//@access Private

router.post('/location', auth, async (req, res) => {
  //Check for body errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log('In the backend');
  try {
    //Connects user by id to borrow profile
    let user = await User.findOne({ _id: req.id }).select('-password');

    if (user.role.user == 'borrower') {
      return res
        .status(401)
        .json({ errors: 'User already has an active loan' });
    }

    const { zipcode } = req.body;
    let supported,
      maxAmount,
      maxLength,
      maxApr,
      restrictions = {};

    //Checks to see if state is supported and set the state paramets
    const requestState = zipcodes.lookup(zipcode).state;
    const supportedStates = config.get('LoanRegs');
    const states = Array.from(Object.keys(config.get('LoanRegs')));

    for (let i = 0; i < states.length; i++) {
      if (states[i] == requestState) {
        supported = true;
        let loanArray = Object.values(supportedStates[requestState]);
        maxAmount = loanArray[0];
        maxLength = loanArray[1];
        maxApr = loanArray[2];
      }
    }

    if (supported) {
      restrictions = {
        maxAmount: maxAmount,
        maxLength: maxLength,
        maxApr: maxApr,
        state: requestState
      };
    }

    cookieRes(res, user, restrictions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: 'Server Error' });
  }
});

//@route POST api/borrower/underwrite
//@desc Approves or Denies the applicant
//@access Private

router.post('/underwrite', auth, async (req, res) => {
  //Check for body errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let approved;

    let user = await User.findOne({ _id: req.id }).select('-password');

    const { amount, length, plaidAccessToken } = req.body;

    let plaidData = await plaid.getTransactions(plaidAccessToken);

    let options = {
      mode: 'text',
      pythonPath: '/usr/local/bin/python3',
      pythonOptions: ['-u'], // get print results in real-time
      scriptPath: './underwriting/',
      args: [plaidData, amount, length]
    };

    await PythonShell.run('underwriting.py', options, (err, results) => {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      approved = JSON.parse(results[0].toString());
    });

    if (approved) {
      res.cookiesResponse(user).json({
        approved: true,
        amount: amount,
        length: length
      });
      console.log('Underwriting Completed');
    } else {
      res.send('Borrower not approved');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/borrower/create
//@desc create loan paramaters
//@access Private
router.post('/create', async (req, res) => {
  //Check for body errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Connects user by id to borrow profile
  let user = await User.findById({ _id: req.user.id });

  //Build Loan
  const loan_Fields = {};

  //Receive loan amount, number of months, and zipcode from user
  const { loan_amount, months, approved, zipcode } = req.body;

  function designLoan(loan_amount, months, zipcode) {
    //Create Installment Dates
    let temp_date = new Date();
    let first_month;
    let first_year;
    if (temp_date.getDate() >= 19) {
      first_month = temp_date.getMonth() + 1;
      if (first_month === 0) {
        first_year = temp_date.getFullYear() + 1;
      } else {
        first_year = temp_date.getFullYear();
      }
    } else {
      first_month = temp_date.getMonth();
      first_year = temp_date.getFullYear();
    }

    const upcoming_date = new Date(first_year, first_month, 26);

    let installment_dates = [];
    installment_dates[0] = upcoming_date;

    for (i = 1; i < months; i++) {
      installment_dates[i] = new Date(
        upcoming_date.getFullYear(),
        upcoming_date.getMonth() + i,
        26
      );
    }

    //Create installment amount and total amount
    let installment_amount = [];

    for (i = 0; i < months; i++) {
      if (loan_amount % months != 0) {
        installment_amount[i] =
          Math.trunc((loan_amount / months + 10.01) * 100) / 100;
      } else {
        installment_amount[i] = loan_amount / months + 10;
      }
    }

    let original_total_amount = installment_amount.reduce(
      (total, amount) => total + amount
    );

    //Calculate APR
    let total_fees = original_total_amount - loan_amount;
    let apr = (total_fees / original_total_amount) * 100;

    //Populate loan fields for Borrower Profile
    loan_Fields.loan_amount = loan_amount;
    loan_Fields.months = months;
    loan_Fields.user = req.user.id;
    loan_Fields.original_total_amount =
      Math.trunc(original_total_amount * 100) / 100;
    loan_Fields.current_total_amount = loan_Fields.original_total_amount;
    loan_Fields.issue_date = Date.now();
    loan_Fields.balance = Math.trunc(original_total_amount * 100) / 100;
    loan_Fields.zipcode = zipcode;
    loan_Fields.approved = true;
    loan_Fields.borrower_status = true;
    loan_Fields.apr = parseFloat(apr.toFixed(2));
    loan_Fields.installment_amount = installment_amount;
    loan_Fields.upcoming_date = upcoming_date;
    loan_Fields.installment_dates = installment_dates;
    loan_Fields.name = user.name;
  }

  try {
    //Create borrower profile
    if (approved) {
      designLoan(loan_amount, months, zipcode);
      loan_Fields.issue_date = Date.now();
      let borrower = new Borrower(loan_Fields);
      //await borrower.save();
      res.json(borrower);
    } else {
      res.send('User not approved');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/borrower/update
//@desc update loan status from payments
//@access Private
router.put('/confirm', async (req, res) => {
  //Check for body errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const borrower = req.body.borrower;

  //Connects user by id to borrow profile
  let user = await User.findById({ _id: req.user.id });

  var confirm = true; //Temporary for now

  //Save borrower profile
  try {
    if (confirm) {
      borrower.issue_date = Date.now();
      await borrower.save();
      res.json(borrower);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route PUT api/borrower/update
//@desc update loan status from payments
//@access Private
router.put('/update', async (req, res) => {
  let borrower = await Borrower.findOne({ user: req.user.id });

  let payment = req.body.payment_successful;

  if (borrower) {
    if (payment) {
      borrower.amount_payed +=
        Math.trunc(borrower.installment_amount[0] * 100) / 100;
      borrower.amount_payed = Math.trunc(borrower.amount_payed * 100) / 100;
      borrower.installments_payed += 1;
      borrower.installment_dates.shift();
      borrower.balance =
        (Math.trunc(borrower.balance * 100) -
          Math.trunc(borrower.installment_amount[0] * 100)) /
        100;
      borrower.installment_amount.shift();

      //Move completed loans and loan info to cluster 'completed'
      if (borrower.balance === 0) {
        const completed_Fields = {};
        completed_Fields.issue_date = borrower.issue_date;
        completed_Fields.amount_payed = borrower.amount_payed;
        completed_Fields.missed_payments = borrower.missed_payments;
        completed_Fields.loan_amount = borrower.loan_amount;
        completed_Fields.months = borrower.months;
        completed_Fields.user = borrower.user;
        completed_Fields.installments_payed = borrower.installments_payed;
        completed_Fields.final_total_amount = borrower.current_total_amount;
        completed_Fields.apr = borrower.apr;
        completed_Fields.name = borrower.name;
        completed_Fields.kyc = borrower.kyc;
        completed_Fields.completed_date = Date.now();

        let completed = new Completed_Loans(completed_Fields);
        await completed.save();
        await borrower.delete();

        return res.json(completed);
      }
    } else {
      //Calculate missed payment info
      borrower.missed_payments += 1;
      if (borrower.installment_amount.length === 1) {
        borrower.installment_amount[0] += 10;
        borrower.installment_dates[1] = new Date(
          borrower.installment_dates[0].getFullYear(),
          borrower.installment_dates[0].getMonth() + 1,
          26
        );
        borrower.installment_dates.shift();
      } else {
        borrower.installment_amount[0] += borrower.installment_amount[1] + 10; //$10 fee for late payment
        borrower.installment_dates.shift();
        borrower.installment_amount.pop();
      }
      borrower.balance = Math.trunc(borrower.balance * 100 + 1000) / 100; //Update balance with late fee
      borrower.current_total_amount += 10;
      let total_fees = borrower.current_total_amount - borrower.loan_amount;
      borrower.apr = (total_fees / borrower.original_total_amount) * 100;
      borrower.apr = parseFloat(borrower.apr.toFixed(2));
    }
  } else {
    return res.send('Borrower does not exist');
  }

  try {
    res.json(borrower);
    await borrower.save();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
