import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Accounts from './Pages/Accounts';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Wallet from './Pages/Wallet';
import BTC from './Components/BTC';
import ETH from './Components/ETH';
import XRP from './Components/XRP';
import NFT from './Components/NFT';
import Tokens from './Components/TOK';
import { useAuthContext } from './Context/AuthContext';
import PasswordRecover from './Pages/ForgotPassword';
import OTP from './Pages/OTP';
import ResetPasswword from './Pages/ResetPassword';

const App = () => {

	const {user} = useAuthContext()

	return (
		<>
			{
				user === null
				?
				<Routes>
					<Route path="/login" exact element={<Login />} />
					<Route path="/recover" exact element={<PasswordRecover />} />
					<Route path="/otp" exact element={<OTP />} />
					<Route path="/reset" exact element={<ResetPasswword />} />
				</Routes>
				:
				<Routes>
					<Route path="/" exact element={<Landing />} >
						<Route path="/accounts" element={<Accounts />} >
							<Route path="/accounts" element={<BTC />} />
							<Route path="/accounts/BTC" element={<BTC />} />
							<Route path="/accounts/ETH" element={<ETH />} />
							<Route path="/accounts/XRP" element={<XRP />} />
							<Route path="/accounts/NFT" element={<NFT />} />
							<Route path="/accounts/TOK" element={<Tokens />} />
						</Route>
						<Route path="/wallet" exact element={<Wallet />} />
					</Route>
				</Routes>
			}
		</>
	);
}

export default App;