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

module.exports = {createUserWallet, getUserWalletBalance}
