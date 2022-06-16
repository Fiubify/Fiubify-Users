const axios = require("axios")

const createUserWallet = async () => {
  var response
  try {
    response = await axios.post("https://fiubify-payments-staging.herokuapp.com/wallets/", {})
  } catch (error) {
    console.log(error)
    return
  }

  return response.data.address
}

module.exports = {createUserWallet}
