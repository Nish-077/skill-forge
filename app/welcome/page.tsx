"use client";

import Link from "next/link";
import { IoLogoGoogle, IoLogoLinkedin, IoLogoGithub } from "react-icons/io";
const Welcome = () => {
	return (
		<div className="container">
			<div className="stars"></div>
			<div className="twinkling"></div>
			<div className="leftPane ">
				<div className="content pr-10">
					<h1 className="text-8xl pb-10 text-left">
						Welcome to the Galaxy of Learning!
					</h1>
					<h2 className="text-3xl text-left">
						Join us and explore new frontiers in education.
					</h2>
					  <h2>Sign in with</h2>
					<div className="flex gap-6 pb-5 py-6 justify-center">
						{/* Section for icons */}

						<IoLogoGoogle className="text-5xl cursor-pointer hover:text-green-600 transform transition duration-500 ease-in-out hover:scale-110" />
						<IoLogoLinkedin className="text-5xl cursor-pointer hover:text-blue-400 transform transition duration-500 ease-in-out hover:scale-110" />
						<IoLogoGithub className="text-5xl cursor-pointer hover:text-gray-500 transform transition duration-500 ease-in-out hover:scale-110" />
					</div>
				</div>
			</div>
			<div className="rightPane">
				<div className="formContainer">
					<h2 className="text-3xl py-8">May the code be with you</h2>
					<div className = 'pb-10'>
						<a href="/login"> <button className="bg-green-700 bg-opacity-30 border-green w-80 h-20 text-lg hover: transform transition duration-500 ease-in-out hover:scale-110">Login</button></a>
						</div>
						<div className=''>
 						 <a href="signup"><button className="bg-blue-700 w-80 h-20 bg-opacity-40 text-lg text-white hover: transform  transition duration-500 ease-in-out hover:scale-110">Sign Up</button></a>
						</div>

						

					
				</div>
			</div>
			<style jsx>{`
				@keyframes move-twink-back {
					from {
						background-position: 0 0;
					}
					to {
						background-position: -10000px 5000px;
					}
				}
				@keyframes move-twink-front {
					from {
						background-position: 0 0;
					}
					to {
						background-position: 10000px 5000px;
					}
				}
				.container {
					position: relative;
					height: 100vh;
					overflow: hidden;
					display: flex;
					background: #000;
					color: white;
				}
				.stars,
				.twinkling {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					display: block;
				}
				.stars {
					background: transparent url("/stars.png") repeat top center;
					z-index: 0;
				}
				.twinkling {
					background: transparent url("/twinkling.png") repeat top center;
					animation: move-twink-back 200s linear infinite;
					z-index: 1;
				}
				.leftPane,
				.rightPane {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 2;
				}
				.leftPane {
					background: rgba(255, 255, 255, 0.1);
					
					padding: 2rem;
					text-align: center;
					position: relative;
				}
				.rightPane {
					background: rgba(0, 0, 0, 0.7);
					backdrop-filter: blur(10px);
					padding: 2rem;
				}
				.content {
					max-width: 80%;
				}
				.backgroundImage {
					width: 100%;
					height: auto;
					margin-top: 1rem;
					border-radius: 10px;
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
				}
				.formContainer {
					width: 80%;
					max-width: 400px;
					text-align: center;
				}
				.title {
					margin-bottom: 2rem;
				}
				.message {
					margin-bottom: 1.5rem;
				}
				.switchPage {
					margin-top: 1rem;
				}
				.switchPage a {
					color: #667eea;
					text-decoration: none;
				}
				.switchPage a:hover {
					text-decoration: underline;
				}
			`}</style>
		</div>
	);
};

export default Welcome;
