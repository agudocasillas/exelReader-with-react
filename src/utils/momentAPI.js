import moment from 'moment';

export const getDuration = (start, end) => {
  const duration = moment(end).diff(moment(start));
  const formatted = moment.utc(duration).format('D HH:mm');
  const [days, time] = formatted.split(' ');
  const [hours, minutes] = time.split(':');
  const fixedHours = parseFloat(hours) + (parseFloat(days-1) * 24);
  
  return `${fixedHours}:${minutes}`;
};

export const processJSON = jsonObject => {
  const entryExitLogs = jsonObject.reduce(
    (acc, curr) => {
      const employeeName = `${curr['Card Holder']}|${curr['TagCard']}`;

      if (curr['Cardtype Desc'].toLowerCase() !== 'good') {
        return acc;
      }
      
      acc = {
        ...acc,
        [employeeName]: acc[employeeName] ? {...acc[employeeName]} : {entry:[], exit:[]},
      }

      if (curr['Lane type'].toLowerCase() === 'entry') {
        acc[employeeName]['entry'].push(curr);
      } else {
        acc[employeeName]['exit'].push(curr);
      }
      return acc;
    },
    {}
  );
  return entryExitLogs;
};

export const sortByDate = (logsArr) => {
  return logsArr.sort((a,b) => {
    return new Date(a.DateTime) - new Date(b.DateTime);
  });
};

export const getGroupedByDay = (logsArr) => {
  return logsArr.reduce((acc, log) => {
    const date = log.DateTime.split(' ')[0];

    acc = {
      ...acc,
      [date]: (acc[date] || []),
    }
    acc[date].push(log);
    
    return acc;
  }, {});
};

export const generateDays = (position, quantity, arr) => {
  if (quantity === 0) {
    return arr;
  };
  if(position === 'before') {
    let dateArr = arr[0][0].DateTime.split(' ')[0].split('');
    const entryObj = Object.assign({...arr[0][0]});
    dateArr.splice(3,2, quantity.toString().length < 2 ? `0${quantity}` : quantity);
    entryObj.DateTime = dateArr.join('');
    entryObj['Lane type'] = 'Entry';
    
    const exitObj = Object.assign({...entryObj});
    exitObj.DateTime = `${exitObj.DateTime} 23:59`
    exitObj['Lane type'] = 'Exit';
    arr.unshift([entryObj, exitObj]);
    generateDays(position, quantity - 1, arr);

  } else {
    const lastLog = arr[arr.length-1][1];
    let dateArr = lastLog.DateTime.split(' ')[0].split('');
    const entryObj = Object.assign({...lastLog});
    const day = parseFloat(dateArr.slice(3,5).join('')) + 1;

    dateArr.splice(3,2, day.toString().length < 2 ? `0${day}` : day);
    entryObj.DateTime = dateArr.join('');
    entryObj['Lane type'] = 'Entry';
    
    const exitObj = Object.assign({...entryObj});
    exitObj.DateTime = `${exitObj.DateTime} 23:59`
    exitObj['Lane type'] = 'Exit';
    
    arr.push([entryObj, exitObj]);
    generateDays(position, quantity - 1, arr);
  }
  return arr;
};

