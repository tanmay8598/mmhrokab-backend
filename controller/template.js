const Template = function ({
  userData,
  driver,
  locto,
  locfrom,
  plateno,
  imgurl,
  imgurlF,
}) {
  const today = new Date().toDateString();

  function generateTable(userData) {
    let table = "<table>";
    table +=
      '<tr><th style="font-size: 12px">Name</th><th style="font-size: 12px">Passport Number</th><th style="font-size: 12px">Nationality</th><th style="font-size: 12px">Mobile</th></tr>';
    userData.forEach((item) => {
      table += `<tr><td style="font-size: 9px">${item.name}</td><td style="font-size: 9px">${item.passportNo}</td><td style="font-size: 9px">${item.nationality}</td><td style="font-size: 9px">${item.mobile}</td></tr>`;
    });
    table += "</table>";
    return table;
  }
  return `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
      @page  {
        margin: 0;
        size: letter; 
      }
   
      
       
        
      .invoice-container {
          margin: 0;
          padding: 0;
          padding-top: 10px;
        flex: 1;
          width: 730px;
          margin: 0px auto;
          margin-top: 40px;
          }
      
      table {
        border-collapse: collapse;
        width: 100%;
       
      }
     
      table td, table th {
        border: 1px solid rgb(247, 247, 247);
        padding: 10px;
       
      }
      
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: center;
        background-color: #FFFFFF;
        color: rgb(78, 78, 78);
      }
      table tr {
       
        text-align: center;
       
      }
      .extra-spacing-tr {
        height: 20px;
    }
          
      
     
      
      </style>
      </head>
      <div style='display:none'><img src=${imgurl} /></div>
      <div style='display:none'><img src=${imgurlF} /></div>
      <body>
      
      <div class="invoice-container">
      <div>
      <h2 style='text-align: center;'>قائمة اسماء الركاب</h2>  
      </div >
      <table style="text-align: center">
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${
              driver.license
            }</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">هوية</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${
              driver.name
            }</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">اسم السائق</td>
            </tr>
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${today}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">تاريخ</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${plateno}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">رقم لوحة</td>
            </tr>
            <tr>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${locto}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">الى</td>
            <td style="font-size: 9px; width: "250px"; overflow-wrap: break-word">${locfrom}</td>
            <td style="font-size: 9px; width: "50px"; overflow-wrap: break-word">متجه من</td>
            </tr>
   
    </table>
      <table style="text-align: center">
            
     
      
     ${generateTable(userData)}

    </table>
      </div>
      </body>
      </html>`;
};

module.exports = Template;
