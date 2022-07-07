const axios = require("axios")

const axget = async (url) => {
    return axios
        .get(url)
        .then(data => {return data.data})
        .catch(err => {return err})
}

const axpost = async (url, data) => {
    return axios
        .post(url, data)
        .then(data => {return data.data})
        .catch(err => {return err})
}

const main = async () => {
    let data
    
    const readline = require("readline-sync");
    const user1 = {username : "admin", password : "test"}
    const user2 = {username : "akash", password : "test123"}
    const u1id = "2268b31c-2239-4280-9414-e98f166c94c0"
    const u2id = "69906b1e-ddb4-471f-a2ee-6a435eaa879b"
    
    text = 
    `
        Enter The Task To Be Executed :
        1. SignUp
        2. Login
        3. Logout
        4. View Balance
        5. View Transactions
        6. View Ethereum Wallet Balance
        7. Transfer ETH
        8. View Ethereum Wallet History
        9. View Bitcoin Wallet Balance
        10. Transfer BTC
        11. View Bitcoin Wallet History
        12. View Ripple Wallet Balance
        13. Transfer XRP
        14. View Ripple Wallet History
        Any Other Input To Exit
    `
    console.log(text)

    switch(readline.question()){

        case "1" :
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/auth/signup", user1)
            else
                data = await axpost("http://127.0.0.1:5000/api/auth/signup", user2)
            break
            
        case "2" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/auth/login", user1)
            else
                data = await axpost("http://127.0.0.1:5000/api/auth/login", user2)
            break
            
        case "3" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/auth/logout", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000/api/auth/logout", {uid : u2id})
            break
            
        case "4" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000//api/wallet/balance", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000//api/wallet/balance", {uid : u2id})
            break

        case "5" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/wallet/history", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000/api/wallet/history", {uid : u2id})
            break

        case "6" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/eth/balance", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000/api/eth/balance", {uid : u2id})
            break

        case "7" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/eth/transfer", {uid_payer : u1id, uid_payee : u2id, value : 0.000001})
            else
                data = await axpost("http://127.0.0.1:5000/api/eth/transfer", {uid_payer : u2id, uid_payee : u1id, value : 0.000001})
            break

        case "8" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/eth/history", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000/api/eth/history", {uid : u2id})
            break

        case "9" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/btc/balance", {uid : u1id})
            else            
                data = await axpost("http://127.0.0.1:5000/api/btc/balance", {uid : u2id})
            break

        case "10" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/btc/transfer", {uid_payer : u1id, uid_payee : u2id, value : 0.000001})
            else            
                data = await axpost("http://127.0.0.1:5000/api/btc/transfer", {uid_payer : u2id, uid_payee : u1id, value : 0.000001})            
            break

        case "11" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/btc/history", {uid : u1id})
            else
                data = await axpost("http://127.0.0.1:5000/api/btc/history", {uid : u2id})
            break

        case "12" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/xrp/balance", {uid : u1id})
            else            
                data = await axpost("http://127.0.0.1:5000/api/xrp/balance", {uid : u2id})
            break

        case "13" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/xrp/transfer", {uid_payer : u1id, uid_payee : u2id, value : 10})
            else
                data = await axpost("http://127.0.0.1:5000/api/xrp/transfer", {uid_payer : u2id, uid_payee : u1id, value : 10})            
            break

        case "14" : 
            console.log(
                `
                Select User : 
                1. User1 -> Username : admin
                2. User2 -> Username : akash
                `
            )
            if(readline.question() === "1")
                data = await axpost("http://127.0.0.1:5000/api/xrp/history", {uid : u1id})
            else            
                data = await axpost("http://127.0.0.1:5000/api/xrp/history", {uid : u2id})
            break

        default : 
            console.log("EXIT")
            break
    }
    
    console.log(data)
}

main()