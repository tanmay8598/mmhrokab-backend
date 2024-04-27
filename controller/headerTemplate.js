const headerTemplate = function (userData) {
  const today = new Date();

  return `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
      .body {
        font-size: 10px;
      }
      .invoice-container {
          margin: 0;
          padding: 0;
          padding-top: 10px;
          font-family: 'Roboto', sans-serif;
          width: 530px;
          margin: 0px auto;
          }
      
      table {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      table td, table th {
        border: 1px solid rgb(247, 247, 247);
        padding: 10px;
      }
      
      table tr:nth-child(even){background-color: #f8f8f8;}
      
      table tr:hover {background-color: rgb(243, 243, 243);}
      
      table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #FFFFFF;
        color: rgb(78, 78, 78);
      }
      
      .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 5px;
          
      
      }
      .address {
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0px 15px 0px;
          line-height: 10px;
          font-size: 12px;
          margin-top: -20px
      
      }
      
      .status {
          text-align: right;
      }
      .receipt-id {
          text-align: right;
      }
      
      .title {
          font-weight: 100px;
          text-transform: uppercase;
          color: gray;
          letter-spacing: 2px;
          font-size: 8px;
          line-height: 5px;
      }
      
      .summary {
          margin-top: 2px;
          margin-right: 0px;
          margin-left: 50%;
          margin-bottom: 15px;
      }
      
      img {
          width: 100px;
         
      }
      
      </style>
      </head>
      <body>
      <div class="invoice-container">
      
      <section  class="header">
              <div>
                <h3 style="font-size: 10px">Header</h3>
                <img style="float: left; marginRight: 8px; marginLeft: 36px; width: 25%" class="url" src="https://fiorapets.qa/static/media/WebLogo.6c4fdecbb0c2a0b699c2.png" width="10" height="10">
               </div>
              <div class="receipt-id" style="margin-top: -120px 0 40px 0">
                  
              </div>
      </section> 
      </div>
      </body>
      </html>`;
};

module.exports = headerTemplate;
