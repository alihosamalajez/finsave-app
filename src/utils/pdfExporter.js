// 📁 src/utils/pdfExporter.js
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from "./vfs_fonts";
import { getBase64ImageFromUrl } from "./imageToBase64";
import { canvas, style } from "framer-motion/client";
pdfMake.vfs = vfs

pdfMake.fonts = {
  Amiri: {
    normal: "Amiri-Regular.ttf",
    bold: "Amiri-Bold.ttf",
    italics: "Amiri-Regular.ttf",
    bolditalics: "Amiri-Bold.ttf",
  },
};

export const exportPDF = async({ goals = [], subscriptions = [], expenses = [] }) => {
  const now = new Date().toLocaleDateString();
  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
  const maxExpense = expenses.reduce((prev, curr) => (curr.amount > prev.amount ? curr : prev), expenses[0]);
  const logoBase64 = await getBase64ImageFromUrl("./src/images/expensesIcon.png")
  
  const rtl = (str)=> str.split(" ").reverse().join(" ")

  const docDefinition = {
    content: [
      {image : logoBase64 , width : 180 , alignment : "center" , margin :[0,0,0,20] },
      { text: rtl("نظام ادارة المصاريف") , style : "coverTitle" , pageBreak : "after" },
      { text: rtl("التقرير المالي"), style: "header" , alignment : "right" , direction : "rtl" ,rtl : true},
      { text: rtl(`تاريخ التقرير: ${now}`), style: "subheader" },

      { text: rtl("أول ٣ أهداف مالية :"), style: "section" },
      buildTable(goals.slice(0, 3), ["days" , "amount" , "title"], ["المدة","القيمة","الهدف"] ,["title"]),

      { text: rtl("أول ٣ اشتراكات"), style: "section" },
      buildTable(subscriptions.slice(0, 3), ["category", "amount", "name"], ["التصنيف" , "القيمة" ,"الاسم"] , ["name"]),

      { text: "المصاريف", style: "section" },
      buildTable(expenses, ["name", "amount", "category", "date"], ["العنوان", "القيمة", "التصنيف", "التاريخ"] , ["name"]),

      { text: rtl(`إجمالي المصاريف: ${total} `), style: "stat" , rtl : true , alignment:"right"},
      { text: rtl(`أعلى مصروف: ${maxExpense?.name} - ${maxExpense?.amount} `), style: "stat" },

      {canvas : [{type : "line" , x1 : 0 , y1 : 0, x2 : 515 , y2 : 0 , lineWidth : 1 , lineColor :"#ddd"}]},
      {text : rtl("تم انشاء هذا التقرير باستخدام FinSave") , style : "footer" , margin:[0,30,0,0]},
    ],
   
    defaultStyle: {
      font: "Amiri",
      alignment: "right",
      direction: "rtl",
    },
    styles: {
      coverTitle :{
      fontSize : 28,
      bold : true , 
      alignment : "center",
      margin : [0 , 200 ,0 ,0],
      color : "#2563eb"
   },
      header: { fontSize: 20, color : "red" , bold: true, alignment: "right", margin: [0, 0, 0, 10] , direction :"rtl" },
      subheader: { fontSize: 12, color: "gray", direction: "rtl", alignment: "right", margin: [0, 0, 0, 20] },
      section: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] , color : "#1e40af" },
      stat: { fontSize: 12, margin: [0, 5, 0, 2], color: "#444" },
      footer : {fontSize : 10 , alignment : "center", color : "gray"},
    },
  };

  pdfMake.createPdf(docDefinition).open();
  
};

function buildTable(data, keys, headers , rtlFields = []) {
  return {
    table: {
      widths: Array(headers.length).fill("*"),
      body: [
        headers,
        ...data.map((item) => 
          keys.map((k) => {
            const value = item[k] || ""
            return rtlFields.includes(k) && typeof value === 'string' ?
            value.split(" ").reverse().join(" ") : value
          }))
      ],
    },
    layout: {
      fillColor : (rowIndex) => (rowIndex === 0 ? "#f3f4f6" : null),
      hLineColor : "#e5e7ed",
      vLineColor : "#e5e7ed",
    },
    alignment:"right",
    rtl: true,
    margin: [0, 0, 0, 10],
  };
}
