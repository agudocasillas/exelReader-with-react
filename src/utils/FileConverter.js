import React, { useState, useEffect } from 'react';
import { processJSON, sortByDate, getGroupedByDay, getFixedDays, getHoursPerDay, getHoursPerMonth } from '../utils/momentAPI';
import XLSX from 'xlsx';

const FileConverter = (props) => {
  const { updateTime } = props;
  const [selectedFile, setSelectedFile] = useState();

  const [time, setTime] = useState({});
  useEffect(() => {
    updateTime(time);
  }, [time, updateTime]);

  const uploadFile = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = event => {
    const fileReader = new FileReader();

    if (!selectedFile) {
      return;
    }

    fileReader.onload = event => {
      const data = event.target.result;

      const workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(sheet => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheet]
        );
        setTime(calcDays(processJSON(rowObject)));
      });
    };
    fileReader.readAsBinaryString(selectedFile);
  };

  const calcDays = stats => {
    return Object.entries(stats).reduce((acc, [name, typeArr], idx) => {
      const employeeLogs = {};
      const [entries, exits] = Object.values(typeArr);
      const logsSorted = sortByDate(entries.concat(exits));
      const groupedByDay = getGroupedByDay(logsSorted);
      const fixedDays = getFixedDays(groupedByDay);
      
      const dayCount = Object.keys(fixedDays).length;
      const countHoursPerDay = getHoursPerDay(fixedDays);
      const countHoursPerMonth = getHoursPerMonth(countHoursPerDay);

      employeeLogs['daysDetails'] = {...countHoursPerDay};
      employeeLogs['daysOfMonth'] = dayCount;
      employeeLogs['totalHoursMonth'] = countHoursPerMonth;

      acc = {
        ...acc,
        [name]: {...employeeLogs}
      }
      
      return acc;
    }, {});
  };

  return (
    <div>
      <input
        onChange={uploadFile}
        type='file'
        id='fileUpload'
        accept='.xls,.xlsx'
      />
      <br />
      <button onClick={handleSubmit} type='button' id='uploadExcel'>
        Convert
      </button>
    </div>
  );
};

export default FileConverter;
