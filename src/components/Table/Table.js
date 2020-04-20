import React from 'react';
import MUIDataTable from 'mui-datatables';
import './Table.scss';
import classnames from 'classnames';

const displayDetails = (rowData) => {
  const dataParsed = JSON.parse(rowData);
  return Object.entries(dataParsed).map(([date, timing], i) => {
    let isFake = false;
    let [hours, mins] = timing.split(':');
    if( hours === '23' && mins === '59') {
      isFake = true;
    }
    const clss = isFake ? 'fake' : '';
    return <li className={clss} key={i}><p><strong>{date}:</strong> {timing}</p></li>;
  });
};

const columns = [
  {
    name: 'tagCard',
    label: 'Tag Card',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'name',
    label: 'Name',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'days',
    label: 'Days',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'duration',
    label: 'Duration',
    options: {
      filter: false,
      sort: true,
      sortDirection: 'asc',
    },
  },
  {
    name: 'details',
    label: 'Details',
    options: {
      display: false,
      viewColumns: false,
    },
  }
];

const options = {
  selectableRows: 'none',
  expandableRows: true,
  expandableRowsOnClick: true,
  responsive: 'scrollMaxHeight',
  pagination: false,
  fixedHeaderOptions: {
    xAxis: true,
    yAxis: true
  },
  renderExpandableRow: (rowData, rowMeta) => {
    return (
      <tr>
        <td colSpan='11'>
          <ul className='hoursDetails'>{displayDetails(rowData[4])}</ul>
        </td>
      </tr>
    );
  },
  setRowProps: (row) => {
    const monthHours = row[3];
    let clss = '';

    if (monthHours <= lowest) {
      clss = 'low-occupation';
    } else if ( monthHours <= minimum) {
      clss = 'medium-occupation';
    }
    return {
      className: clss,
    };
  },
  // customRowRender: (data, dataIndex, rowIndex) => {
  //   console.log(data);
  //   const monthHours = data[3];
  //   let clss = '';
  //   if (monthHours <= 300) {
  //     clss = 'medium';
  //   } else if ( monthHours <= 200) {
  //     clss = 'low';
  //   }

  //   return (
  //     <>
  //       <tr className={clss}>
  //         <td></td>
  //         <td>{data[0]}</td>
  //         <td>{data[1]}</td>
  //         <td>{data[2]}</td>
  //         <td>{data[3]}</td>
  //       </tr>
  //       <tr>
  //         <td colSpan='11'>
  //           <ul className='hoursDetails'>{displayDetails(data[4])}</ul>
  //         </td>
  //       </tr>
  //     </>
  //   )
  // },
  
}

let minimum = 0;
let lowest = 0;

class Table extends React.Component {
  data =  this.props.data;
  render() {
    const monthsArr = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    minimum = this.props.minimum
    lowest = this.props.lowest
    
    return (
      <MUIDataTable
        title={`${monthsArr[parseFloat(this.props.month) - 1 ]} 
          - Workdays: ${this.props.workdays}
          - Occupation 80%: ${this.props.minimum}hrs`}
        data={this.data}
        columns={columns}
        options={options}
      />
  );}
};

export default Table;