export const getFixedDays = (daysObj) => {
  const daysIterable = Object.values(daysObj);
  const daysLength = daysIterable.length - 1;
  const logsLength = daysIterable[daysLength].length - 1;
  const firstLogType = daysIterable[0][0]['Lane type'].toLowerCase();
  const lastLogType = daysIterable[daysLength][logsLength]['Lane type'].toLowerCase();


  if ( firstLogType === 'exit') {
    const firstDayOfLog = parseFloat(daysIterable[0][0].DateTime.split('/')[1]);
    // Generate first the missing entry, then generate days util first day of month
    const entryObj = Object.assign({...daysIterable[0][0]});
    entryObj.DateTime = entryObj.DateTime.split(' ')[0];
    entryObj['Lane type'] = 'Entry';
    daysIterable[0].unshift(entryObj);
    generateDays('before', firstDayOfLog - 1, daysIterable);
  };
  
  if (lastLogType === 'entry') {
    // Generate last exit, then generate missing days until last day of month
    const exitObj = Object.assign({...daysIterable[daysIterable.length - 1][daysIterable[daysLength].length - 1]});
    exitObj.DateTime = `${exitObj.DateTime.split(' ')[0]} 23:59`;
    exitObj['Lane type'] = 'Exit';
    daysIterable[daysIterable.length - 1].push(exitObj);

    let dateArr = exitObj.DateTime.split(' ')[0].split('');
    const year = parseFloat(dateArr.slice(dateArr.length-4).join(''));
    const month = parseFloat(dateArr.slice(0,2).join(''));
    const lastDay = parseFloat(dateArr.slice(3,5).join(''));
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    generateDays('after', (lastDayOfMonth - lastDay), daysIterable);
  };

  if( firstLogType === 'exit' || lastLogType === 'entry') {
    daysObj = daysIterable.reduce((acc, logsArr, idx) => {
      
      const logsReduced = logsArr.reduce((totalLogs, log) => {
        const date = log.DateTime.split(' ')[0];
        
        totalLogs = {
          ...totalLogs,
          [date]: (totalLogs[date] || []),
        }
        
        totalLogs[date].push({...log});
        return totalLogs;
      },{});
      const dates = Object.keys(logsReduced);
      acc[dates] = logsReduced[dates];
      return acc;
    }, {});
  }
  return Object.entries(daysObj).reduce((acc, [date, logs], idx)  => {
    if (logs[0]['Lane type'].toLowerCase() === 'exit') {
      const entryObj = Object.assign({...logs[0]});
      entryObj.DateTime = entryObj.DateTime.split(' ')[0];
      entryObj['Lane type'] = 'Entry';
      logs.unshift(entryObj);
    }

    if (logs[logs.length-1]['Lane type'].toLowerCase() === 'entry') {
      const exitObj = Object.assign({...logs[0]});
      exitObj.DateTime = `${exitObj.DateTime.split(' ')[0]} 23:59`;
      exitObj['Lane type'] = 'Exit';
      logs.push(exitObj);
    }

    acc = {
      ...acc,
      [date]: (acc[date]) || [],
    }
    acc[date].push(logs)
    return acc;
  }, {});
};

const convertMilliseconds = ( ms ) => {
  let seconds = ms / 1000;
  const hours = parseInt( seconds / 3600 ); 
  seconds = seconds % 3600;
  let minutes = parseInt( seconds / 60 );
  minutes = minutes.toString().length < 2 ? `0${minutes}` : minutes;
  seconds = seconds % 60;
  return `${hours}:${minutes}`;
};

export const getHoursPerDay = (daysLogs) => {
  return Object.entries(daysLogs).reduce((total, [date, logs]) => {
    total = {
      ...total,
      [date]: total[date] || '',
    }

    let totalDuration = 0;
    for (let i = 0; i < logs[0].length; i+=2) {
      let start = moment(new Date(logs[0][i].DateTime));
      let end = moment(new Date(logs[0][i + 1].DateTime));
      let duration = moment.duration(end.diff(start))
      totalDuration += duration.as('milliseconds');
    };

    total[date] = convertMilliseconds(totalDuration);

    return total;
  }, {});
};

export const getHoursPerMonth = (daysObj) => {
  const totalTiming = Object.values(daysObj).reduce((acc, time) => {
    let [hours, mins] = time.split(':');

    acc['hours'] += parseFloat(hours);
    acc['mins'] += parseFloat(mins);
    return acc;
  }, {hours: 0, mins: 0});

  const fixedHours = Math.floor(totalTiming.mins / 60) + totalTiming.hours;
  let fixedMins = totalTiming.mins % 60;
  fixedMins = fixedMins.toString().length < 2 ? `0${fixedMins}` : fixedMins;

  return `${fixedHours}:${fixedMins}`;
};

export const getWorkDays = (month, year) => {
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  let total = 0;
  for(let i = 1; i <= lastDayOfMonth; i++) {
    const dateToCheck = new Date(year, month - 1, i);
    if (dateToCheck.getDay() > 0 && dateToCheck.getDay() < 6) {
      total++;
    }
  }
  return total;
};
