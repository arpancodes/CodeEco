function arrayToTable(tableData) {
  var table = $("<table></table>");
  $(tableData).each(function (i, rowData) {
    var row = $("<tr></tr>");
    $(rowData).each(function (j, cellData) {
      row.append($("<td>" + cellData + "</td>"));
    });
    table.append(row);
  });
  return table;
}

$.ajax({
  type: "GET",
  url: "./table-data.csv",
  success: function (data) {
    $("#map-section").append(arrayToTable(Papa.parse(data).data));
  },
});
