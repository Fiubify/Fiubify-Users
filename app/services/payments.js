const axios = require("axios")

const createUserWallet = async () => {
  var response
  try {
    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallet/", {})
  } catch (error) {
    console.log(`Error in wallet creation: ${error}`)
    return
  }

  return response.data.data.address
}

const getUserWalletBalance = async (wallet_address) => {
  var response
  try {
    response = await axios.get(`https://fiubify-payments-staging.herokuapp.com/wallet/${wallet_address}`)
  } catch (error) {
    console.log(`Error fetching wallet balance: ${error}`)
    return
  }

  return response.data.data.balance
}

const createPayment = async (from_address, amount) => {
  var response

  try {
    const request = {
      from_address: from_address,
      amount: amount
    }

    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallet/payment", request)
  } catch (error) {
    console.log(`Error executing payment: ${error}`)
    return
  }

  return response.data
}

const createTransaction = async (from_address, to_address, amount) => {
  var response
  try {
    const request = {
      from_address: from_address,
      to_address: to_address,
      amount: amount
    }

    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallet/transaction", request)
  } catch (error) {
    console.log(`Error creating transaction: ${error}`)
    return
  }

  return response.data
}

const createWithdrawal = async (from_address, to_address, amount) => {
  var response
  try {
    const request = {
      from_address: from_address,
      to_address: to_address,
      amount: amount
    }

    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallet/withdrawal", request)
  } catch (error) {
    console.log(`Error withdrawing: ${error}`)
    return
  }

  return response.data
}

module.exports = {createUserWallet, getUserWalletBalance, createPayment, createTransaction, createWithdrawal}
