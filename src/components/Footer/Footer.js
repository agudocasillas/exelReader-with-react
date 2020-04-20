import React from 'react';
import epam_logo from '../../assets/epam-logo.svg';
import './Footer.scss';

function Footer() {
  return (
		<section className='footer'>
      <img src={epam_logo} className='epam_logo ml-auto mr-2' alt='epam logo' width='100px' />
      Parking Application Management version 1.0
		</section>
    
  );
}

export default Footer;
