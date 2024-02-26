import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
		<div className="inner">	
			<div className="top">
				<h1><div className="logo"></div></h1>
				<ul>
					<li><a href="">Policy</a></li>
					<li><a href="">Terms</a></li>
					<li><a href="">Family Site</a></li>
					<li><a href="">Sitemap</a></li>
				</ul>
			</div>	
			<div className="bottom">
				<address>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, facere. <br/>
					TEL : 031-111-1234  C.P : 010-1234-5678
				</address>
				<p>
					2024 BBANGKKEUT © copyright all right reserved.
				</p>
			</div>
		</div>
	</footer>
  );
};

export default Footer;