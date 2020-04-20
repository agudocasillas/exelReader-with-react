import React, { Fragment } from 'react';
import { getWorkDays } from '../../utils/momentAPI';

import Table from '../Table';

class Report extends React.Component {

	processData = (data) => {

		return Object.entries(data).reduce((acc, [name, details]) => {
			let employee = [];
			const [tagCard, employeeName] = name.split('|');
			employee.push(
				employeeName,
				tagCard,
				data[name].daysOfMonth,
				parseFloat(data[name].totalHoursMonth.split(':')[0]),
				JSON.stringify(data[name].daysDetails),
				);
			acc.push(employee);
			return acc;
		}, []);
	};

	render (){
		const [month, ,year] = Object.keys(Object.values(this.props.data)[0].daysDetails)[0].split('/');
		const workDays = getWorkDays(month, year);
		const minimum = Math.floor((workDays * 9) * 0.8);
		const lowest = Math.floor((workDays * 9) * 0.5);

		return(
			<Fragment>
				<h2>By month</h2>
				<Table data={this.processData(this.props.data)} month={month} workdays={workDays} minimum={minimum} lowest={lowest} />
			</Fragment>
		);
	}
}

export default Report;