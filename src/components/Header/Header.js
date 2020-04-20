import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from '@fortawesome/free-solid-svg-icons'
import menu_button from '../../assets/menu_button.svg';
import './Header.scss';

class Header extends React.Component {

  render (){
		return(
			<div className='header'>
				<div className='float-left header__car--icon'>
					<a href='#'>
						<FontAwesomeIcon icon={faCar} />
						<p className='header__title'>Parking <span className='header__title__subtitle'>Application Management</span></p>
					</a>
				</div>

				<div className='float-right'>
					<img src={menu_button} className='menu_buton ml-auto' alt='menu' />
				</div>
			</div>

		)
	}
}

export default Header;
