import React, { useState, useEffect } from 'react';
import Container from '../Container';
import Report from '../Report';
import { getDuration } from '../../utils/momentAPI';
import FileConverter from '../../utils/FileConverter';

const Reports = () => {
  const [time, setTime] = useState({});
  useEffect(() => {
    // console.log(time);
  }, [time]);

  const updateTime = (data) => {
    setTime(data);
  };

  // let start = '01/02/2020 07:38';
  // let end = '01/03/2020 08:02';
  // console.log(getDuration(start, end));

	return (
		<Container>
			<h2>Reports</h2>
      <FileConverter updateTime={updateTime} />
      { Object.keys(time).length > 0
        && <Report data={time} />
      }
		</Container>
	);
}

export default Reports;